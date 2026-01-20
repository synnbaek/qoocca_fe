import { AcademyInfo } from './dashboard';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    academyId?: number;
    academies?: AcademyInfo[];
}

export interface SignupRequest {
    username: string;
    email: string;
    password: string;
    phone: string;
    code: string;
    agreements: {
        service: boolean;
        privacy: boolean;
        thirdParty: boolean;
        marketing: boolean;
    } | null;
}

export interface SignupResponse {
    accessToken: string;
    academyId?: number;
    academies?: AcademyInfo[];
}

export interface SendCodeRequest {
    phone: string;
    isSocial?: boolean;
}

export interface VerifyCodeRequest {
    phone: string;
    code: string;
}

export interface VerifyCodeResponse {
    isExistingUser: boolean;
}
