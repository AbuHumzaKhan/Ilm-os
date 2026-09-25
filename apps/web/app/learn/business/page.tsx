"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

const BusinessDatasetSheet = dynamic(
  () => import("../../../components/learning/BusinessDatasetSheet"),
  { ssr: false, loading: () => <div className="sheet-loading">Loading dataset…</div> }
);

type Dataset = {
  id: string;
  name: string;
  description: string;
  task: string;
  columns: string[];
  rows: Array<Array<string | number>>;
};

type Scenario = {
  title: string;
  level: string;
  prompt: string;
  datasetId: string;
  taskSteps: string[];
  lookupColumn: number;
};

const datasets: Dataset[] = [
  {
    id: "sales-lookup",
    name: "Product Master",
    description: "A sales table used to retrieve product information and sales values with an exact-match lookup.",
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
  },
  {
    id: "monthly-reporting",
    name: "Monthly Reporting",
    description: "A reporting table where product codes need to be translated into readable business information.",
    task: "Return the matching product information for each code in the report.",
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
  },
  {
    id: "missing-records",
    name: "Product Master",
    description: "A product table containing valid and missing IDs so you can practice error-safe lookup design.",
    task: "Return the Product Name for each Customer ID. If an ID is missing, show a useful business message instead of an error.",
    columns: ["Customer ID", "Product Name", "Category", "Unit Price", "Stock", "Status"],
    rows: [
      ["C201", "Laptop", "Electronics", 899, 15, "Active"],
      ["C202", "Mouse", "Electronics", 25, 100, "Active"],
      ["C203", "Keyboard", "Electronics", 45, 80, "Active"],
      ["C204", "Monitor", "Electronics", 199, 40, "Active"],
      ["C205", "Printer", "Accessories", 120, 30, "Active"],
      ["C206", "Desk Chair", "Furniture", 150, 25, "Active"],
      ["C207", "Desk", "Furniture", 300, 20, "Active"],
      ["C208", "Notebook", "Stationery", 5, 200, "Active"],
      ["C209", "Pen", "Stationery", 2, 500, "Active"],
      ["C210", "Whiteboard", "Accessories", 90, 15, "Active"],
    ],
  },
  {
    id: "modernization",
    name: "Employee Master",
    description: "A wider table for comparing traditional lookup patterns with modern alternatives.",
    task: "Retrieve the employee value and explain how the lookup could be modernized.",
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
  },
];

const scenarios: Scenario[] = [
  { title: "Sales lookup", level: "Foundation", prompt: "A sales manager has a product code and needs to retrieve the current sales figure from a master table.", datasetId: "sales-lookup", taskSteps: ["Use VLOOKUP to find the product code.", "Return the Sales value from the master table.", "Use an exact match."], lookupColumn: 6 },
  { title: "Monthly reporting", level: "Core", prompt: "A monthly report contains product codes while the reference data is structured for reporting.", datasetId: "monthly-reporting", taskSteps: ["Use the Code as the lookup key.", "Return the required value from the table.", "Keep the formula readable for reporting."], lookupColumn: 2 },
  { title: "Missing records", level: "Core", prompt: "A lookup occasionally fails because an ID is not present. The report should show a useful business message instead of an error.", datasetId: "missing-records", taskSteps: ["Use VLOOKUP to return Product Name.", "If the ID is not found, show “Product not found”.", "Use the table range A2:F11.", "Enter the formula in B2 and copy it down."], lookupColumn: 2 },
  { title: "Modernization", level: "Advanced", prompt: "An analyst inherited a workbook using many VLOOKUP formulas and needs to assess a more flexible lookup pattern.", datasetId: "modernization", taskSteps: ["Identify the lookup key.", "Return the employee value.", "Explain one maintainability improvement."], lookupColumn: 2 },
];

const missingIds = ["C201", "C205", "C208", "C999", "C211", "C210"];

function columnLetter(index: number) {
  let value = index + 1;
  let result = "";
  while (value > 0) {
    const remainder = (value - 1) % 26;
    result = String.fromCharCode(65 + remainder) + result;
    value = Math.floor((value - 1) / 26);
  }
  return result;
}

