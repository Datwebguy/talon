"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TalonLogo } from "./TalonLogo";
import { Code2 } from "lucide-react";

interface FooterProps {
  isApp?: boolean;
}

function XTwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function Footer({ isApp = false }: FooterProps) {
  const pathname = usePathname();

  // If rendered in root layout and inside /app, skip to avoid duplicate outside sidebar
  if (!isApp && pathname?.startsWith("/app")) {
    return null;
  }

  return (
    <footer className="relative overflow-hidden bg-[#010FEE] border-t border-[#000EB5] text-white transition-colors">
      {/* Giant Roman Serif Watermark Typography across bottom behind the divider */}
      <div
        className="absolute inset-x-0 bottom-[-14px] sm:bottom-[-24px] md:bottom-[-36px] lg:bottom-[-46px] xl:bottom-[-56px] flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
        aria-hidden="true"
      >
        <span className="font-serif font-light text-[84px] sm:text-[145px] md:text-[200px] lg:text-[260px] xl:text-[320px] tracking-[0.20em] sm:tracking-[0.25em] text-white/[0.08] leading-none uppercase translate-y-1 sm:translate-y-2">
          TALON
        </span>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Column 1: Brand, Tagline, & Quick Action Icons */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <TalonLogo className="h-6 w-6 sm:h-7 sm:w-7 shadow-md" size={28} rounded="lg" />
              <span className="font-black text-lg sm:text-xl tracking-tight text-white group-hover:text-blue-100 transition-colors">
                TALON
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-sm">
              Split official Coinbase stock tokens into Clip and Talon on Base.
            </p>

            {/* Quick Action / Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href="https://x.com/TalonOnBase"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center justify-center shadow-xs cursor-pointer"
                title="Follow Talon on X"
              >
                <XTwitterIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://github.com/Datwebguy/talon"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center justify-center shadow-xs cursor-pointer"
                title="Talon on GitHub"
              >
                <GithubIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://basescan.org/address/0x06808A1F1Ea2A9C85b44269dd48e8C6F6003D10A"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all flex items-center justify-center shadow-xs cursor-pointer"
                title="Verified Contracts on Basescan"
              >
                <Code2 className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Column 2: PROTOCOL */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-blue-200">
              PROTOCOL
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/app/markets" className="text-white/80 hover:text-white transition-colors">
                  Markets
                </Link>
              </li>
              <li>
                <Link href="/app/vault" className="text-white/80 hover:text-white transition-colors">
                  Vault
                </Link>
              </li>
              <li>
                <Link href="/app/portfolio" className="text-white/80 hover:text-white transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/docs#governance" className="text-white/80 hover:text-white transition-colors">
                  Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: RESOURCES */}
          <div className="lg:col-span-3 space-y-3.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-blue-200">
              RESOURCES
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/docs" className="text-white/80 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/pitch" className="text-white/80 hover:text-white transition-colors">
                  Whitepaper
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: COMMUNITY */}
          <div className="lg:col-span-2 space-y-3.5">
            <h4 className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-blue-200">
              COMMUNITY
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://x.com/TalonOnBase"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <XTwitterIcon className="w-3 h-3" />
                  <span>X (Twitter)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Datwebguy/talon"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/80 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  <GithubIcon className="w-3 h-3" />
                  <span>GitHub</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Thin Divider Line that passes right across the watermark */}
        <div className="mt-12 sm:mt-16 pt-6 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-100/75">
          <div>
            © 2026 Talon Protocol. Built on Base. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/docs#terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/docs#privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
