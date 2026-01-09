import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Lock,
  UserCircle,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  CheckCircle2, // Icon tambahan untuk nuansa task management
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
// Pastikan mengganti asset image ini dengan yang bernuansa productivity/task
import RegisterImages from "@/assets/register_images.svg";
import type { RegisterPayload } from "@/types/auth";

const DEFAULT_ROLE_ID = 2;

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  // State
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload: RegisterPayload = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role_id: DEFAULT_ROLE_ID,
      };

      const response = await register(payload);

      if (response.status === "success") {
        toast.success("Account created successfully! Welcome.");
        navigate("/login");
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4 md:p-6">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex overflow-hidden border border-gray-100">
        {/* LEFT SIDE: FORM */}
        <div className="w-full lg:w-1/2 p-8 sm:p-12 md:p-16">
          <div className="max-w-md mx-auto">
            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
                Create Your Workspace
              </h1>
              <p className="text-gray-500">
                Join thousands of teams managing their tasks efficiently. Get
                started for free.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ModernInput
                  icon={<User size={18} />}
                  label="Full Name"
                  value={formData.name}
                  onChange={(val) => handleChange("name", val)}
                />
                <ModernInput
                  icon={<UserCircle size={18} />}
                  label="Username"
                  value={formData.username}
                  onChange={(val) => handleChange("username", val)}
                />
              </div>

              <ModernInput
                icon={<Mail size={18} />}
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(val) => handleChange("email", val)}
              />

              <ModernInput
                icon={<Lock size={18} />}
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(val) => handleChange("password", val)}
                rightElement={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-orange-500 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <ModernInput
                icon={<Lock size={18} />}
                label="Confirm Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(val) => handleChange("confirmPassword", val)}
              />

              <button
                type="submit"
                disabled={loading}
                className="group w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold shadow-lg shadow-orange-200 transition-all duration-300 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </>
                )}
              </button>

              <p className="text-center text-gray-500 text-sm mt-8">
                Already using TaskFlow?{" "}
                <Link
                  to="/login"
                  className="text-orange-600 font-bold hover:text-orange-700 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: VISUAL (Task Management Focused) */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-orange-50 to-indigo-100 items-center justify-center p-12 relative">
          <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10 w-full max-w-lg">
            <img
              src={RegisterImages}
              alt="Task Management Illustration"
              className="w-full h-auto drop-shadow-2xl animate-float"
            />
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 bg-orange-600/10 text-orange-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <CheckCircle2 size={16} />
                <span>Everything in one place</span>
              </div>
              <h2 className="text-2xl font-bold text-orange-900 mb-2">
                Organize. Collaborate. Achieve.
              </h2>
              <p className="text-orange-700/80">
                Streamline your workflow, track project progress, and reach your
                goals faster with our intuitive platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

/* ... ModernInput Component Tetap Sama ... */
/* -------------------------------------------------------------------------- */
/* MODERN INPUT COMPONENT                            */
/* -------------------------------------------------------------------------- */

interface ModernInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const ModernInput: React.FC<ModernInputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  icon,
  rightElement,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-1.5 w-full">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label}
      </label>
      <div
        className={`
        relative flex items-center transition-all duration-300 border-2 rounded-xl px-4 py-3
        ${
          isFocused
            ? "border-orange-400 bg-white ring-4 ring-orange-50"
            : "border-gray-100 bg-gray-50"
        }
      `}
      >
        {icon && (
          <span
            className={`${
              isFocused ? "text-orange-500" : "text-gray-400"
            } mr-3 transition-colors`}
          >
            {icon}
          </span>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-transparent w-full outline-none text-gray-700 placeholder:text-gray-300"
          placeholder={`Enter ${label.toLowerCase()}`}
          required
        />
        {rightElement && <div className="ml-2">{rightElement}</div>}
      </div>
    </div>
  );
};
