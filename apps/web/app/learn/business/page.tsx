"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

const BusinessDatasetSheet = dynamic(
  () => import("../../../components/learning/BusinessDatasetSheet"),
  { ssr: false, loading: () => <div className="sheet-loading">Loading spreadsheet workspace…</div> }
);

type Dataset = {
  id: string;
  name: string;
  description: string;
  task: string;
  columns: string[];
  rows: Array<Array<string | number>>;
  referenceHints: string[];
};

type Scenario = {
  title: string;
  level: string;
  prompt: string;
  datasetId: string;
};

const datasets: Dataset[] = [
  {
    id: "sales-lookup",
    name: "Sales Lookup",
    description: "A compact sales table for practicing exact-match lookups and returning a value from another column.",
    task: "Find the sales amount for product code P104 using an exact-match lookup.",
    columns: ["Product Code", "Product", "Category", "Region", "Units", "Sales"],
    rows: [
      ["P101", "Laptop Stand", "Accessories", "North", 18, 21600],
      ["P102", "Wireless Mouse", "Accessories", "West", 42, 33600],
      ["P103", "Keyboard", "Accessories", "South", 27, 40500],
      ["P104", "Monitor 24", "Displays", "East", 15, 52500],
      ["P105", "USB-C Hub", "Accessories", "North", 31, 37200],
      ["P106", "Webcam", "Accessories", "West", 23, 34500],
      ["P107", "Desk Lamp", "Office", "South", 19, 17100],
      ["P108", "Headset", "Accessories", "East", 34, 40800],
      ["P109", "SSD 1TB", "Storage", "North", 12, 62400],
      ["P110", "Docking Station", "Accessories", "West", 9, 49500],
    ],
    referenceHints: ["A2:F11", "P104 is in A5", "Sales is column F", "Exact match: FALSE"],
  },
  {
    id: "monthly-reporting",
    name: "Monthly Reporting",
    description: "A reporting dataset where product codes must be translated into business-friendly descriptions and categories.",
    task: "Design a readable lookup that returns the product description and category for each code in the report.",
    columns: ["Code", "Month", "Region", "Units", "Revenue", "Status"],
    rows: [
      ["P101", "Jan", "North", 24, 28800, "Closed"],
      ["P104", "Jan", "East", 15, 52500, "Closed"],
      ["P108", "Feb", "East", 34, 40800, "Closed"],
      ["P103", "Feb", "South", 27, 40500, "Closed"],
      ["P105", "Mar", "North", 31, 37200, "Open"],
      ["P110", "Mar", "West", 9, 49500, "Open"],
      ["P102", "Apr", "West", 42, 33600, "Closed"],
      ["P109", "Apr", "North", 12, 62400, "Closed"],
      ["P106", "May", "West", 23, 34500, "Open"],
      ["P107", "May", "South", 19, 17100, "Closed"],
    ],
    referenceHints: ["A2:F11", "Use Code as the lookup key", "Build a readable reporting formula", "Think about maintainability"],
  },
  {
    id: "missing-records",
    name: "Missing Records",
    description: "A customer table containing valid and missing IDs so learners can practice error-safe lookup design.",
    task: "Create a lookup pattern that returns a useful business message when a customer ID is missing.",
    columns: ["Customer ID", "Customer", "Segment", "City", "Orders", "Balance"],
    rows: [
      ["C201", "Apex Traders", "Retail", "Delhi", 12, 18400],
      ["C202", "Blue Mart", "Wholesale", "Jaipur", 8, 9200],
      ["C203", "Crest Foods", "Retail", "Lucknow", 17, 27600],
      ["C204", "Delta Stores", "Wholesale", "Kanpur", 6, 7100],
      ["C205", "Everest Supply", "Retail", "Varanasi", 21, 35200],
      ["C206", "Fresh Basket", "Retail", "Patna", 14, 19800],
      ["C207", "Galaxy Retail", "Wholesale", "Agra", 9, 11300],
      ["C208", "Horizon Mart", "Retail", "Prayagraj", 11, 15600],
      ["C209", "Indus Depot", "Wholesale", "Gorakhpur", 5, 6800],
      ["C210", "Jupiter Foods", "Retail", "Ayodhya", 16, 23100],
    ],
    referenceHints: ["A2:F11", "Try a known ID first", "Then try C999", "Return a business-friendly message"],
  },
  {
    id: "modernization",
    name: "Lookup Modernization",
    description: "A deliberately wider dataset for comparing classic VLOOKUP patterns with modern lookup approaches.",
    task: "Inspect the table and explain how you would modernize a legacy VLOOKUP workbook.",
    columns: ["Employee ID", "Employee", "Department", "Region", "Target", "Actual"],
    rows: [
      ["E101", "Aarav", "Sales", "North", 100000, 112500],
      ["E102", "Meera", "Sales", "West", 90000, 87500],
      ["E103", "Kabir", "Sales", "South", 110000, 121000],
      ["E104", "Sara", "Sales", "East", 95000, 101500],
      ["E105", "Zoya", "Operations", "North", 75000, 79000],
      ["E106", "Rohan", "Operations", "West", 82000, 80000],
      ["E107", "Ishita", "Finance", "South", 68000, 72000],
      ["E108", "Arman", "Finance", "East", 70000, 66500],
      ["E109", "Naina", "Sales", "North", 105000, 119000],
      ["E110", "Rehan", "Sales", "West", 98000, 103000],
    ],
    referenceHints: ["A2:F11", "Employee ID is the lookup key", "Compare column-position dependence", "Consider XLOOKUP or INDEX + MATCH"],
  },
];

