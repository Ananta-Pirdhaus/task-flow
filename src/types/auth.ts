/* ======================================================
    GENERIC API RESPONSE
====================================================== */
export type ApiStatus = "success" | "error";

export interface ApiResponse<T = unknown> {
  status: ApiStatus;
  message: string;
  data: T; // Hilangkan '?' di sini jika backend selalu mengirimkan object data saat success
}

/* ======================================================
    AUTH PAYLOADS
====================================================== */
export interface LoginPayload {
  email: string;
  password: string;
}

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
  role_id?: number;
  role_name: string;
}

/** * Gunakan string literal "OTP_REQUIRED" agar TypeScript
 * bisa memberikan autocomplete saat kamu mengetik 'if (status === ...)'
 */
export interface LoginStep1Data {
  email: string;
  status: "OTP_REQUIRED" | string;
  message: string;
}

export interface LoginResponseData {
  access_token: string;
  token_type?: string;
  user: AuthUser;
}

/* ======================================================
    RESPONSE TYPES
====================================================== */
export type LoginResponse = ApiResponse<LoginStep1Data>;
export type VerifyOtpResponse = ApiResponse<LoginResponseData>;
export type RegisterResponse = ApiResponse<AuthUser>;
