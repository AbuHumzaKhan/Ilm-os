"use client";

import { useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

const questions = [
  { title: "Sales lookup", level: "Foundation", prompt: "A sales manager has an Employee ID and needs to retrieve the employee's current sales figure from a master table. Which lookup design would you choose and why?" },
  { title: "Monthly reporting", level: "Core", prompt: "A monthly report contains product codes, while the reference table contains product descriptions and categories. Design a lookup approach that remains readable for a reporting team." },
  { title: "Missing records", level: "Core", prompt: "A customer lookup occasionally fails because a customer ID is not present. How would you design the formula so the report shows a useful business message instead of an error?" },
  { title: "Modernization", level: "Advanced", prompt: "An analyst inherited a workbook using many VLOOKUP formulas. Explain when you would consider replacing them with XLOOKUP or INDEX + MATCH." },
];

export default function BusinessQuestionsPage() {
  const [selected, setSelected] = useState(0);
  const [answer, setAnswer] = useState("");
  const item = questions[selected];

  return (
    <LearningModeShell
      active="business"
      eyebrow="05 / BUSINESS QUESTIONS"
      title="Turn formulas into decisions."
      description="Scenario-based practice connects technical concepts to analyst and business problems. Later, the backend can score reasoning, attach datasets and generate personalized feedback."
    >
      <section className="business-layout">
        <aside className="question-list">
          <div className="list-head"><span>SCENARIOS</span><strong>{questions.length}</strong></div>
          {questions.map((question, index) => (
            <button key={question.title} type="button" className={selected === index ? "selected" : ""} onClick={() => { setSelected(index); setAnswer(""); }}>
              <span>0{index + 1}</span><div><strong>{question.title}</strong><small>{question.level}</small></div>
            </button>
          ))}
        </aside>

        <section className="scenario-card">
          <div className="scenario-meta"><span>CASE 0{selected + 1}</span><span>{item.level}</span></div>
          <div className="case-icon">↗</div>
          <h2>{item.title}</h2>
          <p className="scenario-question">{item.prompt}</p>
          <label htmlFor="business-answer">Your reasoning</label>
          <textarea id="business-answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder="Explain your approach, assumptions and trade-offs…" rows={8} />
          <div className="scenario-actions"><span>Evaluation will later combine correctness, reasoning quality and business context.</span><button type="button" disabled={!answer.trim()}>Submit reasoning →</button></div>
        </section>
      </section>

      <section className="business-outcomes">
        <div><span>BUSINESS CONTEXT</span><strong>Why this exists</strong><p>Learning should not stop at syntax. Learners need to translate spreadsheet techniques into reporting, operations and decision-support situations.</p></div>
        <div><span>BACKEND HOOKS</span><strong>What will connect later</strong><p>Scenario bank, datasets, rubrics, evaluation, feedback, attempts and mastery progression.</p></div>
        <div><span>SKILL GRAPH</span><strong>Where it leads</strong><p>VLOOKUP → XLOOKUP → data modeling → reporting → business analysis.</p></div>
      </section>

      <style jsx>{`
        .business-layout { display: grid; grid-template-columns: 285px minmax(0,1fr); gap: 16px; margin-top: 28px; }
        .question-list, .scenario-card, .business-outcomes > div { border: 1px solid rgba(255,255,255,.075); background: rgba(13,16,23,.86); border-radius: 18px; }
        .question-list { padding: 13px; } .list-head { display:flex; justify-content:space-between; padding: 9px 9px 14px; color:#626c7b; font-size:9px; font-weight:800; letter-spacing:.14em; } .list-head strong { color:#9ca6b5; letter-spacing:0; }
        .question-list button { width:100%; display:grid; grid-template-columns:30px 1fr; gap:9px; text-align:left; padding:13px 9px; border:1px solid transparent; border-radius:11px; background:transparent; color:#8791a0; } .question-list button:hover { background:rgba(255,255,255,.02); } .question-list button.selected { background:rgba(65,85,255,.1); border-color:rgba(80,103,255,.22); color:#e8edf7; } .question-list button > span { color:#566172; font-size:10px; padding-top:2px; } .question-list strong, .question-list small { display:block; } .question-list strong { font-size:12px; } .question-list small { margin-top:4px; color:#5f6979; font-size:9px; text-transform:uppercase; letter-spacing:.08em; }
        .scenario-card { padding: 30px; } .scenario-meta { display:flex; justify-content:space-between; color:#687383; font-size:9px; font-weight:800; letter-spacing:.13em; } .scenario-meta span:last-child { color:#b789ff; }
        .case-icon { display:grid; place-items:center; width:47px; height:47px; margin-top:30px; border-radius:13px; background:#151a27; color:#6e9fff; font-size:20px; } .scenario-card h2 { margin:16px 0 9px; font-size:30px; letter-spacing:-.04em; } .scenario-question { max-width:850px; margin:0; color:#a4adbc; font-size:15px; line-height:1.75; }
        label { display:block; margin-top:28px; margin-bottom:8px; color:#7b8595; font-size:10px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; } textarea { width:100%; resize:vertical; min-height:170px; padding:15px; border:1px solid rgba(255,255,255,.07); border-radius:12px; outline:0; background:#090c12; color:#dbe3ef; font:13px/1.65 Inter, sans-serif; } textarea:focus { border-color:rgba(82,108,255,.5); }
        .scenario-actions { display:flex; align-items:center; justify-content:space-between; gap:15px; margin-top:13px; } .scenario-actions span { max-width:560px; color:#596475; font-size:10px; line-height:1.5; } .scenario-actions button { border:0; border-radius:10px; padding:12px 15px; background:#2437d8; color:white; font-size:11px; font-weight:700; } .scenario-actions button:disabled { opacity:.35; }
        .business-outcomes { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-top:14px; } .business-outcomes > div { padding:19px; } .business-outcomes span { color:#5f9cff; font-size:9px; font-weight:800; letter-spacing:.13em; } .business-outcomes strong { display:block; margin-top:8px; font-size:14px; } .business-outcomes p { color:#667182; font-size:11px; line-height:1.55; }
        @media(max-width:800px){ .business-layout{grid-template-columns:1fr}.business-outcomes{grid-template-columns:1fr}.scenario-actions{display:block}.scenario-actions button{margin-top:12px} }
      `}</style>
    </LearningModeShell>
  );
}
