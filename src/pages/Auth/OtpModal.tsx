import React, { useState } from "react";
import { Loader2, ShieldCheck, X } from "lucide-react";

interface OtpModalProps {
  email: string;
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  loading: boolean;
}

export const OtpModal: React.FC<OtpModalProps> = ({
  email,
  isOpen,
  onClose,
  onVerify,
  loading,
}) => {
  const [otp, setOtp] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl border border-white overflow-hidden relative animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-10 text-center">
          <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={32} />
          </div>

          <h2 className="text-2xl font-black text-gray-900 mb-2">Verify OTP</h2>
          <p className="text-gray-500 text-sm mb-8">
            Kami telah mengirimkan kode verifikasi ke <br />
            <span className="font-bold text-gray-900">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit code"
              className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-center text-2xl font-black tracking-[0.5em] focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
              required
            />

            <button
              type="submit"
              disabled={loading || otp.length < 4}
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Verify Account"
              )}
            </button>
          </form>

          <p className="mt-8 text-xs text-gray-400 font-medium">
            Tidak menerima kode?{" "}
            <span className="text-orange-600 cursor-pointer hover:underline">
              Kirim ulang
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
