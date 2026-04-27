import { useState } from "react";

const EMPLOYEES = [
  { id: "E001", name: "Alice Johnson", dept: "Engineering", avatar: "AJ" },
  { id: "E002", name: "Bob Smith", dept: "Marketing", avatar: "BS" },
  { id: "E003", name: "Carol White", dept: "HR", avatar: "CW" },
  { id: "E004", name: "David Lee", dept: "Engineering", avatar: "DL" },
  { id: "E005", name: "Eva Chen", dept: "Finance", avatar: "EC" },
  { id: "E006", name: "Frank Patel", dept: "Marketing", avatar: "FP" },
  { id: "E007", name: "Grace Kim", dept: "HR", avatar: "GK" },
  { id: "E008", name: "Henry Osei", dept: "Engineering", avatar: "HO" },
];

const TASKS = [
  "Analyze today's attendance. Who is present, late, or absent? Flag anomalies.",
  "Draft alert messages for managers about absent or late employees.",
  "Generate a department-wise attendance report with recommendations.",
];

function generateAttendance() {
  return EMPLOYEES.map((emp) => {
    const roll = Math.random();
    let status, checkIn, checkOut;
    if (roll < 0.12) {
      status = "Absent";
      checkIn = null;
      checkOut = null;
    } else if (roll < 0.28) {
      status = "Late";
      checkIn = `${10 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} AM`;
      checkOut = `${5 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} PM`;
    } else {
      status = "Present";
      checkIn = `${8 + Math.floor(Math.random() * 1)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} AM`;
      checkOut = `${5 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} PM`;
    }
    return {
      ...emp,
      status,
      checkIn,
      checkOut,
      anomaly: Math.random() > 0.78,
    };
  });
}

