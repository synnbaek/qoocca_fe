import axios, { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // accessToken 만료 + 이미 재시도 중이면 무한 루프 방지
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          'http://localhost:8080/api/auth/refresh',
          {}, // POST body 없음
          { withCredentials: true }
        );
        const newAccessToken = res.data.accessToken;

        // 1. 쿠키에 저장
        Cookies.set('accessToken', newAccessToken);

        // 2. Authorization 헤더 갱신
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        console.log('refreshToken 요청!');

        // 3. 재요청
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh 실패:', refreshError);
        window.location.href = '/login';
      }
    }

    return Promise.reject(err);
  }
);

export default axiosInstance;
