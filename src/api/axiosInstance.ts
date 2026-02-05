import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

/**
 * 재시도 로직을 위한 확장 Axios 설정 인터페이스
 */
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean; // 재시도 여부 플래그
}

/**
 * Axios 인스턴스 초기화
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true, // 쿠키 포함 여부
});

let isRefreshing = false; // 토큰 갱신 중 여부
let failedQueue: any[] = []; // 토큰 갱신 대기 중인 요청 큐

/**
 * 대기 중인 요청들을 처리하는 함수
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

export default axiosInstance;

/**
 * 요청 인터셉터: 모든 요청에 Access Token 주입
 */
axiosInstance.interceptors.request.use(
  async (config) => {
    let token: string | undefined;

    // 서버 사이드 렌더링(SSR) 환경 체크
    if (typeof window === 'undefined') {
      try {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        token = cookieStore.get('accessToken')?.value;
      } catch (error) {
        console.error('Error getting server cookies:', error);
      }
    } else {
      // 클라이언트 사이드 환경
      token = Cookies.get('accessToken');
    }

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 응답 인터셉터: 401/403 에러 발생 시 토큰 자동 갱신 로직 실행
 */
axiosInstance.interceptors.response.use(
  (res) => res,
  async (err: AxiosError) => {
    const originalRequest = err.config as CustomAxiosRequestConfig;

    // 인증 에러 발생 시 (401: Unauthorized, 403: Forbidden)
    if (
      (err.response?.status === 401 || err.response?.status === 403) &&
      !originalRequest._retry
    ) {
      // 서버 사이드에서는 자동 토큰 갱신 처리가 어려우므로 즉시 에러 반환
      if (typeof window === 'undefined') {
        return Promise.reject(err);
      }

      // 이미 토큰 갱신 프로세스가 진행 중인 경우, 큐에 담아 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh Token을 이용해 새로운 Access Token 요청
        const res = await axios.post(
          `${axiosInstance.defaults.baseURL}/api/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;

        // 새로운 토큰 쿠키에 저장
        Cookies.set('accessToken', newAccessToken, {
          expires: 0.021, // 약 30분
          path: '/',
          secure: process.env.NODE_ENV === 'production',
        });

        // 전역 헤더 및 현재 요청 헤더 업데이트
        axiosInstance.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // 대기 중인 요청들 재실행
        processQueue(null, newAccessToken);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        processQueue(refreshError, null);
        Cookies.remove('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);