export default function App() {
  const [attendance, setAttendance] = useState([]);
  const [agentLog, setAgentLog] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasRun, setHasRun] = useState(false);

  const present = attendance.filter((e) => e.status === "Present").length;
  const late = attendance.filter((e) => e.status === "Late").length;
  const absent = attendance.filter((e) => e.status === "Absent").length;
  const anomalies = attendance.filter((e) => e.anomaly).length;

  const runAgent = async () => {
    setLoading(true);
    setHasRun(true);
    const data = generateAttendance();
    setAttendance(data);
    setAgentLog([]);
    setAlerts([]);
    setReport(null);

    for (let i = 0; i < TASKS.length; i++) {
      setCurrentStep(i + 1);

      const prompt = `You are an HR Attendance AI Agent.
Attendance Data: ${JSON.stringify(data)}
Task: ${TASKS[i]}
Reply ONLY with JSON, no markdown:
{"summary":"...","alerts":["..."],"recommendations":["..."]}`;

      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });
        const result = await res.json();
        const text = result.content?.map((c) => c.text || "").join("") || "{}";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        setAgentLog((prev) => [...prev, { step: i + 1, ...parsed }]);
        if (parsed.alerts) setAlerts((prev) => [...prev, ...parsed.alerts]);
        if (i === 2 && parsed.summary) setReport(parsed.summary);
      } catch (e) {
        setAgentLog((prev) => [
          ...prev,
          { step: i + 1, summary: "Error processing this step.", alerts: [], recommendations: [] },
        ]);
      }

      await new Promise((r) => setTimeout(r, 600));
    }

    setCurrentStep(4);
    setLoading(false);
  };

  const stepNames = ["Analyze", "Alert", "Report"];

  return (
    <div style={{ fontFamily: "monospace", background: "#0d1117", minHeight: "100vh", color: "#e6edf3" }}>
      
      {/* Header */}
      <div style={{ background: "#161b22", borderBottom: "1px solid #30363d", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: "linear-gradient(135deg,#00d4ff,#7c3aed)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤖</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18, color: "#58a6ff" }}>AttendAI</div>
            <div style={{ fontSize: 11, color: "#8b949e", letterSpacing: 2 }}>AGENTIC ATTENDANCE SYSTEM</div>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "#8b949e" }}>
          <span style={{ display: "inline-block", width: 8, height: 8, background: "#3fb950", borderRadius: "50%", marginRight: 6 }}></span>
          SIMULATION ACTIVE
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: 32 }}>

        {/* Control Card */}
        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 28, marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>AI Agent Control Panel</div>
              <div style={{ color: "#8b949e", fontSize: 13 }}>The agent runs 3 autonomous steps: Analyze → Alert → Report</div>
            </div>
            <button
              onClick={runAgent}
              disabled={loading}
              style={{
                background: loading ? "#21262d" : "linear-gradient(135deg,#00d4ff,#0099cc)",
                color: loading ? "#8b949e" : "#000",
                border: "none", padding: "12px 28px", borderRadius: 8,
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: 700, fontSize: 14, fontFamily: "monospace",
              }}
            >
              {loading ? `⚙ RUNNING STEP ${currentStep}/3...` : "▶ RUN AGENT CYCLE"}
            </button>
          </div>

          {/* Steps */}
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            {stepNames.map((name, i) => {
              const done = currentStep > i + 1 || (!loading && currentStep === 4 && hasRun);
              const active = currentStep === i + 1 && loading;
              return (
                <div key={i} style={{
                  flex: 1, minWidth: 100, padding: "10px 16px", borderRadius: 8, border: "1px solid",
                  borderColor: done ? "#3fb950" : active ? "#00d4ff" : "#30363d",
                  background: done ? "rgba(63,185,80,0.05)" : active ? "rgba(0,212,255,0.05)" : "#0d1117",
                  color: done ? "#3fb950" : active ? "#00d4ff" : "#8b949e",
                }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{done ? "✓" : `0${i + 1}`}</div>
                  <div style={{ fontSize: 11, marginTop: 2 }}>{name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        {attendance.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
            {[
              { label: "Present", value: present, color: "#3fb950" },
              { label: "Late", value: late, color: "#d29922" },
              { label: "Absent", value: absent, color: "#f85149" },
              { label: "Anomalies", value: anomalies, color: "#58a6ff" },
            ].map((s) => (
              <div key={s.label} style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "18px 22px" }}>
                <div style={{ fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}

        {/* Attendance Table */}
        {attendance.length > 0 && (
          <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, overflow: "hidden", marginBottom: 28 }}>
            <div style={{ padding: "14px 20px", borderBottom: "1px solid #30363d", fontSize: 12, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1.5 }}>
              Attendance Records
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d1117" }}>
                  {["Employee", "Department", "Check-In", "Check-Out", "Status", "Anomaly"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1, borderBottom: "1px solid #30363d" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attendance.map((emp) => (
                  <tr key={emp.id} style={{ borderBottom: "1px solid #21262d" }}>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "linear-gradient(135deg,#7c3aed,#00d4ff)", borderRadius: 6, width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, marginRight: 8, verticalAlign: "middle" }}>
                        {emp.avatar}
                      </span>
                      {emp.name}
                    </td>
                    <td style={{ padding: "12px 16px", color: "#8b949e" }}>{emp.dept}</td>
                    <td style={{ padding: "12px 16px" }}>{emp.checkIn || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>{emp.checkOut || "—"}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: emp.status === "Present" ? "rgba(63,185,80,0.12)" : emp.status === "Late" ? "rgba(210,153,34,0.12)" : "rgba(248,81,73,0.12)",
                        color: emp.status === "Present" ? "#3fb950" : emp.status === "Late" ? "#d29922" : "#f85149",
                        border: `1px solid ${emp.status === "Present" ? "rgba(63,185,80,0.2)" : emp.status === "Late" ? "rgba(210,153,34,0.2)" : "rgba(248,81,73,0.2)"}`,
                      }}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 16px", color: emp.anomaly ? "#d29922" : "#8b949e" }}>
                      {emp.anomaly ? "⚠ Flagged" : "Clear"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Agent Log + Alerts */}
        {(agentLog.length > 0 || alerts.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 28 }}>
            
            {/* Agent Log */}
            <div>
              <div style={{ fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>🧠 Agent Reasoning</div>
              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #30363d", fontSize: 12, color: "#00d4ff" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, background: "#00d4ff", borderRadius: "50%", marginRight: 6 }}></span>
                  LIVE AGENT LOG
                </div>
                {agentLog.length === 0 && (
                  <div style={{ padding: 24, color: "#8b949e", fontSize: 13, textAlign: "center" }}>Waiting...</div>
                )}
                {agentLog.map((log, i) => (
                  <div key={i} style={{ padding: "14px 16px", borderBottom: "1px solid #21262d" }}>
                    <div style={{ fontSize: 11, color: "#7c3aed", marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>
                      Step {log.step} · {stepNames[log.step - 1]}
                    </div>
                    <div style={{ fontSize: 13, lineHeight: 1.7 }}>{log.summary}</div>
                    {log.recommendations && log.recommendations.map((r, j) => (
                      <div key={j} style={{ fontSize: 12, color: "#3fb950", marginTop: 4 }}>→ {r}</div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <div>
              <div style={{ fontSize: 11, color: "#8b949e", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>🚨 Agent Alerts</div>
              <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: 12, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #30363d", fontSize: 12, color: "#f85149" }}>
                  <span style={{ display: "inline-block", width: 8, height: 8, background: "#f85149", borderRadius: "50%", marginRight: 6 }}></span>
                  ALERTS · {alerts.length}
                </div>
                {alerts.length === 0 && (
                  <div style={{ padding: 24, color: "#8b949e", fontSize: 13, textAlign: "center" }}>No alerts yet.</div>
                )}
                {alerts.map((a, i) => (
                  <div key={i} style={{ padding: "12px 16px", borderBottom: "1px solid #21262d", borderLeft: "3px solid #f85149", fontSize: 13, color: "#ff8a80", lineHeight: 1.6 }}>
                    {a}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Report */}
        {report && (
          <div style={{ background: "#161b22", border: "1px solid #3fb950", borderRadius: 12, padding: 24, marginBottom: 28 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#3fb950", marginBottom: 14 }}>📊 Final AI Report</div>
            <div style={{ fontSize: 13, lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{report}</div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid #30363d", fontSize: 12, color: "#8b949e" }}>
              ✓ Generated by AI Agent &nbsp;·&nbsp; Total: {EMPLOYEES.length} employees &nbsp;·&nbsp;
              Rate: {Math.round(((present + late) / EMPLOYEES.length) * 100)}%
            </div>
          </div>
        )}

        {/* Empty State */}
        {!hasRun && (
          <div style={{ textAlign: "center", padding: 80, color: "#8b949e" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🤖</div>
            <div style={{ fontSize: 18, color: "#e6edf3", marginBottom: 8 }}>Agent Standing By</div>
            <div style={{ fontSize: 13 }}>Click "RUN AGENT CYCLE" to start the AI simulation</div>
          </div>
        )}

      </div>
    </div>
  );
}