const questions: Scenario[] = [
  { title: "Sales lookup", level: "Foundation", prompt: "A sales manager has a product code and needs to retrieve the current sales figure from a master table. Which lookup design would you choose and why?", datasetId: "sales-lookup" },
  { title: "Monthly reporting", level: "Core", prompt: "A monthly report contains product codes while the reference data is structured for reporting. Design a lookup approach that remains readable for the reporting team.", datasetId: "monthly-reporting" },
  { title: "Missing records", level: "Core", prompt: "A customer lookup occasionally fails because an ID is not present. How would you design the formula so the report shows a useful business message instead of an error?", datasetId: "missing-records" },
  { title: "Modernization", level: "Advanced", prompt: "An analyst inherited a workbook using many VLOOKUP formulas. Explain when you would consider replacing them with XLOOKUP or INDEX + MATCH.", datasetId: "modernization" },
];

export default function BusinessQuestionsPage() {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [showReferences, setShowReferences] = useState(true);
  const item = questions[selected];
  const dataset = useMemo(() => datasets.find((entry) => entry.id === item.datasetId) ?? datasets[0], [item.datasetId]);

  const selectScenario = (index: number) => {
    setSelected(index);
    setAnswer("");
    setResetKey((value) => value + 1);
  };

  return (
    <LearningModeShell
      active="business"
      eyebrow="05 / BUSINESS QUESTIONS"
      title="Turn formulas into decisions."
      description="Work with realistic datasets, write spreadsheet logic against real cell ranges, and explain the business reasoning behind your solution."
    >
      <section className="business-layout">
        <aside className="question-list">
          <div className="list-head"><span>SCENARIOS</span><strong>{questions.length}</strong></div>
          {questions.map((question, index) => (
            <button key={question.title} type="button" className={selected === index ? "selected" : ""} onClick={() => selectScenario(index)}>
              <span>0{index + 1}</span>
              <div><strong>{question.title}</strong><small>{question.level}</small></div>
            </button>
          ))}
          <div className="list-note">
            <strong>Dataset-first practice</strong>
            <p>Every scenario now has an editable worksheet so the learner can inspect the actual cells before writing a formula.</p>
          </div>
        </aside>

        <section className="scenario-card">
          <div className="scenario-meta"><span>CASE 0{selected + 1}</span><span>{item.level}</span></div>
          <div className="case-icon">↗</div>
          <h2>{item.title}</h2>
          <p className="scenario-question">{item.prompt}</p>

          <div className="dataset-header">
            <div>
              <div className="dataset-eyebrow">DATASET WORKSPACE · EXCEL MODE</div>
              <h3>{dataset.name}</h3>
              <p>{dataset.description}</p>
            </div>
            <div className="dataset-actions">
              <button type="button" onClick={() => setResetKey((value) => value + 1)}>Reset sheet</button>
              <button type="button" className="reference-button" onClick={() => setShowReferences((value) => !value)}>{showReferences ? "Hide" : "Show"} cell guide</button>
            </div>
          </div>

          <div className="sheet-instructions">
            <div><span>YOUR TASK</span><strong>{dataset.task}</strong></div>
            <div><span>HOW TO READ IT</span><strong>A–F are columns · 1–30 are worksheet rows · use references such as A2:F11</strong></div>
          </div>

          <BusinessDatasetSheet dataset={dataset} resetKey={resetKey} />

          {showReferences && (
            <div className="reference-panel">
              <div><span>REFERENCE GUIDE</span><strong>Use the same cell-address mental model as Excel.</strong></div>
              <div className="reference-chips">
                {dataset.referenceHints.map((hint) => <span key={hint}>{hint}</span>)}
              </div>
            </div>
          )}

          <div className="practice-divider" />

          <label htmlFor="business-answer">Your reasoning</label>
          <textarea id="business-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Write the formula or approach, then explain why it fits the business problem…" rows={7} />
          <div className="scenario-actions"><span>Later this will connect to server-side evaluation, rubric scoring, feedback and persisted mastery.</span><button type="button" disabled={!answer.trim()}>Submit reasoning →</button></div>
        </section>
      </section>

      <section className="business-outcomes">
        <div><span>SPREADSHEET ENGINE</span><strong>Excel-style interaction</strong><p>Editable cells, multi-cell selection, formulas, fill, formatting, copy/paste, sorting, filtering, validation, freeze and other spreadsheet interactions are provided by FortuneSheet.</p></div>
        <div><span>LEARNING DATA</span><strong>Scenario-linked datasets</strong><p>Each case can eventually receive a backend dataset, hidden expected answer, rubric, difficulty and learner-specific feedback.</p></div>
        <div><span>FUTURE EXECUTION</span><strong>Code + SQL + analysis</strong><p>The same dataset model can later feed the Playground for Python/SQL execution, chart tasks and business analysis challenges.</p></div>
      </section>

      <section className="feature-roadmap">
        <div className="roadmap-head"><div><span>ADVANCED WORKSPACE</span><h3>What we can connect next</h3></div><small>Frontend is being prepared before backend execution is added.</small></div>
        <div className="roadmap-grid">
          <article><b>01</b><strong>Import / export</strong><p>Connect XLSX and CSV import/export so learners can bring real practice files into the workspace.</p></article>
          <article><b>02</b><strong>Python playground</strong><p>Run pandas-style analysis in-browser with a sandboxed WebAssembly runtime later.</p></article>
          <article><b>03</b><strong>SQL playground</strong><p>Query the active dataset with browser-side SQL and show result tables beside the editor.</p></article>
          <article><b>04</b><strong>Auto-evaluation</strong><p>Check formulas, query results and reasoning against a scenario-specific rubric through the API.</p></article>
          <article><b>05</b><strong>Charts & insights</strong><p>Turn the same dataset into chart-building and insight-writing exercises without changing the learning flow.</p></article>
          <article><b>06</b><strong>Persistent workbooks</strong><p>Save learner edits and attempts to PostgreSQL once the backend contract is ready.</p></article>
        </div>
      </section>

      <style jsx>{`
        .business-layout { display:grid; grid-template-columns:285px minmax(0,1fr); gap:16px; margin-top:28px; }
        .question-list,.scenario-card,.business-outcomes>div,.feature-roadmap { border:1px solid rgba(255,255,255,.075); background:rgba(13,16,23,.86); border-radius:18px; }
        .question-list { padding:13px; height:max-content; }
        .list-head { display:flex; justify-content:space-between; padding:9px 9px 14px; color:#626c7b; font-size:9px; font-weight:800; letter-spacing:.14em; }
        .list-head strong { color:#9ca6b5; letter-spacing:0; }
        .question-list button { width:100%; display:grid; grid-template-columns:30px 1fr; gap:9px; text-align:left; padding:13px 9px; border:1px solid transparent; border-radius:11px; background:transparent; color:#8791a0; cursor:pointer; }
        .question-list button:hover { background:rgba(255,255,255,.02); }
        .question-list button.selected { background:rgba(65,85,255,.1); border-color:rgba(80,103,255,.22); color:#e8edf7; }
        .question-list button>span { color:#566172; font-size:10px; padding-top:2px; }
        .question-list strong,.question-list small { display:block; }
        .question-list strong { font-size:12px; }
        .question-list small { margin-top:4px; color:#5f6979; font-size:9px; text-transform:uppercase; letter-spacing:.08em; }
        .list-note { margin:15px 6px 3px; padding:13px; border-top:1px solid rgba(255,255,255,.07); }
        .list-note strong { color:#dfe6f1; font-size:11px; }
        .list-note p { margin:6px 0 0; color:#616b7b; font-size:10px; line-height:1.6; }
        .scenario-card { padding:30px; }
        .scenario-meta { display:flex; justify-content:space-between; color:#687383; font-size:9px; font-weight:800; letter-spacing:.13em; }
        .scenario-meta span:last-child { color:#b789ff; }
        .case-icon { display:grid; place-items:center; width:47px; height:47px; margin-top:30px; border-radius:13px; background:#151a27; color:#6e9fff; font-size:20px; }
        .scenario-card h2 { margin:16px 0 9px; font-size:30px; letter-spacing:-.04em; }
        .scenario-question { max-width:900px; margin:0; color:#a4adbc; font-size:15px; line-height:1.75; }
        .dataset-header { display:flex; justify-content:space-between; align-items:flex-end; gap:20px; margin-top:32px; padding:18px 0; border-top:1px solid rgba(255,255,255,.07); }
        .dataset-eyebrow { color:#5f9cff; font-size:9px; font-weight:800; letter-spacing:.13em; }
        .dataset-header h3 { margin:7px 0 4px; font-size:21px; letter-spacing:-.025em; }
        .dataset-header p { max-width:700px; margin:0; color:#697384; font-size:11px; line-height:1.55; }
        .dataset-actions { display:flex; gap:8px; flex:0 0 auto; }
        .dataset-actions button { border:1px solid rgba(255,255,255,.09); border-radius:9px; padding:9px 11px; background:#111620; color:#aab4c3; font-size:10px; cursor:pointer; }
        .dataset-actions button:hover { border-color:rgba(95,156,255,.35); color:#e6edf8; }
        .dataset-actions .reference-button { color:#74aaff; }
        .sheet-instructions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px; }
        .sheet-instructions>div { padding:12px 13px; border:1px solid rgba(255,255,255,.06); border-radius:11px; background:#0b0f16; }
        .sheet-instructions span,.reference-panel span,.roadmap-head>div>span { display:block; color:#5f6979; font-size:8px; font-weight:800; letter-spacing:.13em; }
        .sheet-instructions strong { display:block; margin-top:5px; color:#b8c2d0; font-size:10px; line-height:1.45; }
        .sheet-loading { height:520px; display:grid; place-items:center; border:1px solid rgba(255,255,255,.08); border-radius:14px; background:#fff; color:#555; font-size:12px; }
        .reference-panel { display:grid; grid-template-columns:1fr 2fr; gap:16px; align-items:center; margin-top:12px; padding:13px; border:1px solid rgba(95,156,255,.13); border-radius:12px; background:rgba(47,75,160,.06); }
        .reference-panel strong { display:block; margin-top:5px; color:#b9c4d3; font-size:10px; }
        .reference-chips { display:flex; flex-wrap:wrap; gap:6px; }
        .reference-chips span { display:inline-block; padding:6px 8px; border:1px solid rgba(255,255,255,.07); border-radius:7px; color:#8190a5; background:#0a0e15; font-size:9px; letter-spacing:0; }
        .practice-divider { height:1px; margin:25px 0 0; background:rgba(255,255,255,.07); }
        label { display:block; margin-top:22px; margin-bottom:8px; color:#7b8595; font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; }
        textarea { width:100%; resize:vertical; min-height:150px; padding:15px; border:1px solid rgba(255,255,255,.07); border-radius:12px; outline:0; background:#090c12; color:#dbe3ef; font:13px/1.65 Inter, sans-serif; }
        textarea:focus { border-color:rgba(82,108,255,.5); }
        .scenario-actions { display:flex; align-items:center; justify-content:space-between; gap:15px; margin-top:13px; }
        .scenario-actions span { max-width:600px; color:#596475; font-size:10px; line-height:1.5; }
        .scenario-actions button { border:0; border-radius:10px; padding:12px 15px; background:#2437d8; color:white; font-size:11px; font-weight:700; cursor:pointer; }
        .scenario-actions button:disabled { opacity:.35; cursor:not-allowed; }
        .business-outcomes { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:14px; }
        .business-outcomes>div { padding:19px; }
        .business-outcomes span { color:#5f9cff; font-size:9px; font-weight:800; letter-spacing:.13em; }
        .business-outcomes strong { display:block; margin-top:8px; font-size:14px; }
        .business-outcomes p { color:#667182; font-size:11px; line-height:1.55; }
        .feature-roadmap { margin-top:14px; padding:22px; }
        .roadmap-head { display:flex; justify-content:space-between; align-items:flex-end; gap:20px; padding-bottom:16px; border-bottom:1px solid rgba(255,255,255,.07); }
        .roadmap-head h3 { margin:7px 0 0; font-size:21px; letter-spacing:-.03em; }
        .roadmap-head small { max-width:500px; color:#5f6979; font-size:10px; line-height:1.5; text-align:right; }
        .roadmap-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:12px; }
        .roadmap-grid article { min-height:130px; padding:15px; border:1px solid rgba(255,255,255,.055); border-radius:12px; background:#0a0e14; }
        .roadmap-grid b { color:#4d76d9; font-size:9px; letter-spacing:.1em; }
        .roadmap-grid strong { display:block; margin-top:9px; font-size:12px; }
        .roadmap-grid p { margin:6px 0 0; color:#626d7d; font-size:10px; line-height:1.55; }
        @media(max-width:1000px){ .business-layout{grid-template-columns:1fr}.sheet-instructions,.reference-panel{grid-template-columns:1fr}.roadmap-grid{grid-template-columns:repeat(2,1fr)} }
        @media(max-width:760px){ .dataset-header,.roadmap-head{display:block}.dataset-actions{margin-top:12px}.business-outcomes,.roadmap-grid{grid-template-columns:1fr}.scenario-card{padding:20px}.scenario-actions{display:block}.scenario-actions button{margin-top:12px}.sheet-loading{height:440px} }
      `}</style>
    </LearningModeShell>
  );
}
