import * as authApi from '@/api/authApi';
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
        return await authApi.login(data);
    },

    /**
     * 회원가입
     */
    signup: async (data: SignupRequest): Promise<SignupResponse> => {
        return await authApi.signup(data);
    },

    /**
     * 휴대폰 인증번호 발송
     */
    sendPhoneCode: async (data: SendCodeRequest): Promise<void> => {
        await authApi.sendPhoneCode(data);
    },

    /**
     * 휴대폰 인증번호 확인
     */
    verifyPhoneCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
        return await authApi.verifyPhoneCode(data);
    }
};
