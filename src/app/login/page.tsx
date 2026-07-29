"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useLanguage } from "@/components/language-context";
import { PageShell } from "@/components/layout/page-shell";
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { GlassInput } from "@/components/ui/glass-input";

export default function LoginPage() {

  const { t, direction, language } = useLanguage();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const ArrowIcon = direction === "rtl" ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.error) {
          const defaultErr = language === "en" ? "Invalid email or password." : "البريد الإلكتروني أو كلمة المرور غير صحيحة.";
          setError(result.error || defaultErr);
          setLoading(false);
        } else {
          setSuccess(language === "en" ? "Login successful! Redirecting..." : "تم تسجيل الدخول بنجاح! يتم الآن تحويلك...");
          await new Promise((r) => setTimeout(r, 400));
          let userRole: string | undefined;
          for (let attempt = 0; attempt < 5; attempt++) {
            const res = await fetch("/api/auth/session", { cache: "no-store" });
            const session = await res.json();
            if (session?.user?.role) {
              userRole = session.user.role;
              break;
            }
            await new Promise((r) => setTimeout(r, 200));
          }

          let targetUrl = "/candidate";
          if (userRole === "SYSTEM_ADMIN") targetUrl = "/admin/system";
          else if (userRole === "HR_ADMIN") targetUrl = "/admin/hr";
          else if (userRole === "TECH_ADMIN") targetUrl = "/admin/tech";
          else if (userRole === "CANDIDATE") targetUrl = "/candidate";
          else {
            window.location.reload();
            return;
          }
          window.location.href = targetUrl;
        }
      } else {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();

        if (!data?.success) {
          const defaultErr = language === "en" ? "Account creation failed." : "فشل إنشاء الحساب.";
          setError(data?.error || defaultErr);
          setLoading(false);
        } else {
          const defaultSuccess = language === "en" ? "Account created successfully! Please sign in." : "تم إنشاء الحساب بنجاح! الرجاء تسجيل الدخول.";
          setSuccess(data?.message || defaultSuccess);
          setIsLogin(true);
          setLoading(false);
        }
      }
    } catch (err) {
      console.error("[Auth Frontend Error]:", err);
      setError(language === "en" ? "An unexpected error occurred while processing your request." : "حدث خطأ غير متوقع أثناء معالجة طلبك.");
      setLoading(false);
    }
  };

  const backAction = (
    <Link
      href="/"
      className="font-label-caps px-4 py-2 border border-border text-ink hover:bg-ink hover:text-paper transition-all duration-300 flex items-center gap-2"
    >
      {t("backToHome")}
    </Link>
  );

  return (
    <PageShell variant="auth" navActions={backAction}>
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Paper Texture */}
        <div className="absolute inset-0 bg-paper" />
        
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 pattern-dots opacity-[0.03] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          {/* Main card */}
          <div className="p-8 editorial-card bg-paper shadow-[8px_8px_0px_0px_rgba(20,20,20,1)] border-2 border-ink">
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4, ease: [0.34, 1.3, 0.64, 1] }}
                className="w-16 h-16 bg-ink text-paper flex items-center justify-center mx-auto mb-5 border border-ink shadow-[4px_4px_0px_0px_rgba(224,62,0,1)]"
              >
                <ShieldCheck className="w-8 h-8 text-coral" />
              </motion.div>
              <h1 className="font-editorial text-4xl text-ink mb-1.5">
                {isLogin ? t("accessSystem") : t("registerFile")}
              </h1>
              <p className="font-body-sm text-ink/50">
                {isLogin ? t("securePortal") : t("openNewProfile")}
              </p>
            </div>

            <div className="flex border-2 border-ink mb-6">
              {([true, false] as const).map((mode) => (
                <button
                  key={String(mode)}
                  onClick={() => {
                    setIsLogin(mode);
                    setError("");
                    setSuccess("");
                  }}
                  className={`flex-1 py-3 text-sm uppercase text-center transition-all duration-300 cursor-pointer font-label-caps ${
                    isLogin === mode
                      ? "bg-ink text-paper"
                      : "text-ink/60 bg-paper hover:text-ink hover:bg-ink/5"
                  }`}
                >
                  {mode ? t("loginBtn") : t("signUpBtn")}
                </button>
              ))}
            </div>

            {/* Alerts */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-5 p-4 border-2 border-coral bg-coral/5 text-coral text-sm flex items-center gap-3 font-body-sm"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-bold">{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  className="mb-5 p-4 border-2 border-[#10b981] bg-[#10b981]/5 text-[#10b981] font-body-sm flex items-center gap-3 font-bold"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{success}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form action="#" onSubmit={handleSubmit} className="space-y-4 flex flex-col">
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div
                    key="name-field"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <GlassInput
                      label={t("fullName")}
                      icon={<User className="w-3.5 h-3.5" />}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t("fullNamePlaceholder")}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              <GlassInput
                name="email"
                label={t("emailAddr")}
                icon={<Mail className="w-3.5 h-3.5" />}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("emailPlaceholder")}
                required
              />

              <GlassInput
                name="password"
                label={t("password")}
                icon={<Lock className="w-3.5 h-3.5" />}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
              />

              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full font-label-caps uppercase font-bold py-4 bg-ink text-paper disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-4 border-2 border-transparent hover:bg-paper hover:text-ink hover:border-ink hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300"
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-coral" />
                    <span>{t("processing")}</span>
                  </>
                ) : (
                  <>
                    <span>{isLogin ? t("authorize") : t("createProfile")}</span>
                    <ArrowIcon className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          {/* Bottom glass hint card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-6 p-4 border border-dotted border-border text-center bg-paper"
          >
            <p className="font-label-caps text-ink/50 text-sm leading-relaxed">
              {language === "ar"
                ? "قم بإنشاء حساب جديد كمرشح أو سجل دخول بحساب موجود"
                : "Create a new candidate account or sign in with existing credentials"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </PageShell>
  );
}


