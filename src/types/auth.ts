export type ApiStatus = "success" | "error";

export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  message: string;
  data?: T;
}

/* ======================================================
    AUTH PAYLOADS
====================================================== */
export interface LoginPayload {
  email: string;
  password: string;
}

// Payload baru untuk verifikasi OTP
export interface VerifyOtpPayload {
  email: string;
  code: string;
}

export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
  password_confirmation: string;
  role_id: number;
}

/* ======================================================
    AUTH RESPONSE DATA
====================================================== */
export interface LoginResponseData {
  token: string; // Sesuai dengan field di backend verify-otp
  token_type?: string;
  user: AuthUser;
}

// Tahap 1 login biasanya mengembalikan email atau status
export interface LoginStep1Data {
  email: string;
  status: string; // e.g., "OTP_REQUIRED"
}

/* ======================================================
    USER & OTHERS
====================================================== */
export interface AuthUser {
  id: number;
  name: string;
  username?: string;
  email: string;
  role_name: string;
}

export type LoginResponse = ApiResponse<LoginStep1Data>;
export type VerifyOtpResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<AuthUser>;
