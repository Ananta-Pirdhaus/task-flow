"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
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

interface AuthUser {
  id: number;
  name: string;
  username?: string;
  email: string;
  role_id?: number;
  role_name: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  login: (payload: LoginPayload) => Promise<LoginResponse>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<VerifyOtpResponse>;
  register: (payload: RegisterPayload) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AuthUser | null>(null);

  // --- Check auth status on app load ---
  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");

    if (token && userData) {
      try {
        const parsedUser: AuthUser = JSON.parse(decodeURIComponent(userData));
        if (parsedUser?.id && parsedUser?.role_name) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to parse user cookie", err);
        setUser(null);
        setIsAuthenticated(false);
      }
    }
    setLoading(false);
  }, []);

  // --- Login (OTP request) ---
  const login = async (payload: LoginPayload) => {
    return await loginHandler(payload);
  };

  // --- Verify OTP ---
  const verifyOtp = async (payload: VerifyOtpPayload) => {
    const response = await verifyOtpHandler(payload);

    if (response.status === "success" && response.data?.access_token) {
      const { access_token, user } = response.data;

      // Simpan token
      Cookies.set("token", access_token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      // Simpan user lengkap
      Cookies.set("user", JSON.stringify(user), {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      setUser(user);
      setIsAuthenticated(true);
    }

    return response;
  };

  // --- Register ---
  const register = async (payload: RegisterPayload) => {
    return await registerHandler(payload);
  };

  // --- Logout ---
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
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

// --- Hook untuk pakai context ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
