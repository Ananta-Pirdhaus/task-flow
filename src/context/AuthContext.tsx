"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
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
  AuthUser,
} from "@/types/auth";

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

  const navigate = useNavigate();

  // --- 1. Jalankan pengecekan token saat aplikasi pertama kali dimuat ---
  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");

    if (token && userData) {
      try {
        const parsedUser: AuthUser = JSON.parse(decodeURIComponent(userData));
        if (parsedUser?.id && parsedUser?.role_name) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Gagal memproses data user dari cookie", err);
        logout(); // Bersihkan jika data korup
      }
    }
    setLoading(false);
  }, []);

  // --- 3. Fungsi Login (Tahap 1: Request OTP) ---
  const login = async (payload: LoginPayload) => {
    return await loginHandler(payload);
  };

  // --- 4. Fungsi Verify OTP (Tahap 2: Verifikasi & Simpan Session) ---
  const verifyOtp = async (
    payload: VerifyOtpPayload
  ): Promise<VerifyOtpResponse> => {
    const resData = await verifyOtpHandler(payload);

    if (resData && resData.access_token) {
      const { access_token, user: userData } = resData;

      const cookieConfig = {
        expires: 7,
        secure: true,
        sameSite: "strict" as const,
      };

      // --- SET ITEM KE COOKIES ---
      Cookies.set("token", access_token, cookieConfig);
      Cookies.set("user_id", String(userData.id), cookieConfig); // Tambahkan ini
      Cookies.set("name", userData.name, cookieConfig);
      Cookies.set("role_name", userData.role_name, cookieConfig);
      Cookies.set("user", JSON.stringify(userData), cookieConfig);

      // Update state global
      setUser(userData);
      setIsAuthenticated(true);

      return {
        status: "success",
        message: "Verifikasi Berhasil",
        data: resData,
      };
    }

    throw new Error("Gagal verifikasi OTP");
  };

  // --- 5. Fungsi Register ---
  const register = async (payload: RegisterPayload) => {
    return await registerHandler(payload);
  };

  // --- 6. Fungsi Logout ---
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login");
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

// Hook kustom untuk memudahkan pemanggilan context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth harus digunakan di dalam AuthProvider");
  return context;
};
