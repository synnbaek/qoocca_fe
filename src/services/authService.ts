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

export const authService = {
    /**
     * 이메일 로그인
     */
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await axiosInstance.post<LoginResponse>('/api/auth/login', data);
        return response.data;
    },

    /**
     * 회원가입
     */
    signup: async (data: SignupRequest): Promise<SignupResponse> => {
        const response = await axiosInstance.post<SignupResponse>('/api/auth/signup', data);
        return response.data;
    },

    /**
     * 휴대폰 인증번호 발송
     */
    sendPhoneCode: async (data: SendCodeRequest): Promise<void> => {
        await axiosInstance.post('/api/auth/send-code', data);
    },

    /**
     * 휴대폰 인증번호 확인
     */
    verifyPhoneCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
        const response = await axiosInstance.post<VerifyCodeResponse>('/api/auth/verify-code', data);
        return response.data;
    }
};
