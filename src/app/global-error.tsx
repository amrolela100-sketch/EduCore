"use client";

import { Inter_Tight, Cairo, JetBrains_Mono, Playfair_Display } from "next/font/google";
import Link from "next/link";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const messages = {
  ar: {
    title: "حدث خطأ في التطبيق",
    description: "حدث عطل كبير يمنع تحميل الصفحة. يرجى إعادة المحاولة.",
    retry: "إعادة تحميل التطبيق",
    home: "العودة للرئيسية",
    details: "تفاصيل الخطأ",
  },
  en: {
    title: "Application Error",
    description: "A critical error occurred preventing the page from loading. Please try again.",
    retry: "Reload Application",
    home: "Go to Homepage",
    details: "Error Details",
  },
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {

  const msg = messages.ar;

  console.error("[GlobalErrorBoundary]", {
    message: error.message,
    digest: error.digest,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${cairo.variable} ${interTight.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} h-full antialiased light`}
      style={{ colorScheme: "light" }}
    >
      <body
        className="min-h-full flex flex-col font-sans bg-surface text-ink"
        style={{ fontFamily: "var(--font-cairo), sans-serif" }}
      >
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-border-soft p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-ink mb-3">
              {msg.title}
            </h1>

            <p className="text-muted-apple mb-6 leading-relaxed">
              {msg.description}
            </p>

            <button
              onClick={reset}
              className="w-full py-3 px-6 bg-ink hover:bg-fg-2 text-white font-semibold rounded-xl transition-colors duration-200"
            >
              {msg.retry}
            </button>

            <Link
              href="/"
              className="mt-3 inline-block w-full py-3 px-6 border border-border text-ink font-body-sm text-center rounded-xl hover:bg-ink/5 transition-colors duration-200"
            >
              {msg.home}
            </Link>

            {process.env.NODE_ENV === "development" && error?.stack && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-human hover:text-ink">
                  {msg.details}
                </summary>
                <pre className="mt-2 p-3 bg-surface rounded-lg text-xs text-flag overflow-auto max-h-40 whitespace-pre-wrap">
                  {error.message}
                  {"\n\n"}
                  {error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}