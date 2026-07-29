"use client";

interface AgentTelemetryTabProps {
  auditLogs: string[];
}

export function AgentTelemetryTab({ auditLogs }: AgentTelemetryTabProps) {
  return (
    <div className="space-y-8 animate-fade-in-up">
      <div>
        <h2 className="font-editorial text-3xl font-bold text-ink mb-2">
          Infrastructure & Telemetry Audit Trail
        </h2>
        <p className="font-body-sm text-ink/70">
          Real-time record of system setting modifications, provider API test assertions, and security status updates.
        </p>
      </div>

      <div className="border-2 border-border bg-ink text-paper font-mono text-sm p-6 h-96 overflow-y-auto space-y-3 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] transition-all duration-300">
        {auditLogs.map((log, idx) => (
          <div key={idx} className="leading-relaxed animate-fade-in border-b-2 border-dotted border-paper/20 pb-2">
            <span className="text-coral font-bold mr-2">[{log.includes("FAILED") || log.includes("Error") ? "ERROR" : "AUDIT"}]</span> {log}
          </div>
        ))}
      </div>
    </div>
  );
}
