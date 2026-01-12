import { axiosInstance } from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  LoginResponseData,
  RegisterPayload,
  RegisterResponse,
  VerifyOtpPayload,
  VerifyOtpResponse,
} from "@/types/auth";

/* =========================
   REGISTER
========================= */
export const registerHandler = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post<RegisterResponse>(
    "/auth/register",
    payload
  );
  return response.data; // interceptor sudah unwrap data
};

/* =========================
   LOGIN (Tahap 1: Request OTP)
========================= */
export const loginHandler = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await axiosInstance.post<LoginResponse>(
    "/auth/login",
    payload
  );
  return response.data; // data sudah di-unwrapped
};

/* =========================
   VERIFY OTP (Tahap 2: Get Token)
========================= */
/* authService.ts */

// Ubah return type menjadi LoginResponseData karena data sudah di-unwrapped oleh interceptor
export const verifyOtpHandler = async (
  payload: VerifyOtpPayload
): Promise<LoginResponseData> => {
  const response = await axiosInstance.post<VerifyOtpResponse>(
    "/auth/verify-otp",
    payload
  );
  // @ts-ignore - jika interceptor kamu mengembalikan response.data secara global
  return response.data; 
};
