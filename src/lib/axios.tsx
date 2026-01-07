import axios, {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

// Ambil Base URL dari env (Pastikan di .env namanya VITE_LOCAL_BACKEND_ACP)
const BASE_URL_ACP =
  import.meta.env.VITE_LOCAL_BACKEND_ACP || "http://127.0.0.1:8080/api";

/* ======================
   INSTANCE CONFIG
====================== */

// Instance 1: Untuk API umum/internal (proxy Vite)
const http: AxiosInstance = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Instance 2: Untuk Backend ACP Spesifik
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL_ACP,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/* ======================
   HELPER INTERCEPTOR
====================== */
// Kita buat fungsi reusable agar tidak menulis kode interceptor dua kali
const addInterceptors = (instance: AxiosInstance) => {
  // REQUEST: Pasang token secara dinamis setiap kali ada request
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem("access_token"); // samakan key-nya, tadi ada 'token' dan 'access_token'
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  // RESPONSE: Handle error global (seperti 401)
  instance.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};

// Pasang interceptor ke kedua instance
addInterceptors(http);
addInterceptors(axiosInstance);

export { axiosInstance };
export default http;
