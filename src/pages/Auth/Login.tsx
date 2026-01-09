"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Zap,
  CheckCircle2,
  Clock,
  Layout,
} from "lucide-react";
import { OtpModal } from "./OtpModal";

// --- MODERN INPUT COMPONENT ---
interface ModernInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  placeholder: string;
}

const ModernInput: React.FC<ModernInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
  rightElement,
  placeholder,
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="space-y-1.5 w-full group">
      <label
        className={`text-[11px] font-bold uppercase tracking-wider transition-colors duration-300 ${
          focused ? "text-orange-600" : "text-gray-500"
        }`}
      >
        {label}
      </label>
      <div
        className={`flex items-center px-4 py-3.5 rounded-xl border-2 transition-all duration-300 bg-white/50 backdrop-blur-sm ${
          focused
            ? "border-orange-500 ring-4 ring-orange-500/10 shadow-lg shadow-orange-500/5"
            : "border-gray-100 hover:border-gray-200"
        }`}
      >
        <span
          className={`${
            focused ? "text-orange-500" : "text-gray-400"
          } transition-colors duration-300`}
        >
          {icon}
        </span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent border-none outline-none px-3 text-sm font-medium text-gray-900 placeholder:text-gray-400"
          placeholder={placeholder}
          required
        />
        {rightElement}
      </div>
    </div>
  );
};

// --- MAIN LOGIN COMPONENT ---
const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, verifyOtp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await login(formData);

      // Cek apakah butuh OTP
      if (
        response.status === "success" &&
        response.data?.status === "OTP_REQUIRED"
      ) {
        toast.info(response.message);
        setShowOtpModal(true); // Tampilkan modal
      } else {
        toast.error("Terjadi kesalahan sistem");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

 const handleVerifyOtp = async (otpCode: string) => {
   setOtpLoading(true);
   try {
     const response = await verifyOtp({
       email: formData.email,
       code: otpCode,
     });

     if (response.status === "success") {
       toast.success("Login Successful!");
       setShowOtpModal(false);

       // --- Redirect Dinamis Berdasarkan Role ---
       if (response.data?.user?.role_name === "Admin") {
         navigate("/admin/analytics", { replace: true });
       } else if (response.data?.user?.role_name === "Project Lead") {
         navigate("/project-leader/dashboard", { replace: true });
       } else {
         navigate("/", { replace: true }); // Employee / default
       }
     }
   } catch (error: any) {
     toast.error(error.response?.data?.message || "Invalid OTP Code");
   } finally {
     setOtpLoading(false);
   }
 };


  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden ">
      <OtpModal
        isOpen={showOtpModal}
        email={formData.email}
        onClose={() => setShowOtpModal(false)}
        onVerify={handleVerifyOtp}
        loading={otpLoading}
      />
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-200/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl w-full bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex overflow-hidden border border-white/20 relative z-10">
        {/* LEFT SIDE: FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="max-w-sm mx-auto w-full">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                <Zap fill="currentColor" size={20} />
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900">
                TaskFlow<span className="text-orange-500">.</span>
              </span>
            </div>

            <div className="mb-8 text-left">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm font-medium">
                Please enter your details to sign in.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <ModernInput
                icon={<Mail size={18} />}
                label="Email Address"
                type="email"
                placeholder="name@company.com"
                value={formData.email}
                onChange={(val) => handleChange("email", val)}
              />

              <div className="space-y-1">
                <ModernInput
                  icon={<Lock size={18} />}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(val) => handleChange("password", val)}
                  rightElement={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-orange-500 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-xs font-semibold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 bg-gray-900 hover:bg-orange-600 text-white rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl shadow-gray-200 hover:shadow-orange-200 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-gray-900 hover:text-orange-600 transition-colors border-b-2 border-orange-100 hover:border-orange-500"
                >
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: HERO VISUAL */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-50 to-orange-50 border-l border-gray-100 relative items-center justify-center p-12 overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-orange-200/50 rounded-full opacity-50" />

          <div className="relative z-10 w-full max-w-sm">
            {/* Floating Task Card 1 */}
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 mb-4 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Landing Page Design
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase">
                    Completed
                  </p>
                </div>
              </div>
            </div>

            {/* Main Feature Card */}
            <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white mb-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <Layout size={80} />
              </div>
              <p className="text-lg font-bold text-gray-900 leading-relaxed mb-6 italic">
                "TaskFlow membantu tim kami tetap fokus dan mencapai target 2x
                lebih cepat."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-orange-200">
                  AP
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Ananta Pirdhaus
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-tight">
                    Lead Developer
                  </p>
                </div>
              </div>
            </div>

            {/* Floating Task Card 2 */}
            <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 ml-12 transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    Weekly Sprint
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium uppercase">
                    In Progress
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
