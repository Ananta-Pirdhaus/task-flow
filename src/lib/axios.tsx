import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";

/* ======================
    UTILITY FUNCTIONS
====================== */

const deleteCookie = (name: string) => {
  // Path=/ sangat penting agar cookie benar-benar terhapus di semua halaman
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const clearAuthSession = () => {
  const targetCookies = ["token", "name", "role_name", "user"];
  targetCookies.forEach((name) => deleteCookie(name));

  // Bersihkan juga localStorage jika kamu menyimpan data di sana
  localStorage.clear();
};

const getCookieToken = (name: string = "token"): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
};

/* ======================
    AXIOS INSTANCE
====================== */

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

/* ======================
    INTERCEPTORS
====================== */

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookieToken("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  (error: AxiosError) => {
    const status = error.response?.status;
    const isLoginPage = window.location.pathname === "/login";

    // HANYA redirect jika kena 401/403 DAN user sedang TIDAK di halaman login
    if ((status === 401 || status === 403) && !isLoginPage) {
      clearAuthSession();
      window.location.replace("/login");
      return Promise.reject(error);
    }

    // Jika error terjadi SAAT di halaman login, jangan redirect (biarkan tampil error message)
    const data = error.response?.data as any;
    const errorMessage =
      data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(errorMessage));
  }
);
