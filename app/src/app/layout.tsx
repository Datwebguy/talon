import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Web3Provider } from "../components/Web3Provider";
import { ThemeProvider } from "../context/ThemeContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Talon | Split Coinbase Stocks on Base",
  description:
    "Split official Coinbase stock tokens into Clip and Talon on Base. Choose an exposure, then recombine when you want.",
  icons: {
    icon: [
      { url: "/talon-logo.png", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: "/talon-logo.png",
    shortcut: "/talon-logo.png",
  },
  openGraph: {
    title: "Talon | Split Coinbase Stocks on Base",
    description:
      "Split official Coinbase stock tokens into Clip and Talon on Base.",
    images: ["/talon-logo.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;
                try {
                  var origDef = Object.defineProperty;
                  Object.defineProperty = function(obj, prop, desc) {
                    if (obj === window && prop === 'ethereum') {
                      try {
                        return origDef.call(this, obj, prop, Object.assign({}, desc, { configurable: true }));
                      } catch (e) {
                        try {
                          if (desc && ('value' in desc)) {
                            window.ethereum = desc.value;
                          }
                        } catch (_) {}
                        return obj;
                      }
                    }
                    return origDef.call(this, obj, prop, desc);
                  };
                } catch (e) {}

                function suppressWalletErrors(e) {
                  var msg = (e && (e.message || (e.error && e.error.message))) || '';
                  var file = (e && e.filename) || '';
                  if (
                    typeof msg === 'string' &&
                    (msg.indexOf('redefine property: ethereum') !== -1 ||
                     (msg.indexOf('Cannot redefine property') !== -1 && file.indexOf('evmAsk.js') !== -1) ||
                     file.indexOf('evmAsk.js') !== -1)
                  ) {
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    if (e.preventDefault) e.preventDefault();
                    return true;
                  }
                }

                window.addEventListener('error', suppressWalletErrors, true);
                window.addEventListener('unhandledrejection', function(e) {
                  var reason = (e && (e.reason && (e.reason.message || e.reason))) || '';
                  if (typeof reason === 'string' && (reason.indexOf('redefine property: ethereum') !== -1 || reason.indexOf('evmAsk.js') !== -1)) {
                    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
                    if (e.preventDefault) e.preventDefault();
                    return true;
                  }
                }, true);

                try {
                  var t = localStorage.getItem('talon-theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="bg-white dark:bg-[#060919] text-[#050B24] dark:text-[#F8FAFC] min-h-screen flex flex-col selection:bg-[#010FEE] selection:text-white">
        <Web3Provider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
