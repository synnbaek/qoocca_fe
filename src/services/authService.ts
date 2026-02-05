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

/**
 * 인증 및 권한 관리 비즈니스 로직 서비스
 */
export const authService = {
    /**
     * 로그인을 수행합니다.
     */
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        return await authApi.login(data);
    },

    /**
     * 신규 회원가입을 수행합니다.
     */
    signup: async (data: SignupRequest): Promise<SignupResponse> => {
        return await authApi.signup(data);
    },

    /**
     * 휴대폰 본인 인증을 위한 인증번호를 발송합니다.
     */
    sendPhoneCode: async (data: SendCodeRequest): Promise<void> => {
        await authApi.sendPhoneCode(data);
    },

    /**
     * 발송된 휴대폰 인증번호의 유효성을 확인합니다.
     */
    verifyPhoneCode: async (data: VerifyCodeRequest): Promise<VerifyCodeResponse> => {
        return await authApi.verifyPhoneCode(data);
    }
};
