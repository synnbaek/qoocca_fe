import axiosInstance from '@/api/axiosInstance';
import {
    LoginRequest,
    LoginResponse,
    SignupRequest,
    SignupResponse,
    SendCodeRequest,
    VerifyCodeRequest,
    VerifyCodeResponse
} from '@/types/auth';

/**
 * 사용자 로그인
 */
export const login = async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>('/api/auth/login', data);
    return response.data;
};

/**
 * 사용자 회원가입
 */
export const signup = async (data: SignupRequest): Promise<SignupResponse> => {
    const response = await axiosInstance.post<SignupResponse>('/api/auth/signup', data);
    return response.data;
};

/**
 * 휴대폰 본인인증 번호 전송
 */
export const sendPhoneCode = async (data: SendCodeRequest): Promise<void> => {
    await axiosInstance.post('/api/auth/send-code', data);
};

/**
 * 휴대폰 본인인증 번호 확인
 */
export const verifyPhoneCode = async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
    const response = await axiosInstance.post<VerifyCodeResponse>('/api/auth/verify-code', data);
    return response.data;
};
