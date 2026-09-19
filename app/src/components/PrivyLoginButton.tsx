"use client";

import { usePrivy } from "@privy-io/react-auth";
import { Mail, Sparkles } from "lucide-react";

export function PrivyLoginButton({ onSuccess }: { onSuccess?: () => void }) {
  const { login } = usePrivy();

  const handleLogin = () => {
    login();
    if (onSuccess) onSuccess();
  };

  return (
    <button
      onClick={handleLogin}
      className="w-full p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#010FEE]/10 to-indigo-500/10 hover:from-[#010FEE]/20 hover:to-indigo-500/20 border border-[#010FEE]/30 hover:border-[#010FEE] transition-all flex items-center justify-between group text-left shadow-sm"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-[#010FEE] text-white flex items-center justify-center shrink-0 shadow-sm">
          <Mail className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#050B24] dark:text-white group-hover:text-[#010FEE] dark:group-hover:text-blue-400 transition-colors">
              Email or Social Login
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#010FEE] text-white">
              Instant
            </span>
          </div>
          <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
            Google, Apple, Email, or Passkey
          </div>
        </div>
      </div>
      <Sparkles className="w-4 h-4 text-[#010FEE] dark:text-blue-400 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
    </button>
  );
}
