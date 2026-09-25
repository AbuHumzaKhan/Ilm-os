"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

type CellValue = string | number;
type RunResult = { status: "success" | "error"; stdout: string; stderr: string };
type WorkerMessage =
  | { type: "ready"; pythonVersion: string }
  | { type: "result"; status: "success" | "error"; stdout: string; stderr: string }
  | { type: "error"; message: string };

type PythonWorker = Worker & {
  onmessage: ((event: MessageEvent<WorkerMessage>) => void) | null;
};

const DATASET_COLUMNS = ["Order ID", "Product", "Category", "Region", "Units", "Sales"];
const DATASET_ROWS: CellValue[][] = [
  ["E101", "Laptop", "Electronics", "North", 4, 220000],
  ["E102", "Mouse", "Electronics", "West", 18, 21600],
  ["E103", "Keyboard", "Electronics", "North", 11, 27500],
  ["E104", "Monitor", "Electronics", "South", 6, 108000],
  ["E105", "Desk", "Furniture", "West", 5, 45000],
  ["E106", "Chair", "Furniture", "North", 14, 42000],
  ["E107", "Notebook", "Stationery", "South", 40, 8000],
  ["E108", "Pen", "Stationery", "West", 75, 3750],
];

const STARTER_CODE = `# Ilm-os gives you the dataset as a pandas DataFrame: df\n\nprint(df.head())\nprint("\\nTotal sales:", df["Sales"].sum())\n\n# Try:\n# df.groupby("Category")["Sales"].sum()\n`;

const SCENARIO = {
  title: "Sales performance review",
  question: "Which product category generated the highest total sales, and what was the total?",
  hint: "Use groupby() and sum() on the Sales column.",
};

