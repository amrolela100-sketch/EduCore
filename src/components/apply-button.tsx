"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface ApplyButtonProps {
  jobPostingId: string;
}

export function ApplyButton({ jobPostingId }: ApplyButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobPostingId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "حدث خطأ أثناء التقديم على الوظيفة.");
        setLoading(false);
        return;
      }

      // Smooth page refresh upon fast successful application creation
      window.location.reload();
    } catch (err) {
      console.error("[APPLY ACTION ERROR]:", err);
      alert("حدث خطأ في شبكة الاتصال أثناء التقديم.");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleApply} className="w-full md:w-auto">
      <button
        type="submit"
        disabled={loading}
        className="font-label-caps px-6 py-3 bg-coral text-paper border-2 border-transparent hover:bg-paper hover:text-coral hover:border-coral hover:shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] uppercase w-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 transition-all duration-300"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin text-coral" />
            <span>جاري التقديم والمطابقة...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>Apply & Match</span>
          </>
        )}
      </button>
    </form>
  );
}
