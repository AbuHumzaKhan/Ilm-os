"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

const PythonDatasetSheet = dynamic(() => import("../../../components/learning/PythonDatasetSheet"), {
  ssr: false,
  loading: () => <div className="sheet-loading">Loading dataset…</div>,
});

type Scenario = {
  title: string;
  level: string;
  description: string;
  steps: string[];
  objective: string;
};

const scenarios: Scenario[] = [
  {
    title: "Sales analysis",
    level: "Core",
    description: "A retail company wants to understand which product categories generate the most sales and which products lead the business.",
    steps: ["Load the sales data with pandas.", "Calculate total sales by category.", "Find the top 5 products by total sales.", "Display the results clearly."],
    objective: "Use pandas groupby, aggregation and sorting to answer a real business question.",
  },
  {
    title: "Data cleaning",
    level: "Core",
    description: "The reporting team received a customer file containing missing values and inconsistent category labels.",
    steps: ["Inspect missing values.", "Standardize category labels.", "Remove or fill invalid records.", "Verify the cleaned result."],
    objective: "Build a repeatable data-cleaning workflow with pandas.",
  },
  {
    title: "Monthly reporting",
    level: "Advanced",
    description: "Management needs a monthly revenue summary that can be reproduced whenever new transactions arrive.",
    steps: ["Convert the date column.", "Create a month field.", "Aggregate revenue by month.", "Sort and present the report."],
    objective: "Combine date handling, grouping and reporting logic in pandas.",
  },
  {
    title: "Customer insights",
    level: "Advanced",
    description: "The sales team wants to identify high-value customers and understand their purchasing behaviour.",
    steps: ["Group transactions by customer.", "Calculate total customer value.", "Rank customers.", "Identify useful business segments."],
    objective: "Translate transaction-level data into actionable customer metrics.",
  },
];

const columns = ["Order ID", "Date", "Product Name", "Category", "Quantity", "Unit Price", "Sales", "Region"];
const rows: Array<Array<string | number>> = [
  [1001, "2023-01-05", "Laptop", "Electronics", 2, 49999, 99998, "North"],
  [1002, "2023-01-07", "Mouse", "Electronics", 5, 499, 2495, "West"],
  [1003, "2023-01-10", "Desk Chair", "Furniture", 1, 8999, 8999, "South"],
  [1004, "2023-01-12", "Notebook", "Stationery", 10, 299, 2990, "East"],
  [1005, "2023-01-15", "Printer", "Accessories", 1, 6999, 6999, "North"],
  [1006, "2023-01-16", "Keyboard", "Electronics", 3, 1499, 4497, "West"],
  [1007, "2023-01-20", "Whiteboard", "Stationery", 4, 1199, 4796, "East"],
  [1008, "2023-01-22", "Monitor", "Electronics", 2, 12999, 25998, "South"],
  [1009, "2023-01-25", "Desk", "Furniture", 2, 7999, 15998, "North"],
  [1010, "2023-01-28", "Pen", "Stationery", 20, 20, 400, "West"],
];

const starterCode = `import pandas as pd

# Load the provided dataset
df = pd.read_csv("sales.csv")

# Total sales by category
category_sales = (
    df.groupby("Category")["Sales"]
      .sum()
      .sort_values(ascending=False)
)

print("Category-wise Total Sales:")
print(category_sales)

# Top 5 products by total sales
top_products = (
    df.groupby("Product Name")["Sales"]
      .sum()
      .sort_values(ascending=False)
      .head(5)
)

print("\\nTop 5 Products by Sales:")
print(top_products)`;

const expectedRows = [
  ["Electronics", "132,988"],
  ["Furniture", "24,997"],
  ["Accessories", "6,999"],
  ["Stationery", "8,186"],
];

