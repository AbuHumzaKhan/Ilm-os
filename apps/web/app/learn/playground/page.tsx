"use client";

import { useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

const starterFormula = '=VLOOKUP("E102",A2:D10,4,FALSE)';

export default function PlaygroundPage() {
  const [code, setCode] = useState(starterFormula);
  const [ran, setRan] = useState(false);

  return (
    <LearningModeShell
      active="playground"
      eyebrow="04 / PLAYGROUND"
      title="Practice without leaving the lesson."
      description="An interactive workspace for formula writing, code-like exercises, datasets and guided challenges. The editor is deliberately frontend-first and can later execute through a secure backend evaluator."
    >
      <section className="workspace-card">
        <div className="workspace-toolbar">
          <div><span className="live-dot" /> Formula playground</div>
          <div className="toolbar-actions"><button type="button">Reset</button><button type="button">Format</button><button type="button" className="run" onClick={() => setRan(true)}>Run ▶</button></div>
        </div>
        <div className="playground-grid">
          <div className="editor-pane">
            <div className="pane-label">FORMULA</div>
            <div className="editor">
              <div className="line-numbers">1<br />2<br />3<br />4<br />5<br />6</div>
              <textarea value={code} onChange={(event) => { setCode(event.target.value); setRan(false); }} spellCheck={false} aria-label="Formula editor" />
            </div>
            <div className="editor-hint">Try changing the lookup key, return column or match mode.</div>
          </div>
          <div className="result-pane">
            <div className="pane-label">RESULT</div>
            <div className={`result-preview ${ran ? "ready" : ""}`}>
              {ran ? <><span className="result-label">E102</span><strong>Verified output</strong><em>Server evaluator will calculate the actual cell value here.</em></> : <><span className="empty-icon">＋</span><strong>Run your formula</strong><em>The execution result will appear in this panel.</em></>}
            </div>
          </div>
        </div>
      </section>

      <section className="dataset-card">
        <div className="dataset-head"><div><div className="eyebrow">REFERENCE DATA</div><h2>Practice table</h2></div><span>A2:D10 · 9 records</span></div>
        <div className="table-wrap"><table><thead><tr><th>Employee ID</th><th>Name</th><th>Department</th><th>Sales</th></tr></thead><tbody>{[["E100","Aarav","Finance","₹82,400"],["E101","Sara","Sales","₹91,200"],["E102","Humza","Analytics","₹114,800"],["E103","Zoya","Sales","₹76,300"],["E104","Arman","Finance","₹88,700"]].map((row) => <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
      </section>

      <section className="challenge-strip"><span>CHALLENGE</span><strong>Change the formula so E102 returns the Sales value from column 4.</strong><small>Later: backend execution, hidden tests, hints and automatic feedback.</small></section>

      <style jsx>{`
        .workspace-card, .dataset-card, .challenge-strip { margin-top: 28px; border: 1px solid rgba(255,255,255,.075); background: rgba(13,16,23,.86); border-radius: 18px; overflow: hidden; }
        .workspace-toolbar { height: 58px; display: flex; align-items: center; justify-content: space-between; padding: 0 18px; border-bottom: 1px solid rgba(255,255,255,.07); color: #b7c0ce; font-size: 12px; }
        .live-dot { display: inline-block; width: 7px; height: 7px; margin-right: 8px; border-radius: 50%; background: #53d9bb; box-shadow: 0 0 13px rgba(83,217,187,.7); }
        .toolbar-actions { display: flex; gap: 6px; } .toolbar-actions button { border: 1px solid rgba(255,255,255,.07); border-radius: 8px; background: #10141c; color: #8993a2; padding: 8px 10px; font-size: 10px; } .toolbar-actions .run { border-color: rgba(75,99,255,.4); background: #2437d8; color: #fff; }
        .playground-grid { display: grid; grid-template-columns: 1fr 1fr; min-height: 370px; } .editor-pane, .result-pane { padding: 20px; } .result-pane { border-left: 1px solid rgba(255,255,255,.07); }
        .pane-label { color: #5f6a7b; font-size: 9px; font-weight: 800; letter-spacing: .15em; margin-bottom: 10px; }
        .editor { display: grid; grid-template-columns: 42px 1fr; min-height: 270px; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: #080b10; overflow: hidden; }
        .line-numbers { padding: 17px 0; text-align: center; color: #384150; font: 12px/1.85 ui-monospace, SFMono-Regular, Menlo, monospace; border-right: 1px solid rgba(255,255,255,.05); }
        textarea { width: 100%; height: 100%; min-height: 270px; resize: none; padding: 17px; border: 0; outline: 0; background: transparent; color: #d9e3f3; font: 13px/1.85 ui-monospace, SFMono-Regular, Menlo, monospace; }
        .editor-hint { color: #586272; margin-top: 10px; font-size: 10px; }
        .result-preview { min-height: 270px; display: grid; place-items: center; align-content: center; gap: 8px; border: 1px dashed rgba(255,255,255,.08); border-radius: 12px; color: #657081; text-align: center; padding: 20px; } .result-preview.ready { border-style: solid; border-color: rgba(79,105,255,.3); background: rgba(60,80,255,.06); }
        .empty-icon { display: grid; place-items: center; width: 42px; height: 42px; border-radius: 12px; background: #111621; color: #667183; font-size: 20px; } .result-preview strong { color: #aeb7c6; font-size: 14px; } .result-preview em { max-width: 310px; font-style: normal; font-size: 10px; line-height: 1.5; }
        .result-label { padding: 7px 10px; border-radius: 7px; background: #132016; color: #61ddb9; font: 11px ui-monospace, monospace; }
        .dataset-card { padding: 21px; } .dataset-head { display: flex; justify-content: space-between; align-items: flex-end; } .dataset-head h2 { margin: 7px 0 0; font-size: 21px; } .dataset-head > span { color: #626d7d; font-size: 10px; }
        .table-wrap { margin-top: 17px; overflow-x: auto; border: 1px solid rgba(255,255,255,.06); border-radius: 11px; } table { width: 100%; border-collapse: collapse; min-width: 600px; } th, td { padding: 12px 13px; border-bottom: 1px solid rgba(255,255,255,.05); text-align: left; font-size: 11px; } th { color: #606b7b; font-size: 9px; letter-spacing: .1em; text-transform: uppercase; background: #0c0f15; } td { color: #9ca6b5; } tr:last-child td { border-bottom: 0; }
        .challenge-strip { padding: 17px 20px; display: grid; grid-template-columns: auto 1fr; gap: 5px 15px; } .challenge-strip span { color: #c58aff; font-size: 9px; font-weight: 800; letter-spacing: .13em; grid-row: span 2; padding-top: 3px; } .challenge-strip strong { font-size: 12px; } .challenge-strip small { color: #616c7c; font-size: 10px; }
        @media (max-width: 760px) { .playground-grid { grid-template-columns: 1fr; } .result-pane { border-left: 0; border-top: 1px solid rgba(255,255,255,.07); } }
      `}</style>
    </LearningModeShell>
  );
}
