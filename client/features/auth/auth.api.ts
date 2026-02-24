import { api } from "@/lib/axios-instance";

export interface ForgotPasswordOtpResponse {
    status_code: number;
    success: boolean;
    message: string;
}

export interface ChangePasswordWithOtpRequest {
    email_address: string;
    otp: string;
    new_password: string;
}

export interface ChangePasswordWithOtpResponse {
    status_code: number;
    success: boolean;
    message: string;
    data: null;
}

// Request OTP for forgot password
export const requestForgotPasswordOtp = async (email: string): Promise<ForgotPasswordOtpResponse> => {
    const response = await api.get(`/auth/forgot-password-otp/${email}`);
    return response.data;
};

// Change password with OTP
export const changePasswordWithOtp = async (
    data: ChangePasswordWithOtpRequest
): Promise<ChangePasswordWithOtpResponse> => {
    const response = await api.post(`/auth/change-password-with-otp`, data);
    return response.data;
};
