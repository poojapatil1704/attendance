import { useState, useEffect } from "react";

// ─── DATA ───────────────────────────────────────────────────────────────────
const EMPLOYEES = [
  { id: "E001", name: "Alice Johnson", dept: "Engineering", role: "Developer", avatar: "AJ" },
  { id: "E002", name: "Bob Smith", dept: "Marketing", role: "Manager", avatar: "BS" },
  { id: "E003", name: "Carol White", dept: "HR", role: "Analyst", avatar: "CW" },
  { id: "E004", name: "David Lee", dept: "Engineering", role: "Tech Lead", avatar: "DL" },
  { id: "E005", name: "Eva Chen", dept: "Finance", role: "Accountant", avatar: "EC" },
  { id: "E006", name: "Frank Patel", dept: "Marketing", role: "Designer", avatar: "FP" },
  { id: "E007", name: "Grace Kim", dept: "HR", role: "Recruiter", avatar: "GK" },
  { id: "E008", name: "Henry Osei", dept: "Engineering", role: "DevOps", avatar: "HO" },
];

const TASKS = [
  "Analyze today's attendance data. Identify who is present, late, or absent. Flag anomalies like unusual check-in times.",
  "Based on attendance patterns, draft specific alert messages for managers about absent or late employees.",
  "Generate a comprehensive department-wise attendance report with recommendations to improve attendance.",
];

function generateAttendance() {
  const now = new Date();
  return EMPLOYEES.map((emp) => {
    const roll = Math.random();
    let status, checkIn, checkOut;
    if (roll < 0.12) {
      status = "Absent"; checkIn = null; checkOut = null;
    } else if (roll < 0.28) {
      status = "Late";
      const h = 10 + Math.floor(Math.random() * 2);
      const m = Math.floor(Math.random() * 60);
      checkIn = `${h}:${String(m).padStart(2, "0")} AM`;
      checkOut = `${5 + Math.floor(Math.random() * 3)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} PM`;
    } else {
      status = "Present";
      const h = 8 + Math.floor(Math.random() * 1);
      const m = Math.floor(Math.random() * 60);
      checkIn = `${h}:${String(m).padStart(2, "0")} AM`;
      checkOut = `${5 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")} PM`;
    }
    return {
      ...emp,
      status,
      checkIn,
      checkOut,
      anomaly: Math.random() > 0.78,
      date: now.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
    };
  });
}

