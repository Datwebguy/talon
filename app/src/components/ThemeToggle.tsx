"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  variant?: "pill" | "icon";
}

export function ThemeToggle({ className = "", variant = "pill" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-xl bg-[#F8FAFC] border border-[#E2E8F4] animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        className={`relative p-2 rounded-xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
          isDark
            ? "bg-[#162044] hover:bg-[#1E2B5C] text-blue-300 border border-[#2A3B6B] shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            : "bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#475569] hover:text-[#010FEE] border border-[#E2E8F4]"
        } ${className}`}
        title={isDark ? "Switch to light mode" : "Switch to soothing dark mode"}
      >
        {isDark ? (
          <Moon className="w-4 h-4 transition-transform duration-300 rotate-0 text-blue-300" />
        ) : (
          <Sun className="w-4 h-4 transition-transform duration-300 rotate-0 text-amber-500" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer select-none group ${
        isDark
          ? "bg-[#0F1738] hover:bg-[#141F48] text-blue-200 border border-[#1E294B] shadow-[0_2px_12px_rgba(30,58,138,0.25)]"
          : "bg-[#F8FAFC] hover:bg-[#EEF2FF] text-[#475569] hover:text-[#010FEE] border border-[#E2E8F4]"
      } ${className}`}
      title={isDark ? "Switch to light mode" : "Switch to soothing dark mode"}
    >
      <div
        className={`w-4 h-4 rounded-full flex items-center justify-center transition-transform duration-300 ${
          isDark ? "text-blue-300 rotate-[-12deg]" : "text-amber-500 rotate-0"
        }`}
      >
        {isDark ? (
          <Moon className="w-3.5 h-3.5 fill-blue-300/20" />
        ) : (
          <Sun className="w-3.5 h-3.5 fill-amber-500/20" />
        )}
      </div>
      <span className="text-[11px] font-medium tracking-tight">
        {isDark ? "Dark" : "Light"}
      </span>
      {/* Subtle indicator dot */}
      <span
        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
          isDark ? "bg-blue-400 shadow-[0_0_6px_#60A5FA]" : "bg-amber-400"
        }`}
      />
    </button>
  );
}
