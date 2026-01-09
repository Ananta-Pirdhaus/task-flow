/* ======================================================
    GENERIC API RESPONSE
====================================================== */
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
    USER & AUTH DATA
====================================================== */
export interface AuthUser {
  id: number;
  name: string;
  username?: string;
  email: string;
  role_id?: number; // tambahkan role_id sesuai response backend
  role_name: string;
}

// Data step 1 login (misal login awal sebelum OTP)
export interface LoginStep1Data {
  email: string;
  status: string; // e.g., "OTP_REQUIRED"
}

// Data login/OTP berhasil
export interface LoginResponseData {
  access_token: string; // Sesuai backend
  token_type?: string;
  user: AuthUser;
}

/* ======================================================
    RESPONSE TYPES
====================================================== */
export type LoginResponse = ApiResponse<LoginStep1Data>; // Step 1 login
export type VerifyOtpResponse = ApiResponse<LoginResponseData>; // Step 2 OTP
export type RegisterResponse = ApiResponse<AuthUser>;
