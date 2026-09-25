"use client";

import { useState } from "react";
import LearningModeShell from "../../../components/learning/LearningModeShell";

const questions = [
  { id: 1, type: "single", question: "Which argument tells VLOOKUP to use an exact match?", options: ["TRUE", "FALSE", "1", "EXACT"], answer: 1 },
  { id: 2, type: "single", question: "Where must the lookup value appear in a traditional VLOOKUP table?", options: ["Any column", "The last column", "The first column of the table array", "The header row only"], answer: 2 },
  { id: 3, type: "multi", question: "Which are common reasons to prefer XLOOKUP in newer Excel versions?", options: ["It can look left", "It supports a not-found result", "It requires sorted data", "It is more flexible about return ranges"], answer: 0 },
  { id: 4, type: "single", question: "What does the column index number represent?", options: ["The worksheet number", "The return column position inside the table array", "The row containing the match", "The number of records"], answer: 1 },
  { id: 5, type: "single", question: "Which pattern can make a lookup output safer for end users?", options: ["IFERROR + lookup", "SUM + lookup", "COUNT + lookup", "ROUND + lookup"], answer: 0 },
];

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const question = questions[current];

  function choose(index: number) {
    if (score !== null) return;
    setSelected(index);
  }

  function next() {
    if (selected === null) return;
    if (current === questions.length - 1) {
      const points = questions.reduce((total, item, index) => total + (index === current ? (selected === item.answer ? 1 : 0) : 0), 0);
      setScore(points);
      return;
    }
    setCurrent((value) => value + 1);
    setSelected(null);
  }

  function reset() {
    setCurrent(0);
    setSelected(null);
    setScore(null);
  }

  return (
    <LearningModeShell
      active="quiz"
      eyebrow="03 / KNOWLEDGE CHECK"
      title="Prove you understand it."
      description="A structured quiz surface for recall, application and scenario questions. The current interaction is frontend-only so the assessment engine can be connected without redesigning the experience."
    >
      {score === null ? (
        <section className="quiz-card">
          <div className="quiz-top"><span>QUESTION {String(current + 1).padStart(2, "0")} / {questions.length}</span><span>{question.type === "multi" ? "MULTI-SELECT" : "SINGLE CHOICE"}</span></div>
          <div className="quiz-progress"><span style={{ width: `${((current + 1) / questions.length) * 100}%` }} /></div>
          <h2>{question.question}</h2>
          <div className="options">
            {question.options.map((option, index) => (
              <button key={option} type="button" onClick={() => choose(index)} className={`option ${selected === index ? "selected" : ""}`}>
                <span>{String.fromCharCode(65 + index)}</span><strong>{option}</strong>
                {selected === index && <i>✓</i>}
              </button>
            ))}
          </div>
          <div className="quiz-actions">
            <p>Answer selection is currently local UI state. The backend will own scoring, attempts and persistence.</p>
            <button type="button" className="next-button" onClick={next} disabled={selected === null}>{current === questions.length - 1 ? "Finish quiz" : "Next question"} →</button>
          </div>
        </section>
      ) : (
        <section className="score-card">
          <div className="score-ring"><span>{score * 20}<small>%</small></span></div>
          <div>
            <div className="eyebrow">QUIZ COMPLETE</div>
            <h2>Assessment surface is ready.</h2>
            <p>The UI is prepared for server-backed question banks, scoring, explanations, attempts and mastery updates.</p>
            <button type="button" className="next-button" onClick={reset}>Retake quiz →</button>
          </div>
        </section>
      )}

      <section className="quiz-features">
        <article><span>01</span><strong>Adaptive question bank</strong><p>Backend can select questions based on prior attempts and mastery.</p></article>
        <article><span>02</span><strong>Explanations</strong><p>Every answer can return a concept explanation instead of only right or wrong.</p></article>
        <article><span>03</span><strong>Mastery</strong><p>Results can update learner progress across the course graph.</p></article>
      </section>

      <style jsx>{`
        .quiz-card, .score-card, .quiz-features article { margin-top: 28px; border: 1px solid rgba(255,255,255,.075); background: rgba(13,16,23,.86); border-radius: 18px; }
        .quiz-card { padding: 28px; }
        .quiz-top { display: flex; justify-content: space-between; color: #687383; font-size: 10px; font-weight: 800; letter-spacing: .13em; }
        .quiz-progress { height: 4px; margin: 15px 0 34px; border-radius: 99px; background: #181c24; overflow: hidden; }
        .quiz-progress span { display: block; height: 100%; border-radius: inherit; background: #5575ff; transition: width .2s ease; }
        .quiz-card h2 { max-width: 780px; margin: 0 0 24px; font-size: clamp(25px, 4vw, 39px); line-height: 1.1; letter-spacing: -.035em; }
        .options { display: grid; gap: 9px; max-width: 850px; }
        .option { display: grid; grid-template-columns: 38px 1fr 20px; align-items: center; gap: 12px; text-align: left; padding: 15px; border: 1px solid rgba(255,255,255,.07); border-radius: 12px; background: #0a0d13; color: #aab3c2; }
        .option:hover { border-color: rgba(90,118,255,.35); } .option.selected { border-color: rgba(88,116,255,.7); background: rgba(65,84,255,.1); color: #f1f5ff; }
        .option > span { display: grid; place-items: center; width: 29px; height: 29px; border-radius: 8px; background: #171c27; color: #6e7889; font-size: 11px; font-weight: 800; }
        .option strong { font-size: 13px; font-weight: 600; } .option i { color: #5fe1c0; font-style: normal; }
        .quiz-actions { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-top: 27px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,.06); }
        .quiz-actions p { max-width: 620px; margin: 0; color: #626d7c; font-size: 11px; line-height: 1.5; }
        .next-button { border: 0; border-radius: 10px; padding: 12px 17px; background: #2437d8; color: white; font-weight: 700; font-size: 12px; white-space: nowrap; } .next-button:disabled { opacity: .35; cursor: not-allowed; }
        .score-card { display: flex; align-items: center; gap: 30px; padding: 34px; }
        .score-ring { display: grid; place-items: center; flex: 0 0 145px; height: 145px; border: 1px solid rgba(79,103,255,.4); border-radius: 50%; background: radial-gradient(circle, rgba(66,86,255,.14), transparent 65%); }
        .score-ring span { font-size: 34px; font-weight: 800; } .score-ring small { font-size: 13px; color: #727d8d; }
        .score-card h2 { margin: 7px 0; font-size: 26px; } .score-card p { color: #7f8998; line-height: 1.6; font-size: 13px; max-width: 600px; }
        .quiz-features { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-top: 14px; } .quiz-features article { padding: 19px; } .quiz-features span { color: #5f9cff; font-size: 10px; font-weight: 800; } .quiz-features strong { display: block; margin-top: 9px; font-size: 14px; } .quiz-features p { color: #687383; font-size: 11px; line-height: 1.55; }
        @media (max-width: 720px) { .quiz-actions, .score-card { display: block; } .next-button { margin-top: 16px; } .quiz-features { grid-template-columns: 1fr; } .score-ring { margin-bottom: 20px; } }
      `}</style>
    </LearningModeShell>
  );
}