// ─── STYLES ─────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;600;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #070b14;
    --surface: #0d1526;
    --surface2: #111d33;
    --border: #1e2d4a;
    --accent: #00d4ff;
    --accent2: #7c3aed;
    --green: #00e676;
    --yellow: #ffd600;
    --red: #ff1744;
    --text: #e8f4f8;
    --muted: #4a6080;
  }

  body { background: var(--bg); color: var(--text); font-family: 'JetBrains Mono', monospace; }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,212,255,0.08) 0%, transparent 60%),
      radial-gradient(ellipse 40% 40% at 90% 10%, rgba(124,58,237,0.06) 0%, transparent 50%);
    padding: 0 0 60px;
  }

  /* Header */
  .header {
    border-bottom: 1px solid var(--border);
    padding: 24px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(13,21,38,0.8);
    backdrop-filter: blur(10px);
    position: sticky; top: 0; z-index: 100;
  }
  .logo { display: flex; align-items: center; gap: 14px; }
  .logo-icon {
    width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
  }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; letter-spacing: -0.5px; }
  .logo-sub { font-size: 11px; color: var(--muted); letter-spacing: 2px; text-transform: uppercase; }
  .header-date { font-size: 12px; color: var(--muted); text-align: right; }
  .live-dot {
    display: inline-block; width: 8px; height: 8px;
    background: var(--green); border-radius: 50%;
    margin-right: 6px;
    animation: pulse 2s infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }

  /* Main */
  .main { max-width: 1200px; margin: 0 auto; padding: 40px 40px 0; }

  /* Agent Control */
  .control-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 32px;
    margin-bottom: 32px;
    position: relative;
    overflow: hidden;
  }
  .control-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
  }
  .control-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: gap; gap: 20px; }
  .control-info h2 { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 8px; }
  .control-info p { color: var(--muted); font-size: 13px; line-height: 1.6; max-width: 560px; }

  .run-btn {
    background: linear-gradient(135deg, var(--accent), #0099cc);
    border: none; color: #000; padding: 14px 32px;
    border-radius: 10px; cursor: pointer; font-size: 14px;
    font-family: 'JetBrains Mono', monospace; font-weight: 700;
    letter-spacing: 0.5px; transition: all 0.2s; white-space: nowrap;
    flex-shrink: 0;
  }
  .run-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,212,255,0.3); }
  .run-btn:disabled { background: var(--surface2); color: var(--muted); cursor: not-allowed; }

  /* Progress steps */
  .steps { display: flex; gap: 12px; margin-top: 24px; }
  .step {
    flex: 1; padding: 12px 16px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--surface2);
    font-size: 12px; transition: all 0.3s;
  }
  .step.active { border-color: var(--accent); background: rgba(0,212,255,0.05); color: var(--accent); }
  .step.done { border-color: var(--green); background: rgba(0,230,118,0.05); color: var(--green); }
  .step-num { font-weight: 700; margin-bottom: 4px; }
  .step-label { color: inherit; opacity: 0.8; font-size: 11px; }

  /* Stats row */
  .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 32px; }
  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 12px; padding: 20px 24px;
  }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 32px; font-weight: 800; }
  .stat-value.green { color: var(--green); }
  .stat-value.yellow { color: var(--yellow); }
  .stat-value.red { color: var(--red); }
  .stat-value.blue { color: var(--accent); }

  /* Section headers */
  .section-title {
    font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
    text-transform: uppercase; letter-spacing: 2px; color: var(--muted);
    margin-bottom: 16px; display: flex; align-items: center; gap: 10px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: var(--border); }

  /* Table */
  .table-wrap {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden; margin-bottom: 32px;
  }
  table { width: 100%; border-collapse: collapse; }
  th {
    padding: 14px 20px; text-align: left; font-size: 11px;
    color: var(--muted); text-transform: uppercase; letter-spacing: 1.5px;
    border-bottom: 1px solid var(--border); background: var(--surface2);
  }
  td { padding: 14px 20px; font-size: 13px; border-bottom: 1px solid rgba(30,45,74,0.5); }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(0,212,255,0.02); }

  .avatar {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--accent2), var(--accent));
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; margin-right: 10px;
    vertical-align: middle;
  }
  .badge {
    display: inline-block; padding: 3px 10px; border-radius: 20px;
    font-size: 11px; font-weight: 600;
  }
  .badge-present { background: rgba(0,230,118,0.12); color: var(--green); border: 1px solid rgba(0,230,118,0.2); }
  .badge-late { background: rgba(255,214,0,0.12); color: var(--yellow); border: 1px solid rgba(255,214,0,0.2); }
  .badge-absent { background: rgba(255,23,68,0.12); color: var(--red); border: 1px solid rgba(255,23,68,0.2); }
  .anomaly-flag { color: var(--yellow); font-size: 13px; }

  /* Two column layout */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; }

  /* Agent log */
  .agent-log {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .log-header {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    font-size: 12px; color: var(--accent);
    display: flex; align-items: center; gap: 8px;
  }
  .log-entry { padding: 16px 20px; border-bottom: 1px solid var(--border); animation: fadeIn 0.4s ease; }
  .log-entry:last-child { border-bottom: none; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  .log-task { font-size: 11px; color: var(--accent2); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px; }
  .log-summary { font-size: 13px; line-height: 1.7; color: var(--text); }
  .log-rec { font-size: 12px; color: var(--green); margin-top: 6px; }

  /* Alerts */
  .alerts-panel {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 16px; overflow: hidden;
  }
  .alert-item {
    padding: 14px 20px; border-bottom: 1px solid var(--border);
    font-size: 13px; line-height: 1.6; color: #ff8a80;
    border-left: 3px solid var(--red); animation: fadeIn 0.4s ease;
  }
  .alert-item:last-child { border-bottom: none; }

  /* Report */
  .report-card {
    background: var(--surface); border: 1px solid var(--green);
    border-radius: 16px; padding: 28px; margin-bottom: 32px;
    position: relative; animation: fadeIn 0.5s ease;
  }
  .report-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, var(--green), transparent);
  }
  .report-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: var(--green); margin-bottom: 16px; }
  .report-body { font-size: 13px; line-height: 1.9; color: var(--text); white-space: pre-wrap; }

  /* Thinking animation */
  .thinking { display: flex; align-items: center; gap: 10px; padding: 16px 20px; color: var(--muted); font-size: 13px; }
  .thinking-dots span {
    display: inline-block; width: 6px; height: 6px;
    background: var(--accent); border-radius: 50%; margin: 0 2px;
    animation: blink 1.2s infinite;
  }
  .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
  .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100%{opacity:0;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }

  .empty-state { padding: 40px 20px; text-align: center; color: var(--muted); font-size: 13px; }

  @media (max-width: 768px) {
    .main { padding: 20px; }
    .header { padding: 16px 20px; }
    .stats { grid-template-columns: repeat(2, 1fr); }
    .two-col { grid-template-columns: 1fr; }
    .steps { flex-direction: column; }
    .control-header { flex-direction: column; align-items: flex-start; }
  }
`;

// ─── COMPONENT ───────────────────────────────────────────────────────────────
export default function AgenticAttendanceApp() {
  const [attendance, setAttendance] = useState([]);
  const [agentLog, setAgentLog] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  const stats = attendance.length
    ? {
        present: attendance.filter((e) => e.status === "Present").length,
        late: attendance.filter((e) => e.status === "Late").length,
        absent: attendance.filter((e) => e.status === "Absent").length,
        anomalies: attendance.filter((e) => e.anomaly).length,
      }
    : { present: 0, late: 0, absent: 0, anomalies: 0 };

  const runAgentCycle = async () => {
    setLoading(true);
    setHasRun(true);
    const data = generateAttendance();
    setAttendance(data);
    setAgentLog([]);
    setAlerts([]);
    setReport(null);
    setCurrentStep(0);

    for (let i = 0; i < TASKS.length; i++) {
      setCurrentStep(i + 1);
      setThinking(true);

      const prompt = `You are an intelligent HR Attendance Management Agent.

