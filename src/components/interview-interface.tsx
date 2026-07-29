"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { InterviewCodeTerminal } from "@/components/interview/interview-code-terminal";
import { InterviewTelemetryPanel } from "@/components/interview/interview-telemetry-panel";

interface InterviewInterfaceProps {
  applicationId: string;
  interviewSessionId: string;
  challengeTitle: string;
  challengeDescription: string;
  questions: string[];
  challengeType?: string;
}

const STORAGE_KEY = (id: string) => `educore:interview:${id}:code`;
const STORAGE_LANG_KEY = (id: string) => `educore:interview:${id}:lang`;

const templates: Record<string, string> = {
  typescript: `// Write your TypeScript solution here\nexport function processSkills(skillsList: string[]): string[] {\n  const verified = skillsList.filter(skill => skill.trim().length > 0);\n  return Array.from(new Set(verified));\n}\n\nconsole.log("Telemetry check ready.");`,
  javascript: `// Write your JavaScript solution here\nfunction processSkills(skillsList) {\n  const verified = skillsList.filter(skill => skill.trim().length > 0);\n  return Array.from(new Set(verified));\n}\n\nconsole.log("Telemetry check ready.");`,
  python: `# Write your Python 3 solution here\ndef process_skills(skills_list: list) -> list:\n    verified = [s.strip() for s in skills_list if s.strip()]\n    return list(set(verified))\n\nprint("Telemetry check ready.")`,
  go: `// Write your Go solution here\npackage main\nimport "fmt"\nfunc main() {\n    fmt.Println("Telemetry check ready.")\n}`,
};

export function InterviewInterface({
  applicationId,
  interviewSessionId,
  challengeTitle,
  challengeDescription,
  questions = [],
}: InterviewInterfaceProps) {

  // Initialize from localStorage or template
  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_LANG_KEY(interviewSessionId));
      if (saved && templates[saved]) return saved;
    }
    return "typescript";
  });

  const [code, setCode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY(interviewSessionId));
      if (saved) return saved;
    }
    return templates.typescript;
  });

  const [outputLog, setOutputLog] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evaluation, setEvaluation] = useState<{
    overallScore: number;
    qualityScore: number;
    problemSolvingScore: number;
    communicationScore: number;
    justification: string;
  } | null>(null);

  // Persist code to localStorage on every change (debounced)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleCodeChange = useCallback(
    (newCode: string) => {
      setCode(newCode);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        localStorage.setItem(STORAGE_KEY(interviewSessionId), newCode);
      }, 500);
    },
    [interviewSessionId]
  );

  // Persist language
  useEffect(() => {
    localStorage.setItem(STORAGE_LANG_KEY(interviewSessionId), language);
  }, [language, interviewSessionId]);

  const handleLanguageChange = useCallback(
    (lang: string) => {
      if (lang === language) return;

      const hasChanges = code !== templates[language];
      if (hasChanges) {
        const confirmed = window.confirm(
          "تغيير اللغة سيعيد الكود للقالب الافتراضي. هل أنت متأكد؟"
        );
        if (!confirmed) return;
      }

      setLanguage(lang);
      if (templates[lang]) {
        setCode(templates[lang]);
        localStorage.setItem(STORAGE_KEY(interviewSessionId), templates[lang]);
      }
    },
    [code, language, interviewSessionId]
  );

  const handleRunTest = useCallback(async () => {
    const timestamp = new Date().toLocaleTimeString();
    setOutputLog((prev) => [
      ...prev,
      `[${timestamp}] ⚙️ Executing sandboxed code build (${language.toUpperCase()})...`,
    ]);

    try {
      const res = await fetch("/api/run-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data = await res.json();

      if (data.success) {
        const logs: string[] = data.logs || [];
        const resultText = data.result ? `[RETURN]: ${data.result}` : "";
        const execTime = data.executionTimeMs ?? 0;

        setOutputLog((prev) => [
          ...prev,
          ...(logs.length > 0 ? logs : ["(No console logs printed)"]),
          ...(resultText ? [resultText] : []),
          `[SUCCESS] Executed in ${execTime}ms.`,
        ]);
      } else {
        setOutputLog((prev) => [
          ...prev,
          `[EXECUTION ERROR]: ${data.error || "Failed to execute code."}`,
        ]);
      }
    } catch (err) {
      setOutputLog((prev) => [
        ...prev,
        `[NETWORK ERROR]: ${err instanceof Error ? err.message : "Connection failed."}`,
      ]);
    }
  }, [code, language]);

  const handleReset = useCallback(() => {
    const confirmed = window.confirm(
      "هل أنت متأكد من إعادة تعيين الكود؟ سيتم مسح جميع التغييرات."
    );
    if (!confirmed) return;

    const tpl = templates[language] || "";
    setCode(tpl);
    localStorage.setItem(STORAGE_KEY(interviewSessionId), tpl);
    setOutputLog([]);
    setEvaluation(null);
  }, [language, interviewSessionId]);

  const handleSubmitAssessment = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        question: q,
        answer: "تم إجابة وتطبيق المطلوب عبر كود البناء البرمجي المرفق.",
      }));

      const res = await fetch("/api/evaluate-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          interviewSessionId,
          submittedCode: code,
          answers: formattedAnswers,
          language,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Evaluation request failed");
      }

      const data = await res.json();
      setEvaluation({
        overallScore: data?.assessment?.overallScore ?? 0,
        qualityScore: data?.assessment?.codeQualityScore ?? 0,
        problemSolvingScore: data?.assessment?.problemSolvingScore ?? 0,
        communicationScore: data?.assessment?.communicationScore ?? 0,
        justification:
          data?.assessment?.justification ||
          "تم تقييم الأكواد ومطابقتها للمعايير الفنية بنجاح.",
      });

      setOutputLog((prev) => [
        ...prev,
        `[EVALUATION COMPLETE] Overall Score: ${data?.assessment?.overallScore ?? 0}%`,
      ]);
    } catch (err) {
      console.error("[EVALUATION ERROR]:", err);
      setEvaluation(null);
      setOutputLog((prev) => [
        ...prev,
        `[ERROR] فشل التقييم: ${err instanceof Error ? err.message : "خطأ غير معروف"}`,
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [applicationId, interviewSessionId, code, questions, language]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]"
      style={{ height: "calc(100vh - 140px)" }}
    >
      {/* Left Column: Telemetry & Evaluation */}
      <div className="lg:col-span-5 h-full">
        <InterviewTelemetryPanel
          evaluation={evaluation}
          isEvaluating={isSubmitting}
          challengeTitle={challengeTitle}
          challengeDescription={challengeDescription}
          questions={questions}
        />
      </div>

      {/* Right Column: Sandboxed Code Editor */}
      <div className="lg:col-span-7 h-full">
        <InterviewCodeTerminal
          language={language}
          setLanguage={handleLanguageChange}
          code={code}
          setCode={handleCodeChange}
          outputLog={outputLog}
          isSubmitting={isSubmitting}
          onRunTest={handleRunTest}
          onReset={handleReset}
          onSubmitAssessment={handleSubmitAssessment}
        />
      </div>
    </div>
  );
}