export default function PythonLearningPage() {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [code, setCode] = useState(starterCode);
  const [output, setOutput] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const [activeOutput, setActiveOutput] = useState<"output" | "expected">("output");
  const [saved, setSaved] = useState(false);

  const scenario = scenarios[scenarioIndex];
  const dataset = useMemo(() => ({ name: "Sales_Data", columns, rows }), []);

  function runCode() {
    // Frontend-only preview until the isolated Python worker is connected.
    setOutput(`Category-wise Total Sales:\n\nElectronics    132988\nFurniture       24997\nStationery       8186\nAccessories      6999\n\nTop 5 Products by Sales:\n\nLaptop          99998\nMonitor         25998\nDesk            15998\nDesk Chair       8999\nPrinter          6999`);
    setActiveOutput("output");
  }

  function resetWorkspace() {
    setCode(starterCode);
    setOutput("");
    setSaved(false);
    setResetKey((value) => value + 1);
  }

  function selectScenario(index: number) {
    setScenarioIndex(index);
    setOutput("");
    setSaved(false);
  }

  return (
    <LearningModeShell active="playground" eyebrow="PYTHON PRACTICE" title="Python Data Analysis" description="Learn Python by solving realistic data problems with datasets, code, output and business reasoning." variant="workspace">
      <section className="python-hero">
        <div className="python-mark">Py</div>
        <div className="hero-copy"><div className="kicker">PYTHON PRACTICE · SCENARIO {String(scenarioIndex + 1).padStart(2, "0")} OF 04</div><div className="hero-title"><h1>{scenario.title}</h1><span>{scenario.level}</span></div><p>{scenario.description}</p></div>
        <div className="scenario-picker"><span>SCENARIO</span><select value={scenarioIndex} onChange={(event) => selectScenario(Number(event.target.value))}>{scenarios.map((item, index) => <option value={index} key={item.title}>{String(index + 1).padStart(2, "0")} · {item.title}</option>)}</select></div>
      </section>

      <section className="progress-line"><div><span>Lesson progress</span><strong>68%</strong></div><i><b /></i><div className="steps"><span className="active">Scenario</span><span>Solve</span><span>Check</span></div></section>

      <section className="main-grid">
        <div className="left-column">
          <section className="panel scenario-panel"><div className="panel-title"><span className="icon blue">↗</span><div><strong>Business scenario</strong><small>Why this problem matters</small></div></div><p>{scenario.description}</p><div className="objective"><span>OBJECTIVE</span><strong>{scenario.objective}</strong></div></section>

          <section className="panel task-panel"><div className="panel-title"><span className="icon blue">✓</span><div><strong>Task instructions</strong><small>Work through the problem in order</small></div></div><ol>{scenario.steps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol></section>

          <section className="panel expected-panel"><div className="panel-head"><div className="panel-title"><span className="icon green">▤</span><div><strong>Expected output</strong><small>Reference result</small></div></div><button type="button" onClick={() => setActiveOutput("expected")}>View</button></div><div className="expected-table"><div><span>Category</span><span>Total Sales</span></div>{expectedRows.map(([category, total]) => <div key={category}><span>{category}</span><strong>{total}</strong></div>)}</div></section>
        </div>

        <div className="right-column">
          <section className="panel dataset-panel"><div className="panel-head"><div className="panel-title"><span className="icon cyan">▦</span><div><strong>Dataset: Sales_Data</strong><small>Editable spreadsheet · Excel-style cell references</small></div></div><div className="panel-actions"><button type="button" onClick={() => setResetKey((value) => value + 1)}>↻ Reset data</button><button type="button">↓ Download CSV</button><button type="button">＋ Add rows</button></div></div><PythonDatasetSheet dataset={dataset} resetKey={resetKey} /></section>

          <section className="panel code-panel"><div className="panel-head"><div className="panel-title"><span className="icon yellow">Py</span><div><strong>Python workspace</strong><small>Write, run and inspect your solution</small></div></div><div className="panel-actions"><button type="button" onClick={resetWorkspace}>Clear</button><button type="button">Examples⌄</button></div></div><div className="editor-toolbar"><span>main.py</span><span>Python 3</span><button type="button" onClick={() => setSaved(true)}>{saved ? "Saved" : "Save"}</button></div><textarea className="code-editor" value={code} onChange={(event) => { setCode(event.target.value); setSaved(false); }} spellCheck={false} aria-label="Python code editor" /><div className="run-row"><button className="run-button" type="button" onClick={runCode}>▶ Run Code</button><span>Frontend preview · execution worker will connect here</span></div></section>

          <section className="panel output-panel"><div className="panel-head"><div className="panel-title"><span className="icon purple">›_</span><div><strong>Output</strong><small>{output ? "Execution result" : "Run your code to see the result"}</small></div></div>{output && <button type="button" onClick={() => setOutput("")}>Clear output</button>}</div><div className="output-tabs"><button className={activeOutput === "output" ? "active" : ""} type="button" onClick={() => setActiveOutput("output")}>Console</button><button className={activeOutput === "expected" ? "active" : ""} type="button" onClick={() => setActiveOutput("expected")}>Expected</button></div><pre>{activeOutput === "output" ? (output || "No output yet. Run the code to inspect the result.") : expectedRows.map(([category, total]) => `${category.padEnd(14)} ${total}`).join("\\n")}</pre></section>
        </div>
      </section>

      <section className="learning-footer"><div><span>LEARNING FLOW</span><strong>Scenario → dataset → code → output → business reasoning</strong></div><p>The workspace is intentionally dataset-first. The frontend is ready for the isolated Python execution service defined in the Ilm-os architecture.</p></section>

      <style jsx>{`
        .python-hero{display:grid;grid-template-columns:72px minmax(0,1fr) 300px;gap:18px;align-items:center;padding:14px 0 20px;border-bottom:1px solid rgba(255,255,255,.07)}
        .python-mark{width:62px;height:62px;display:grid;place-items:center;border:1px solid rgba(60,175,255,.6);border-radius:12px;background:linear-gradient(145deg,#0f2e4c,#111b2b);color:#ffd343;font-weight:900;font-size:23px;box-shadow:0 0 30px rgba(35,134,255,.12)}
        .kicker{color:#63a8ff;font-size:10px;font-weight:800;letter-spacing:.15em}.hero-title{display:flex;align-items:center;gap:12px;margin-top:5px}.hero-title h1{margin:0;font-size:34px;letter-spacing:-.04em}.hero-title span{padding:5px 10px;border:1px solid rgba(72,113,255,.32);border-radius:999px;background:rgba(44,80,220,.12);color:#73a1ff;font-size:10px;font-weight:800}.hero-copy p{margin:5px 0 0;color:#7f8999;font-size:13px;line-height:1.55}.scenario-picker{padding:12px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(12,18,29,.75)}.scenario-picker span{display:block;color:#647082;font-size:9px;font-weight:800;letter-spacing:.14em;margin-bottom:7px}.scenario-picker select{width:100%;border:0;outline:0;background:#101827;color:#dce5f2;border-radius:8px;padding:9px;font-size:11px}
        .progress-line{display:grid;grid-template-columns:auto minmax(150px,1fr) auto;align-items:center;gap:12px;padding:14px 0}.progress-line>div:first-child{display:flex;gap:8px;color:#8d97a6;font-size:10px}.progress-line>div:first-child strong{color:#e2e8f2}.progress-line>i{height:6px;border-radius:99px;background:#182131;overflow:hidden}.progress-line>i b{display:block;width:68%;height:100%;background:linear-gradient(90deg,#1c72ff,#55a0ff);border-radius:inherit}.steps{display:flex;gap:18px;color:#5f6979;font-size:9px;font-weight:700}.steps .active{color:#67a7ff}
        .main-grid{display:grid;grid-template-columns:300px minmax(0,1fr);gap:16px}.left-column,.right-column{display:grid;gap:16px;align-content:start}.panel{border:1px solid rgba(255,255,255,.07);border-radius:14px;background:linear-gradient(145deg,rgba(14,21,33,.95),rgba(8,13,21,.95));box-shadow:0 15px 45px rgba(0,0,0,.14);overflow:hidden}.panel-head{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:15px 16px;border-bottom:1px solid rgba(255,255,255,.06)}.panel-title{display:flex;align-items:center;gap:10px;min-width:0}.panel-title strong,.panel-title small{display:block}.panel-title strong{font-size:12px}.panel-title small{margin-top:3px;color:#687486;font-size:9px}.icon{width:30px;height:30px;display:grid;place-items:center;border-radius:8px;background:#111a29;font-size:12px;font-weight:800;flex:0 0 auto}.icon.blue{color:#6fa5ff}.icon.cyan{color:#49c7f3}.icon.green{color:#48d8ae}.icon.yellow{color:#ffd24a}.icon.purple{color:#b692ff}.panel>p{margin:0;padding:0 16px 16px;color:#8b95a4;font-size:12px;line-height:1.65}.objective{margin:0 16px 16px;padding:11px;border:1px solid rgba(80,130,255,.15);border-radius:9px;background:rgba(39,82,210,.06)}.objective span{display:block;color:#5d91e9;font-size:8px;font-weight:800;letter-spacing:.14em}.objective strong{display:block;margin-top:5px;color:#c7d0dd;font-size:10px;line-height:1.55}.task-panel{padding-bottom:7px}.task-panel ol{list-style:none;margin:0;padding:3px 16px 12px}.task-panel li{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.045)}.task-panel li:last-child{border-bottom:0}.task-panel li>span{display:grid;place-items:center;width:22px;height:22px;border-radius:50%;background:#1553e9;color:white;font-size:10px;font-weight:800;flex:0 0 auto}.task-panel li p{margin:2px 0 0;color:#b6c0cf;font-size:10px;line-height:1.5}.expected-panel{padding-bottom:12px}.expected-panel .panel-head button,.panel-actions button,.text-button{border:1px solid rgba(255,255,255,.08);border-radius:7px;background:#0f1724;color:#94a0b1;padding:6px 8px;font-size:9px}.expected-table{margin:0 12px;border:1px solid rgba(255,255,255,.07);border-radius:8px;overflow:hidden}.expected-table div{display:grid;grid-template-columns:1fr 1fr;padding:8px 9px;border-bottom:1px solid rgba(255,255,255,.05);font-size:9px;color:#9aa5b5}.expected-table div:last-child{border-bottom:0}.expected-table div:first-child{background:#111a29;color:#6f7b8e;font-weight:800}.expected-table strong{color:#d9e1ec;text-align:right}
        .dataset-panel{min-width:0}.panel-actions{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}.dataset-panel :global(.python-sheet){margin:0 12px 12px;width:calc(100% - 24px)}.sheet-loading{height:470px;display:grid;place-items:center;color:#6c7788;background:#fff;border-radius:12px;font-size:11px}.code-panel,.output-panel{min-width:0}.editor-toolbar{display:flex;align-items:center;gap:12px;padding:8px 12px;background:#0a111c;border-bottom:1px solid rgba(255,255,255,.06);color:#778396;font-size:9px}.editor-toolbar span:first-child{color:#c5cedb}.editor-toolbar span:nth-child(2){padding-left:10px;border-left:1px solid rgba(255,255,255,.08)}.editor-toolbar button{margin-left:auto;border:0;background:transparent;color:#688fda;font-size:9px}.code-editor{display:block;width:100%;height:330px;resize:vertical;border:0;outline:0;padding:16px 17px;background:#070c13;color:#d8e1ee;font-family:"SFMono-Regular",Consolas,"Liberation Mono",monospace;font-size:11px;line-height:1.7;tab-size:4}.run-row{display:flex;align-items:center;gap:10px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.06);background:#0a111b}.run-button{border:0;border-radius:8px;background:#1c61f2;color:white;padding:9px 13px;font-size:10px;font-weight:800;box-shadow:0 8px 22px rgba(28,97,242,.2)}.run-row span{color:#596677;font-size:9px}.output-tabs{display:flex;gap:2px;padding:8px 12px 0;background:#0a111c}.output-tabs button{border:0;border-bottom:2px solid transparent;background:transparent;color:#697587;padding:7px 10px;font-size:9px}.output-tabs button.active{color:#d9e2ef;border-color:#3985ff}.output-panel pre{min-height:230px;margin:0;padding:16px;background:#05090e;color:#b7d6c5;font-family:"SFMono-Regular",Consolas,monospace;font-size:10px;line-height:1.65;white-space:pre-wrap}.learning-footer{display:flex;justify-content:space-between;gap:30px;margin-top:16px;padding:15px 17px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:rgba(255,255,255,.015)}.learning-footer span{display:block;color:#5d9df1;font-size:8px;font-weight:800;letter-spacing:.14em}.learning-footer strong{display:block;margin-top:5px;color:#c7d0dc;font-size:11px}.learning-footer p{max-width:520px;margin:0;color:#606c7c;font-size:9px;line-height:1.6}
        @media(max-width:1100px){.python-hero{grid-template-columns:62px minmax(0,1fr)}.scenario-picker{grid-column:2}.main-grid{grid-template-columns:1fr}.left-column{grid-template-columns:repeat(3,minmax(0,1fr))}.scenario-panel,.task-panel,.expected-panel{height:100%}}@media(max-width:780px){.python-hero{grid-template-columns:1fr}.python-mark{width:58px}.scenario-picker{grid-column:auto}.progress-line{grid-template-columns:1fr}.steps{justify-content:space-between}.left-column{grid-template-columns:1fr}.panel-actions{display:none}.learning-footer{display:block}.learning-footer p{margin-top:10px}.code-editor{height:300px}}@media(max-width:520px){.hero-title h1{font-size:28px}.workspace-content{padding-top:8px}}
      `}</style>
    </LearningModeShell>
  );
}