Today's Date: ${today}
Employee Attendance Data:
${JSON.stringify(data, null, 2)}

Your Task (Step ${i + 1} of 3): ${TASKS[i]}

Respond ONLY with a valid JSON object, no markdown, no backticks:
{
  "summary": "2-3 sentence summary of your analysis",
  "alerts": ["alert message 1", "alert message 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "reportReady": ${i === 2}
}`;

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [{ role: "user", content: prompt }],
          }),
        });

        const result = await response.json();
        const text = result.content?.map((c) => c.text || "").join("") || "{}";
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        setThinking(false);
        setAgentLog((prev) => [...prev, { step: i + 1, task: TASKS[i], ...parsed }]);
        if (parsed.alerts?.length) setAlerts((prev) => [...prev, ...parsed.alerts]);
        if (parsed.reportReady && parsed.summary) setReport(parsed.summary);
      } catch (err) {
        setThinking(false);
        setAgentLog((prev) => [
          ...prev,
          { step: i + 1, task: TASKS[i], summary: "Agent encountered an error processing this step.", alerts: [], recommendations: [] },
        ]);
      }

      await new Promise((r) => setTimeout(r, 600));
    }

    setCurrentStep(4);
    setLoading(false);
  };

  const stepLabels = ["Analyze Attendance", "Draft Alerts", "Generate Report"];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="logo">
            <div className="logo-icon">🤖</div>
            <div>
              <div className="logo-text">AttendAI</div>
              <div className="logo-sub">Agentic Attendance System</div>
            </div>
          </div>
          <div className="header-date">
            <div><span className="live-dot" />SIMULATION ACTIVE</div>
            <div style={{ marginTop: 4 }}>{today}</div>
          </div>
        </header>

        <div className="main">
          {/* Control Card */}
          <div className="control-card">
            <div className="control-header">
              <div className="control-info">
                <h2>AI Agent Control Panel</h2>
                <p>
                  The autonomous agent runs a 3-step cycle: it first analyzes all attendance data,
                  then drafts manager alerts, and finally produces a department report — all powered by Claude AI.
                </p>
              </div>
              <button className="run-btn" onClick={runAgentCycle} disabled={loading}>
                {loading ? `⚙ RUNNING STEP ${currentStep}/3...` : "▶ RUN AGENT CYCLE"}
              </button>
            </div>

            <div className="steps">
              {stepLabels.map((label, i) => (
                <div
                  key={i}
                  className={`step ${currentStep === i + 1 && loading ? "active" : ""} ${currentStep > i + 1 || (!loading && currentStep === 4 && hasRun) ? "done" : ""}`}
                >
                  <div className="step-num">
                    {currentStep > i + 1 || (!loading && currentStep === 4 && hasRun) ? "✓" : `0${i + 1}`}
                  </div>
                  <div className="step-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          {attendance.length > 0 && (
            <div className="stats">
              <div className="stat-card">
                <div className="stat-label">Present</div>
                <div className="stat-value green">{stats.present}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Late</div>
                <div className="stat-value yellow">{stats.late}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Absent</div>
                <div className="stat-value red">{stats.absent}</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Anomalies</div>
                <div className="stat-value blue">{stats.anomalies}</div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          {attendance.length > 0 && (
            <>
              <div className="section-title">Attendance Records</div>
              <div className="table-wrap" style={{ marginBottom: 32 }}>
                <table>
                  <thead>
                    <tr>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>Role</th>
                      <th>Check-In</th>
                      <th>Check-Out</th>
                      <th>Status</th>
                      <th>Anomaly</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((emp) => (
                      <tr key={emp.id}>
                        <td>
                          <span className="avatar">{emp.avatar}</span>
                          {emp.name}
                        </td>
                        <td style={{ color: "var(--muted)" }}>{emp.dept}</td>
                        <td style={{ color: "var(--muted)" }}>{emp.role}</td>
                        <td>{emp.checkIn || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                        <td>{emp.checkOut || <span style={{ color: "var(--muted)" }}>—</span>}</td>
                        <td>
                          <span className={`badge badge-${emp.status.toLowerCase()}`}>{emp.status}</span>
                        </td>
                        <td>
                          {emp.anomaly
                            ? <span className="anomaly-flag">⚠ Flagged</span>
                            : <span style={{ color: "var(--muted)" }}>Clear</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Agent Log + Alerts */}
          {(agentLog.length > 0 || thinking || alerts.length > 0) && (
            <>
              <div className="section-title">Agent Output</div>
              <div className="two-col">
                {/* Agent Reasoning Log */}
