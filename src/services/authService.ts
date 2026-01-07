import http from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
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
  const response = await http.post("/auth/register", payload);
  return response as unknown as RegisterResponse;
};

/* =========================
   LOGIN (Tahap 1: Request OTP)
========================= */
export const loginHandler = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const response = await http.post("/auth/login", payload);
  return response as unknown as LoginResponse;
};

/* =========================
   VERIFY OTP (Tahap 2: Get Token)
========================= */
export const verifyOtpHandler = async (
  payload: VerifyOtpPayload
): Promise<VerifyOtpResponse> => {
  const response = await http.post("/auth/verify-otp", payload);
  return response as unknown as VerifyOtpResponse;
};
