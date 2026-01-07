"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  loginHandler,
  registerHandler,
  verifyOtpHandler,
} from "@/services/authService";
import type {
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  LoginResponse,
  VerifyOtpResponse,
} from "@/types/auth";

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<VerifyOtpResponse>;
  register: (payload: RegisterPayload) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check auth status on load
  useEffect(() => {
    const token = Cookies.get("access_token");
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  /* --- Step 1: Login --- */
  const login = async (payload: LoginPayload) => {
    return await loginHandler(payload);
    // Kita tidak set Authenticated di sini karena butuh OTP
  };

  /* --- Step 2: Verify OTP --- */
  const verifyOtp = async (payload: VerifyOtpPayload) => {
    const response = await verifyOtpHandler(payload);

    if (response.status === "success" && response.data?.token) {
      // Simpan ke Cookies
      Cookies.set("access_token", response.data.token, {
        expires: 7, // 7 hari
        secure: true,
        sameSite: "strict",
      });
      setIsAuthenticated(true);
    }
    return response;
  };

  const register = async (payload: RegisterPayload) => {
    return await registerHandler(payload);
  };

  const logout = () => {
    Cookies.remove("access_token");
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        login,
        verifyOtp,
        register,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