export default function BusinessQuestionsPage() {
  const [selected, setSelected] = useState(2);
  const [formula, setFormula] = useState('=IFERROR(VLOOKUP(A2,A2:F11,2,FALSE),"Product not found")');
  const [hasRun, setHasRun] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const scenario = scenarios[selected];
  const dataset = useMemo(() => datasets.find((entry) => entry.id === scenario.datasetId) ?? datasets[0], [scenario.datasetId]);
  const isMissingRecords = scenario.id === undefined ? false : scenario.datasetId === "missing-records";
  const workIds = isMissingRecords ? missingIds : dataset.rows.slice(0, 6).map((row) => String(row[0]));

  const resultRows = useMemo(() => {
    return workIds.map((lookupId) => {
      const match = dataset.rows.find((row) => String(row[0]) === lookupId);
      const value = match ? String(match[scenario.lookupColumn - 1] ?? "") : "";
      return {
        lookupId,
        value,
        found: Boolean(match),
        message: match ? "" : "Product not found",
      };
    });
  }, [dataset, scenario.lookupColumn, workIds]);

  const chooseScenario = (index: number) => {
    setSelected(index);
    setHasRun(false);
    setResetKey((value) => value + 1);
    setFormula(index === 2 ? '=IFERROR(VLOOKUP(A2,A2:F11,2,FALSE),"Product not found")' : `=VLOOKUP(A2,A2:F11,${scenarios[index].lookupColumn},FALSE)`);
  };

  const formulaLooksValid = /VLOOKUP\s*\(/i.test(formula) && /FALSE\s*\)?/i.test(formula);
  const scenarioNumber = String(selected + 1).padStart(2, "0");

  return (
    <LearningModeShell active="business" eyebrow="" title="" description="" variant="workspace">
      <section className="scenario-hero">
        <div className="scenario-icon">▣</div>
        <div className="scenario-copy">
          <div className="scenario-kicker">BUSINESS QUESTIONS <span>·</span> SCENARIO {scenarioNumber} OF 04</div>
          <div className="scenario-title-row"><h1>{scenario.title}</h1><span>{scenario.level}</span></div>
          <p>{scenario.prompt}</p>
        </div>
        <div className="scenario-switcher" aria-label="Choose scenario">
          <button type="button" onClick={() => chooseScenario((selected + scenarios.length - 1) % scenarios.length)} aria-label="Previous scenario">‹</button>
          <strong>{scenarioNumber}/04</strong>
          <button type="button" onClick={() => chooseScenario((selected + 1) % scenarios.length)} aria-label="Next scenario">›</button>
        </div>
      </section>

      <section className="workspace-grid">
        <div className="workspace-left">
          <section className="panel dataset-panel">
            <div className="panel-head">
              <div className="panel-title"><span className="panel-icon blue">▦</span><div><strong>Dataset: {dataset.name}</strong><small>Editable · Excel mode</small></div></div>
              <div className="panel-actions"><button type="button" onClick={() => setResetKey((value) => value + 1)}>↻ Reset data</button><button type="button">＋ Add rows</button></div>
            </div>
            <BusinessDatasetSheet dataset={dataset} resetKey={resetKey} />
          </section>

          <section className="panel work-panel">
            <div className="panel-head compact-head">
              <div className="panel-title"><span className="panel-icon purple">▤</span><div><strong>Your work area</strong><small>Write your lookup formula here</small></div></div>
              <span className="cell-help">A–F columns · 1–30 rows</span>
            </div>
            <div className="mini-sheet">
              <div className="corner" /><div className="col-head">A</div><div className="col-head">B</div><div className="col-head">C</div><div className="col-head">D</div>
              {workIds.map((id, index) => <div className="sheet-row" key={`${id}-${index}`}>
                <span className="row-head">{index + 2}</span>
                <span className="cell key-cell">{id}</span>
                <span className="cell">{hasRun ? resultRows[index]?.value ?? "" : ""}</span>
                <span className="cell">{hasRun && resultRows[index]?.found ? "Matched" : ""}</span>
                <span className={`cell ${hasRun && !resultRows[index]?.found ? "error-cell" : ""}`}>{hasRun && !resultRows[index]?.found ? "Product not found" : ""}</span>
              </div>)}
            </div>
          </section>
        </div>

        <aside className="workspace-right">
          <section className="panel instructions-panel">
            <div className="panel-title"><span className="panel-icon cyan">✓</span><div><strong>Task instructions</strong><small>Follow these steps</small></div></div>
            <ol>{scenario.taskSteps.map((step, index) => <li key={step}><span>{index + 1}</span><p>{step}</p></li>)}</ol>
          </section>

          <section className="panel formula-panel">
            <div className="panel-head compact-head">
              <div className="panel-title"><span className="panel-icon blue">ƒx</span><div><strong>Formula</strong><small>Enter your spreadsheet logic</small></div></div>
              <button type="button" className="text-button" onClick={() => setFormula(scenario.datasetId === "missing-records" ? '=IFERROR(VLOOKUP(A2,A2:F11,2,FALSE),"Product not found")' : `=VLOOKUP(A2,A2:F11,${scenario.lookupColumn},FALSE)`)}>Formula guide</button>
            </div>
            <label htmlFor="formula">Write your formula in B2</label>
            <div className="formula-input"><input id="formula" value={formula} onChange={(event) => { setFormula(event.target.value); setHasRun(false); }} spellCheck={false} /><span>↗</span></div>
            <div className="formula-actions"><button type="button" className="run-button" onClick={() => setHasRun(true)} disabled={!formula.trim()}>▶ Run formula</button><button type="button" onClick={() => { setFormula(""); setHasRun(false); }}>↻ Clear</button><button type="button" onClick={() => setHasRun(true)} disabled={!formulaLooksValid}>Auto fill (B2:B{workIds.length + 1})</button></div>
          </section>

          <section className="panel result-panel">
            <div className="panel-head compact-head">
              <div className="panel-title"><span className="panel-icon green">✓</span><div><strong>Result</strong><small>{hasRun ? "Formula evaluated" : "Run your formula to check"}</small></div></div>
              {hasRun && <span className="success-badge">Success</span>}
            </div>
            <div className="result-tabs"><button className="active" type="button">View result</button><button type="button">Expected output</button></div>
            <div className="result-table">
              <div className="result-row result-head"><span>Row</span><span>Customer ID</span><span>Product Name</span><span>Message</span></div>
              {resultRows.map((row, index) => <div className="result-row" key={`${row.lookupId}-${index}`}><span>{index + 2}</span><span>{row.lookupId}</span><span>{hasRun && row.found ? row.value : "—"}</span><span>{hasRun && !row.found ? <b>{row.message}</b> : hasRun ? "" : "Run formula"}</span></div>)}
            </div>
            {hasRun && !formulaLooksValid && <div className="result-warning">The formula ran, but it does not look like an exact-match VLOOKUP yet. Check the lookup range and final FALSE argument.</div>}
          </section>
        </aside>
      </section>

      <section className="learning-note"><span>Learning flow</span><strong>Scenario → dataset → formula → result</strong><p>No unrelated recommendations or extra sections interrupt the exercise. The same workspace can later receive server-side evaluation and saved mastery data.</p></section>

      <style jsx>{`
        .scenario-hero{display:grid;grid-template-columns:78px minmax(0,1fr) auto;gap:20px;align-items:center;padding:18px 0 22px;border-bottom:1px solid rgba(255,255,255,.07)}
        .scenario-icon{width:64px;height:64px;display:grid;place-items:center;border:1px solid rgba(255,202,0,.7);border-radius:12px;background:rgba(255,193,7,.1);color:#ffc400;font-size:27px}.scenario-kicker{color:#aeb8c8;font-size:10px;font-weight:800;letter-spacing:.14em}.scenario-kicker span{color:#596475;margin:0 5px}.scenario-title-row{display:flex;align-items:center;gap:12px;margin:4px 0 3px}.scenario-title-row h1{margin:0;font-size:42px;line-height:1;letter-spacing:-.045em}.scenario-title-row>span{padding:5px 10px;border-radius:999px;background:#8c26e8;color:#fff;font-size:10px;font-weight:800}.scenario-copy>p{max-width:800px;margin:0;color:#aab3c1;font-size:14px;line-height:1.55}.scenario-switcher{display:flex;align-items:center;gap:8px;color:#8d98a8}.scenario-switcher button{width:30px;height:30px;border:1px solid rgba(255,255,255,.09);border-radius:8px;background:#111a28;color:#dbe4f2;font-size:19px;cursor:pointer}.scenario-switcher strong{font-size:11px;letter-spacing:.08em}
        .workspace-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(390px,.9fr);gap:14px;margin-top:14px;align-items:start}.workspace-left,.workspace-right{display:grid;gap:14px;min-width:0}.panel{border:1px solid rgba(255,255,255,.075);border-radius:15px;background:linear-gradient(145deg,rgba(14,22,35,.94),rgba(8,13,22,.94));overflow:hidden;box-shadow:0 16px 45px rgba(0,0,0,.15)}.panel-head{min-height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.065)}.compact-head{min-height:58px}.panel-title{display:flex;align-items:center;gap:10px;min-width:0}.panel-title>div{min-width:0}.panel-title strong,.panel-title small{display:block}.panel-title strong{font-size:13px;color:#e6edf7}.panel-title small{margin-top:3px;color:#69778b;font-size:9px}.panel-icon{width:32px;height:32px;display:grid;place-items:center;border-radius:8px;font-size:13px;font-weight:800}.panel-icon.blue{background:rgba(36,102,255,.18);color:#5da1ff}.panel-icon.purple{background:rgba(142,63,255,.18);color:#b88aff}.panel-icon.cyan{background:rgba(29,204,220,.16);color:#49d8e4}.panel-icon.green{background:rgba(31,211,160,.15);color:#34dbab}.panel-actions{display:flex;gap:7px}.panel-actions button,.formula-actions button{padding:8px 10px;border:1px solid rgba(255,255,255,.09);border-radius:8px;background:#101a29;color:#b8c4d3;font-size:10px;cursor:pointer}.panel-actions button:hover,.formula-actions button:hover{border-color:rgba(83,132,255,.45);color:#fff}.dataset-panel :global(.dataset-sheet-shell){height:410px;border:0;border-radius:0}.dataset-panel :global(.fortune-sheet-container){border-radius:0}.sheet-loading{height:410px;display:grid;place-items:center;color:#758298;font-size:12px;background:#fff}.cell-help{color:#657287;font-size:9px}.work-panel{padding-bottom:12px}.mini-sheet{display:grid;grid-template-columns:42px repeat(4,minmax(80px,1fr));margin:0 12px;border:1px solid #d8e0eb;background:#fff;color:#172132;overflow:hidden;border-radius:7px}.corner,.col-head,.row-head,.cell{min-height:29px;display:flex;align-items:center;border-right:1px solid #dbe2ec;border-bottom:1px solid #dbe2ec;font-size:10px}.corner,.col-head,.row-head{background:#edf3fb;color:#56657a;font-weight:700;justify-content:center}.col-head{min-height:26px}.sheet-row{display:contents}.row-head{grid-column:auto}.cell{padding:0 8px;background:#fff}.key-cell{font-weight:700}.error-cell{color:#c62828;background:#fff1f1;font-size:9px}.instructions-panel{padding-bottom:8px}.instructions-panel .panel-title{padding:14px 14px 5px}.instructions-panel ol{list-style:none;padding:4px 14px 7px;margin:0}.instructions-panel li{display:flex;gap:10px;align-items:flex-start;padding:9px 0}.instructions-panel li>span{flex:0 0 24px;width:24px;height:24px;display:grid;place-items:center;border-radius:50%;background:#1765dd;color:#fff;font-size:10px;font-weight:800}.instructions-panel li:nth-child(4)>span{background:#10a981}.instructions-panel p{margin:2px 0 0;color:#b9c3d1;font-size:11px;line-height:1.5}.formula-panel{padding-bottom:13px}.formula-panel .panel-head{border-bottom:0}.text-button{border:1px solid rgba(77,133,255,.3);background:rgba(31,78,190,.1);color:#69a2ff;padding:7px 9px;border-radius:8px;font-size:9px;cursor:pointer}.formula-panel label{display:block;padding:0 14px 7px;color:#7f8ca0;font-size:9px}.formula-input{display:flex;align-items:center;margin:0 14px;border:1px solid rgba(89,126,180,.34);border-radius:8px;background:#07101c}.formula-input input{width:100%;min-width:0;padding:13px;border:0;outline:0;background:transparent;color:#e6edf8;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px}.formula-input span{padding-right:10px;color:#66758a}.formula-actions{display:flex;gap:7px;flex-wrap:wrap;padding:10px 14px 0}.formula-actions .run-button{background:#1265f4;border-color:#1265f4;color:#fff;padding-inline:14px}.formula-actions button:disabled{opacity:.45;cursor:not-allowed}.result-panel{padding-bottom:12px}.success-badge{padding:5px 9px;border-radius:999px;background:rgba(24,207,155,.13);color:#31d9ab;border:1px solid rgba(24,207,155,.22);font-size:9px;font-weight:800}.result-tabs{display:flex;margin:0 14px;border-bottom:1px solid rgba(255,255,255,.07)}.result-tabs button{padding:8px 11px;border:0;background:transparent;color:#68768b;font-size:9px;cursor:pointer}.result-tabs button.active{color:#fff;background:#1767f2;border-radius:7px 7px 0 0}.result-table{margin:10px 14px 0;border:1px solid rgba(255,255,255,.08);border-radius:7px;overflow:hidden}.result-row{display:grid;grid-template-columns:34px 1fr 1.2fr 1.2fr;min-height:29px;align-items:center;border-bottom:1px solid rgba(255,255,255,.07);font-size:9px;color:#c2cbd7}.result-row:last-child{border-bottom:0}.result-row span{padding:0 7px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.result-head{background:#111c2c;color:#8290a5;font-weight:800}.result-row b{display:inline-block;padding:3px 6px;border-radius:999px;background:#401b27;color:#ff788b;font-size:8px;font-weight:700}.result-warning{margin:9px 14px 0;padding:9px;border:1px solid rgba(255,176,0,.2);border-radius:7px;background:rgba(255,176,0,.06);color:#c9b27a;font-size:9px;line-height:1.5}.learning-note{display:flex;align-items:center;gap:10px;margin-top:14px;padding:10px 13px;border:1px solid rgba(255,255,255,.06);border-radius:10px;background:rgba(255,255,255,.018);color:#778398;font-size:9px}.learning-note span{color:#579cff;font-weight:800;text-transform:uppercase;letter-spacing:.1em}.learning-note strong{color:#b8c2d1}.learning-note p{margin:0}
        @media(max-width:1050px){.workspace-grid{grid-template-columns:1fr}.workspace-right{grid-template-columns:1fr 1fr}.result-panel{grid-column:1/-1}.scenario-hero{grid-template-columns:62px 1fr}.scenario-switcher{grid-column:2}.scenario-icon{width:54px;height:54px}.scenario-title-row h1{font-size:35px}}@media(max-width:700px){.workspace-right{grid-template-columns:1fr}.result-panel{grid-column:auto}.scenario-hero{grid-template-columns:1fr}.scenario-switcher{grid-column:auto}.scenario-title-row h1{font-size:30px}.panel-head{align-items:flex-start}.panel-actions{display:none}.dataset-panel :global(.dataset-sheet-shell){height:370px}.mini-sheet{overflow:auto;grid-template-columns:42px repeat(4,130px)}.learning-note{display:block}.learning-note strong,.learning-note p{display:block;margin-top:4px}}
      `}</style>
    </LearningModeShell>
  );
}