export default function PlaygroundPage() {
  const workerRef = useRef<PythonWorker | null>(null);
  const [code, setCode] = useState(STARTER_CODE);
  const [result, setResult] = useState<RunResult | null>(null);
  const [runtimeStatus, setRuntimeStatus] = useState<"loading" | "ready" | "error">("loading");
  const [runtimeMessage, setRuntimeMessage] = useState("Loading Python 3.14…");
  const [running, setRunning] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const worker = new Worker("/pyodide-worker.js");
    workerRef.current = worker as PythonWorker;
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === "ready") {
        setRuntimeStatus("ready");
        setRuntimeMessage(`Python ${message.pythonVersion} · pandas + NumPy ready`);
      } else if (message.type === "result") {
        setRunning(false);
        setResult({ status: message.status, stdout: message.stdout, stderr: message.stderr });
      } else if (message.type === "error") {
        setRunning(false);
        setRuntimeStatus("error");
        setRuntimeMessage(message.message);
      }
    };
    worker.postMessage({ type: "load" });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const rowLabels = useMemo(() => DATASET_ROWS.map((_, index) => index + 2), []);

  function runCode() {
    if (!workerRef.current || runtimeStatus !== "ready" || !code.trim() || running) return;
    setRunning(true);
    setResult(null);
    workerRef.current.postMessage({ type: "run", code, columns: DATASET_COLUMNS, rows: DATASET_ROWS });
  }

  function resetCode() {
    setCode(STARTER_CODE);
    setResult(null);
    setShowHint(false);
  }

  function stopExecution() {
    if (!running) return;
    workerRef.current?.terminate();
    const worker = new Worker("/pyodide-worker.js") as PythonWorker;
    workerRef.current = worker;
    setRunning(false);
    setResult({ status: "error", stdout: "", stderr: "Execution stopped. Python runtime is restarting…" });
    setRuntimeStatus("loading");
    setRuntimeMessage("Restarting Python runtime…");
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.type === "ready") {
        setRuntimeStatus("ready");
        setRuntimeMessage(`Python ${message.pythonVersion} · pandas + NumPy ready`);
      } else if (message.type === "result") {
        setRunning(false);
        setResult({ status: message.status, stdout: message.stdout, stderr: message.stderr });
      } else if (message.type === "error") {
        setRuntimeStatus("error");
        setRuntimeMessage(message.message);
      }
    };
    worker.postMessage({ type: "load" });
  }

  return (
    <LearningModeShell
      active="playground"
      eyebrow="04 / PLAYGROUND"
      title="Practice with Excel data and Python."
      description="Inspect the same spreadsheet-style dataset a learner would see in Excel, then solve the business question with real Python and pandas directly in the browser."
    >
      <section className="scenario-card">
        <div className="scenario-icon">?</div>
        <div className="scenario-copy">
          <div className="eyebrow">BUSINESS SCENARIO</div>
          <h2>{SCENARIO.title}</h2>
          <p>{SCENARIO.question}</p>
        </div>
        <button type="button" className="hint-button" onClick={() => setShowHint((value) => !value)}>{showHint ? "Hide hint" : "Show hint"}</button>
      </section>

      {showHint && <div className="hint-card"><strong>Hint</strong><span>{SCENARIO.hint}</span></div>}

      <section className="workspace-card">
        <div className="workspace-toolbar">
          <div className="runtime-state"><span className={`live-dot ${runtimeStatus}`} /> <strong>Python Playground</strong><span>{runtimeMessage}</span></div>
          <div className="toolbar-actions">
            <button type="button" onClick={resetCode}>Reset</button>
            <button type="button" onClick={() => setResult(null)}>Clear output</button>
            {running ? <button type="button" className="stop" onClick={stopExecution}>Stop</button> : <button type="button" className="run" onClick={runCode} disabled={runtimeStatus !== "ready"}>{runtimeStatus !== "ready" ? "Loading…" : "Run ▶"}</button>}
          </div>
        </div>

        <div className="workbench">
          <div className="dataset-pane">
            <div className="pane-heading"><div><span className="pane-kicker">DATASET</span><h3>Sales data</h3></div><span className="range">A1:F9</span></div>
            <div className="sheet-wrap">
              <table className="sheet">
                <thead>
                  <tr><th className="corner" />{DATASET_COLUMNS.map((_, index) => <th key={index} className="column-index">{String.fromCharCode(65 + index)}</th>)}</tr>
                  <tr><th className="row-index">1</th>{DATASET_COLUMNS.map((column) => <th key={column}>{column}</th>)}</tr>
                </thead>
                <tbody>
                  {DATASET_ROWS.map((row, rowIndex) => <tr key={String(row[0])}><th className="row-index">{rowLabels[rowIndex]}</th>{row.map((cell, cellIndex) => <td key={`${rowIndex}-${cellIndex}`}>{cellIndex === 5 ? `₹${Number(cell).toLocaleString("en-IN")}` : cell}</td>)}</tr>)}
                </tbody>
              </table>
            </div>
            <div className="dataset-footer"><span>8 records</span><span>Use column names directly in pandas</span></div>
          </div>

          <div className="code-pane">
            <div className="pane-heading"><div><span className="pane-kicker">PYTHON</span><h3>Write your solution</h3></div><span className="language">Python</span></div>
            <div className="editor-shell">
              <div className="line-numbers">{code.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div>
              <textarea value={code} onChange={(event) => { setCode(event.target.value); setResult(null); }} spellCheck={false} aria-label="Python code editor" />
            </div>
            <div className="code-help"><span>Available: <code>df</code>, <code>data</code>, <code>sales</code>, pandas, NumPy</span><span>Runs locally in your browser</span></div>
          </div>
        </div>

        <div className="output-pane">
          <div className="output-heading"><div><span className="pane-kicker">OUTPUT</span><h3>Execution result</h3></div><span className={result?.status === "success" ? "success-label" : result?.status === "error" ? "error-label" : "idle-label"}>{result ? result.status.toUpperCase() : "READY"}</span></div>
          <div className={`output-box ${result?.status ?? "idle"}`}>
            {!result && <div className="output-empty"><span>▶</span><strong>Run your Python solution</strong><small>Your DataFrame output and errors will appear here.</small></div>}
            {result?.status === "success" && <pre>{result.stdout || "Code executed successfully with no printed output."}</pre>}
            {result?.status === "error" && <pre>{result.stderr || "The code could not be executed."}</pre>}
          </div>
        </div>
      </section>

      <section className="learning-notes">
        <div><span className="eyebrow">HOW TO PRACTICE</span><h2>One dataset. Multiple ways to solve it.</h2></div>
        <div className="note-grid">
          <article><span>01</span><strong>Inspect</strong><p>Use <code>df.head()</code>, <code>df.info()</code> and column selection to understand the data.</p></article>
          <article><span>02</span><strong>Analyse</strong><p>Filter rows, calculate metrics and group results with pandas.</p></article>
          <article><span>03</span><strong>Explain</strong><p>Turn the numerical result into a business conclusion, not just code output.</p></article>
        </div>
      </section>

      <style jsx>{`
        .scenario-card,.workspace-card,.hint-card,.learning-notes{margin-top:24px;border:1px solid rgba(255,255,255,.075);background:rgba(13,16,23,.9);border-radius:18px;overflow:hidden}.scenario-card{display:flex;align-items:center;gap:16px;padding:18px 20px}.scenario-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:#151b2b;color:#78a8ff;font-weight:800}.scenario-copy{flex:1}.scenario-copy h2{margin:5px 0 4px;font-size:17px}.scenario-copy p{margin:0;color:#818b9b;font-size:11px;line-height:1.5}.hint-button{border:1px solid rgba(255,255,255,.08);background:#10141c;color:#aab3c1;border-radius:9px;padding:9px 12px;font-size:10px}.hint-card{display:flex;gap:10px;padding:12px 18px;color:#8c96a6;font-size:11px}.hint-card strong{color:#c59aff}.hint-card span{color:#8993a3}
        .workspace-toolbar{height:60px;display:flex;align-items:center;justify-content:space-between;padding:0 18px;border-bottom:1px solid rgba(255,255,255,.07)}.runtime-state{display:flex;align-items:center;gap:8px;color:#aab4c3;font-size:11px}.runtime-state>span:last-child{color:#626d7d;font-size:9px}.live-dot{width:7px;height:7px;border-radius:50%;background:#5c6878}.live-dot.ready{background:#53d9bb;box-shadow:0 0 12px rgba(83,217,187,.65)}.live-dot.error{background:#ff6d7d}.toolbar-actions{display:flex;gap:6px}.toolbar-actions button{border:1px solid rgba(255,255,255,.07);border-radius:8px;background:#10141c;color:#8993a2;padding:8px 10px;font-size:10px}.toolbar-actions .run{border-color:rgba(75,99,255,.4);background:#2437d8;color:#fff}.toolbar-actions .stop{border-color:rgba(255,110,125,.25);background:#29151b;color:#ff9eaa}.toolbar-actions button:disabled{opacity:.45;cursor:not-allowed}
        .workbench{display:grid;grid-template-columns:1.05fr .95fr;min-height:450px}.dataset-pane,.code-pane{padding:20px}.code-pane{border-left:1px solid rgba(255,255,255,.07)}.pane-heading{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:12px}.pane-heading h3{margin:5px 0 0;font-size:15px}.pane-kicker{color:#5e6a7b;font-size:9px;font-weight:800;letter-spacing:.14em}.range,.language{color:#667181;font-size:9px}.language{padding:5px 8px;border:1px solid rgba(255,255,255,.06);border-radius:6px;background:#0d1118}
        .sheet-wrap{overflow:auto;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:#080b10}.sheet{width:100%;min-width:670px;border-collapse:collapse;font-size:10px}.sheet th,.sheet td{height:31px;padding:0 9px;border-right:1px solid rgba(255,255,255,.045);border-bottom:1px solid rgba(255,255,255,.045);white-space:nowrap}.sheet thead th{background:#10141c;color:#788394;font-weight:700}.sheet thead tr:nth-child(2) th{color:#aeb8c6;font-size:9px}.sheet .corner{width:35px}.sheet .column-index{text-align:center;color:#566172}.sheet .row-index{width:35px;text-align:center;background:#0d1118;color:#505b6b;font-weight:500}.sheet td{color:#9ca6b5}.sheet tbody tr:hover td{background:rgba(64,87,150,.08)}.dataset-footer,.code-help{display:flex;justify-content:space-between;margin-top:9px;color:#596475;font-size:9px}.editor-shell{display:grid;grid-template-columns:39px 1fr;min-height:320px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:#080b10;overflow:hidden}.line-numbers{display:flex;flex-direction:column;padding:14px 0;text-align:center;border-right:1px solid rgba(255,255,255,.05);color:#384150;font:11px/1.8 ui-monospace,SFMono-Regular,Menlo,monospace}.editor-shell textarea{width:100%;min-height:320px;resize:none;border:0;outline:0;padding:14px;color:#dbe5f3;background:transparent;font:12px/1.8 ui-monospace,SFMono-Regular,Menlo,monospace}.code-help code,.learning-notes code{color:#83aaff}.output-pane{padding:0 20px 20px;border-top:1px solid rgba(255,255,255,.07)}.output-heading{display:flex;justify-content:space-between;align-items:flex-end;padding:17px 0 11px}.output-heading h3{margin:5px 0 0;font-size:14px}.success-label,.error-label,.idle-label{font-size:8px;font-weight:800;letter-spacing:.12em}.success-label{color:#5bd8b8}.error-label{color:#ff8795}.idle-label{color:#626d7d}.output-box{min-height:145px;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:#070a0e;overflow:auto}.output-box.success{border-color:rgba(83,217,187,.2)}.output-box.error{border-color:rgba(255,110,125,.2)}.output-box pre{margin:0;padding:16px;color:#c5cfdd;font:11px/1.65 ui-monospace,SFMono-Regular,Menlo,monospace;white-space:pre-wrap}.output-box.error pre{color:#ff9ca8}.output-empty{min-height:145px;display:grid;place-items:center;align-content:center;gap:5px;color:#687383;text-align:center}.output-empty span{font-size:18px}.output-empty strong{color:#9da7b6;font-size:12px}.output-empty small{font-size:9px}.learning-notes{padding:20px}.learning-notes h2{margin:6px 0 0;font-size:19px}.note-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:17px}.note-grid article{padding:15px;border:1px solid rgba(255,255,255,.06);border-radius:11px;background:#0d1118}.note-grid article>span{color:#5e9bff;font-size:9px;font-weight:800}.note-grid strong{display:block;margin-top:7px;font-size:12px}.note-grid p{margin:5px 0 0;color:#6e7888;font-size:10px;line-height:1.55}
        @media(max-width:850px){.workbench{grid-template-columns:1fr}.code-pane{border-left:0;border-top:1px solid rgba(255,255,255,.07)}.note-grid{grid-template-columns:1fr}.scenario-card{align-items:flex-start;flex-wrap:wrap}.hint-button{margin-left:54px}.workspace-toolbar{height:auto;padding:13px 15px;gap:12px;align-items:flex-start}.runtime-state{flex-wrap:wrap}.toolbar-actions{flex-wrap:wrap;justify-content:flex-end}}
      `}</style>
    </LearningModeShell>
  );
}
