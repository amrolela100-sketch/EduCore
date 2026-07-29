"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-context";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

const messages = {
  ar: {
    title: "حدث خطأ غير متوقع",
    description: "نعتذر عن هذا العطل. حاول تحديث الصفحة أو إعادة المحاولة.",
    retry: "إعادة المحاولة",
    home: "العودة للرئيسية",
    details: "تفاصيل الخطأ",
  },
  en: {
    title: "Something went wrong",
    description: "We apologize for the inconvenience. Try refreshing the page or clicking retry.",
    retry: "Retry",
    home: "Go to Homepage",
    details: "Error Details",
  },
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const { language, direction } = useLanguage();
  const msg = messages[language];
  const isRTL = direction === "rtl";

  console.error("[ErrorBoundary]", {
    message: error.message,
    digest: error.digest,
    stack: error.stack,
    timestamp: new Date().toISOString(),
  });

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen flex items-center justify-center bg-surface px-6"
      style={{ fontFamily: "var(--font-cairo), sans-serif" }}
    >
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
  );
}