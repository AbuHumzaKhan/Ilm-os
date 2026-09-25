"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Lesson = { id: string; concept_id: string; title: string; objective: string; content: string };
type Exercise = { id: string; prompt: string };
type LearningSession = { skill_id: string; topic_id: string; concept_id: string; lesson: Lesson; exercise: Exercise };
type AttemptResult = {
  attempt: { exercise_id: string; learner_id: string; answer: string; correct: boolean };
  progress: { learner_id: string; lesson_id: string; status: "not_started" | "in_progress" | "completed" };
};
type RelatedTopic = { id: string; title: string; description: string; level: "Foundation" | "Core" | "Advanced"; relation: string };

const API_URL = "http://127.0.0.1:8000";
const LEARNER_ID = "local-learner";

const RELATED_TOPICS: Record<string, RelatedTopic[]> = {
  vlookup: [
    { id: "hlookup", title: "HLOOKUP", description: "Learn horizontal lookup when the reference table is organized by rows.", level: "Foundation", relation: "Lookup family" },
    { id: "xlookup", title: "XLOOKUP", description: "Move from classic VLOOKUP patterns to the more flexible modern lookup function.", level: "Core", relation: "Modern alternative" },
    { id: "index-match", title: "INDEX + MATCH", description: "Build flexible lookup solutions by separating position finding from value retrieval.", level: "Core", relation: "Alternative pattern" },
    { id: "match", title: "MATCH", description: "Understand how Excel finds the position of a value inside a range.", level: "Foundation", relation: "Supporting concept" },
    { id: "lookup", title: "LOOKUP", description: "Explore the classic LOOKUP function and where it fits in the lookup family.", level: "Core", relation: "Related function" },
    { id: "iferror-lookup", title: "IFERROR + Lookup", description: "Make lookup formulas safer by handling missing matches and user-facing errors.", level: "Advanced", relation: "Practical extension" },
  ],
};

const learningModes = [
  { href: "/learn", label: "Lesson", number: "01" },
  { href: "/learn/video", label: "Video", number: "02" },
  { href: "/learn/quiz", label: "Quiz", number: "03" },
  { href: "/learn/playground", label: "Playground", number: "04" },
  { href: "/learn/business", label: "Business questions", number: "05" },
  { href: "/learn/resources", label: "Resources", number: "06" },
];

export default function LearnPage() {
  const [message, setMessage] = useState("Teach me VLOOKUP");
  const [answer, setAnswer] = useState("");
  const [session, setSession] = useState<LearningSession | null>(null);
  const [attempt, setAttempt] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relatedTopics = useMemo(() => (session ? RELATED_TOPICS[session.concept_id] ?? [] : []), [session]);

  async function startLearning(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || loading) return;
    setLoading(true); setError(null); setAttempt(null); setAnswer("");
    try {
      const response = await fetch(`${API_URL}/api/learning/start`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ learner_id: LEARNER_ID, message: message.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to start the lesson.");
      setSession(data as LearningSession);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to connect to the learning API.");
    } finally { setLoading(false); }
  }

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !answer.trim() || submitting) return;
    setSubmitting(true); setError(null);
    try {
      const response = await fetch(`${API_URL}/api/learning/attempt`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ learner_id: LEARNER_ID, exercise_id: session.exercise.id, answer: answer.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(typeof data.detail === "string" ? data.detail : "Unable to submit the answer.");
      setAttempt(data as AttemptResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit the answer.");
    } finally { setSubmitting(false); }
  }

  function resetLesson() { setSession(null); setAttempt(null); setAnswer(""); setError(null); }
  function inspectTopic(topic: RelatedTopic) { setMessage(`Teach me ${topic.title}`); setError(null); window.scrollTo({ top: 0, behavior: "smooth" }); }

  const completed = attempt?.progress.status === "completed";
  const submitted = Boolean(attempt);

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" /><div className="ambient ambient-two" />
      <header className="topbar">
        <Link href="/learn" className="brand"><div className="brand-mark">i</div><div><strong>Ilm-os</strong><span>Learning OS</span></div></Link>
        <div className="status-pill"><span className="status-dot" /> Local learning environment</div>
      </header>

      <section className="hero">
        <div className="eyebrow">PERSONAL LEARNING WORKSPACE</div>
        <h1>Learn with context.<br /><span>Practice with purpose.</span></h1>
        <p className="hero-copy">Search for one concept and Ilm-os surfaces the connected skills, learning modes and resources around it, so one question can become a complete learning path.</p>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="panel-label">COURSE</div>
          <div className="course-card"><div className="course-icon">⌘</div><div><strong>Excel Lookup Mastery</strong><span>{session ? session.lesson.title : "Start with a concept"}</span></div></div>

          <div className="panel-label progress-label">PROGRESS</div>
          <div className="progress-card"><div className="progress-ring"><span>{completed ? "100" : session ? "50" : "0"}<small>%</small></span></div><div><strong>{completed ? "Completed" : session ? "In progress" : "Not started"}</strong><span>Lesson → practice → mastery</span></div></div>

          <div className="panel-label modes-label">LEARNING MODES</div>
          <nav className="mode-list">
            {learningModes.map((mode) => <Link key={mode.href} href={mode.href} className={`mode-item ${mode.href === "/learn" ? "active" : ""}`}><span>{mode.number}</span><strong>{mode.label}</strong>{mode.href !== "/learn" && <i>↗</i>}</Link>)}
          </nav>

          <div className="sidebar-note"><span>✓</span><div><strong>Persistent by design</strong><p>Attempts are stored through the PostgreSQL-backed API.</p></div></div>
        </aside>

        <div className="content-column">
          <section className="command-card">
            <div className="card-heading"><div><div className="eyebrow">01 / START</div><h2>What do you want to learn?</h2></div><span className="api-badge">API CONNECTED</span></div>
            <form onSubmit={startLearning} className="command-form"><div className="input-wrap"><span className="input-prefix">›</span><input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Teach me VLOOKUP" aria-label="Learning request" /></div><button className="primary-button" type="submit" disabled={loading}>{loading ? "Starting…" : "Start learning"}{!loading && <span>→</span>}</button></form>
          </section>

          {error && <div className="error-card" role="alert"><span>!</span><div><strong>Request failed</strong><p>{error}</p></div></div>}

          {session && <>
            <section className="lesson-card">
              <div className="section-number">02</div><div className="lesson-main"><div className="eyebrow">LESSON · {session.concept_id.toUpperCase()}</div><h2>{session.lesson.title}</h2><p className="objective"><strong>Objective:</strong> {session.lesson.objective}</p><div className="lesson-content">{session.lesson.content}</div></div>
            </section>

            <section className="mode-strip">
              <div><div className="eyebrow">GO DEEPER</div><h2>Choose how you want to learn.</h2><p>Continue the same concept through video, assessment, hands-on practice, business scenarios or reference material.</p></div>
              <div className="mode-cards">{learningModes.slice(1).map((mode) => <Link href={mode.href} key={mode.href}><span>{mode.number}</span><strong>{mode.label}</strong><i>→</i></Link>)}</div>
            </section>

            <section className="exercise-card">
              <div className="exercise-topline"><div><div className="eyebrow">03 / PRACTICE</div><h2>Apply what you learned</h2></div><span className="exercise-tag">EXERCISE</span></div>
              <div className="prompt-box"><span className="prompt-label">TASK</span><p>{session.exercise.prompt}</p></div>
              <form onSubmit={submitAnswer}><label className="answer-label" htmlFor="answer">Your answer</label><textarea id="answer" value={answer} onChange={(event) => setAnswer(event.target.value)} placeholder={'=VLOOKUP("E102",A2:D10,4,FALSE)'} rows={3} disabled={submitted} /><div className="answer-actions"><span>Answer is evaluated securely by the API.</span>{!submitted ? <button className="primary-button" type="submit" disabled={submitting || !answer.trim()}>{submitting ? "Checking…" : "Submit answer"}{!submitting && <span>→</span>}</button> : <button className="secondary-button" type="button" onClick={resetLesson}>Start another lesson</button>}</div></form>
            </section>

            {attempt && <section className={`result-card ${attempt.attempt.correct ? "success" : "incorrect"}`}><div className="result-icon">{attempt.attempt.correct ? "✓" : "×"}</div><div><div className="eyebrow">RESULT</div><h3>{attempt.attempt.correct ? "Correct answer" : "Not quite"}</h3><p>{attempt.attempt.correct ? "Your answer was verified by the learning service and your progress was persisted." : "Your attempt was saved. Review the lesson and try the exercise again."}</p></div><div className="result-status">{attempt.progress.status.replace("_", " ")}</div></section>}

            {relatedTopics.length > 0 && <section className="related-card">
              <div className="related-heading"><div><div className="eyebrow">LEARNING ECOSYSTEM</div><h2>Explore beyond {session.lesson.title.replace(" Fundamentals", "")}.</h2><p>This discovery layer is intentionally placed <strong>after the lesson and practice flow</strong>, so suggestions never interrupt the main learning sequence.</p></div><span className="suggestion-count">{relatedTopics.length} TOPICS</span></div>
              <div className="topic-grid">{relatedTopics.map((topic) => <article key={topic.id} className="topic-card"><div className="topic-card-top"><span className="topic-relation">{topic.relation}</span><span className={`topic-level ${topic.level.toLowerCase()}`}>{topic.level}</span></div><h3>{topic.title}</h3><p>{topic.description}</p><button type="button" className="topic-link" onClick={() => inspectTopic(topic)}>Explore topic <span>→</span></button></article>)}</div>
              <div className="related-footer">Suggestions are based on the current concept and can become fully data-driven as the learning graph expands.</div>
            </section>}
          </>}
        </div>
      </section>

      <footer className="footer"><span>ILM-OS · PERSISTED LEARNING SLICE</span><span>FastAPI · PostgreSQL · Next.js</span></footer>

      <style jsx>{`
        :global(*){box-sizing:border-box}:global(body){margin:0;background:#080a0f;color:#eef1f7;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}:global(button),:global(input),:global(textarea){font:inherit}:global(button){cursor:pointer}:global(a){text-decoration:none;color:inherit}
        .page-shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 80% 10%,rgba(83,101,255,.13),transparent 30%),radial-gradient(circle at 10% 80%,rgba(28,214,174,.07),transparent 25%),#080a0f}.ambient{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(100px);opacity:.16;pointer-events:none}.ambient-one{top:-300px;right:-150px;background:#5668ff}.ambient-two{bottom:-340px;left:-180px;background:#1dd6ae}
        .topbar,.hero,.workspace,.footer{width:min(1220px,calc(100% - 40px));margin-inline:auto;position:relative;z-index:1}.topbar{display:flex;justify-content:space-between;align-items:center;padding:25px 0;border-bottom:1px solid rgba(255,255,255,.07)}.brand{display:flex;align-items:center;gap:11px}.brand-mark{width:34px;height:34px;display:grid;place-items:center;border-radius:10px;background:#2437d8;font-weight:900}.brand strong,.brand span{display:block}.brand strong{font-size:15px}.brand span:not(.brand-mark){color:#747e8e;font-size:9px;text-transform:uppercase;letter-spacing:.15em}.status-pill{display:flex;align-items:center;gap:8px;color:#8e98a8;font-size:12px}.status-dot{width:7px;height:7px;border-radius:50%;background:#24d5aa;box-shadow:0 0 14px rgba(36,213,170,.7)}
        .hero{padding:70px 0 42px}.eyebrow{color:#5f9cff;font-size:10px;font-weight:800;letter-spacing:.16em}.hero h1{margin:10px 0 14px;font-size:clamp(42px,6vw,72px);line-height:.95;letter-spacing:-.065em}.hero h1 span{color:#aaa295}.hero-copy{max-width:720px;margin:0;color:#8a94a4;font-size:15px;line-height:1.7}
        .workspace{display:grid;grid-template-columns:245px minmax(0,1fr);gap:30px}.sidebar{padding-right:25px;border-right:1px solid rgba(255,255,255,.07)}.panel-label{color:#667080;font-size:9px;font-weight:800;letter-spacing:.14em}.course-card{display:flex;gap:10px;align-items:center;margin-top:11px}.course-icon{width:35px;height:35px;display:grid;place-items:center;border-radius:10px;background:#101828;color:#6fa2ff}.course-card strong,.course-card span{display:block}.course-card strong{font-size:12px}.course-card span{margin-top:3px;color:#677181;font-size:9px}.progress-label{margin-top:32px}.progress-card{display:flex;gap:12px;align-items:center;margin-top:10px}.progress-ring{width:55px;height:55px;display:grid;place-items:center;border:1px solid rgba(71,213,180,.28);border-radius:50%;background:radial-gradient(circle,rgba(39,208,171,.07),transparent 68%)}.progress-ring span{font-size:13px}.progress-ring small{font-size:8px;color:#687383}.progress-card strong,.progress-card span{display:block}.progress-card strong{font-size:12px}.progress-card span{margin-top:4px;color:#626d7c;font-size:9px;line-height:1.4}.modes-label{margin-top:30px}.mode-list{display:grid;gap:4px;margin-top:9px}.mode-item{display:grid;grid-template-columns:28px 1fr 12px;align-items:center;padding:9px;border:1px solid transparent;border-radius:9px;color:#788291}.mode-item span{color:#4f5969;font-size:9px}.mode-item strong{font-size:10px;font-weight:650}.mode-item i{font-style:normal;color:#4f9cff;font-size:10px}.mode-item.active{background:rgba(54,74,235,.1);border-color:rgba(80,101,255,.18);color:#edf2fb}.sidebar-note{display:flex;gap:9px;margin-top:28px;padding-top:20px;border-top:1px solid rgba(255,255,255,.06)}.sidebar-note>span{color:#55d8b9}.sidebar-note strong{font-size:10px}.sidebar-note p{margin:4px 0 0;color:#5e6877;font-size:9px;line-height:1.5}
        .content-column{min-width:0}.command-card,.lesson-card,.mode-strip,.exercise-card,.result-card,.related-card{border:1px solid rgba(255,255,255,.075);background:rgba(13,16,23,.82);border-radius:17px}.command-card{padding:25px}.card-heading{display:flex;justify-content:space-between;gap:20px;align-items:flex-start}.card-heading h2{margin:7px 0 0;font-size:25px;letter-spacing:-.03em}.api-badge,.exercise-tag,.suggestion-count{border:1px solid rgba(79,224,190,.18);border-radius:7px;padding:7px 9px;color:#5cdbba;font-size:8px;font-weight:800;letter-spacing:.09em}.command-form{display:grid;grid-template-columns:1fr auto;gap:10px;margin-top:20px}.input-wrap{display:flex;align-items:center;border:1px solid rgba(255,255,255,.07);border-radius:11px;background:#090c12}.input-prefix{padding-left:14px;color:#5f8cff;font-size:20px}.input-wrap input{width:100%;border:0;outline:0;background:transparent;color:#dce3ef;padding:13px 14px;font-size:13px}.primary-button,.secondary-button{border:0;border-radius:10px;padding:12px 16px;font-size:11px;font-weight:700}.primary-button{background:#2437d8;color:#fff}.primary-button:disabled{opacity:.35;cursor:not-allowed}.primary-button span{margin-left:14px}.secondary-button{background:#161b25;color:#aeb7c5;border:1px solid rgba(255,255,255,.08)}.error-card{display:flex;gap:10px;margin-top:12px;padding:14px;border:1px solid rgba(255,92,92,.2);border-radius:12px;background:rgba(255,70,70,.05)}.error-card>span{color:#ff7777}.error-card strong{font-size:11px}.error-card p{margin:4px 0 0;color:#8e6870;font-size:10px}
        .lesson-card{display:grid;grid-template-columns:52px 1fr;gap:5px;margin-top:15px;padding:27px}.section-number{color:#4f9cff;font-size:12px;font-weight:800}.lesson-main h2{margin:7px 0 10px;font-size:31px;letter-spacing:-.04em}.objective{margin:0;color:#a6afbd;font-size:13px;line-height:1.6}.objective strong{color:#e0e6ef}.lesson-content{margin-top:18px;padding:17px 18px;border-left:2px solid #334cff;background:#090d16;color:#929cac;font-size:12px;line-height:1.7}
        .mode-strip{display:grid;grid-template-columns:1fr 1.6fr;gap:22px;margin-top:15px;padding:22px}.mode-strip h2{margin:7px 0 7px;font-size:20px;letter-spacing:-.03em}.mode-strip p{margin:0;color:#697484;font-size:10px;line-height:1.55}.mode-cards{display:grid;grid-template-columns:repeat(5,1fr);gap:6px}.mode-cards a{display:flex;flex-direction:column;justify-content:space-between;min-height:96px;padding:11px;border:1px solid rgba(255,255,255,.06);border-radius:10px;background:#0a0d13}.mode-cards a:hover{border-color:rgba(84,110,255,.35);background:#0d1120}.mode-cards span{color:#4e5a6c;font-size:8px}.mode-cards strong{font-size:10px;line-height:1.3}.mode-cards i{align-self:flex-end;color:#5e9eff;font-style:normal}
        .exercise-card{margin-top:15px;padding:27px}.exercise-topline{display:flex;justify-content:space-between;align-items:flex-start}.exercise-card h2{margin:7px 0 0;font-size:25px}.exercise-tag{color:#6c9eff;border-color:rgba(93,135,255,.2)}.prompt-box{margin-top:20px;padding:17px;border:1px solid rgba(255,255,255,.05);border-radius:11px;background:#0a0d12}.prompt-label{color:#5e6877;font-size:8px;font-weight:800;letter-spacing:.13em}.prompt-box p{margin:9px 0 0;color:#aab3c0;font-size:12px;line-height:1.5}.answer-label{display:block;margin:17px 0 7px;color:#737e8e;font-size:9px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.exercise-card textarea{width:100%;resize:vertical;min-height:100px;border:1px solid rgba(255,255,255,.07);border-radius:11px;outline:0;background:#090c12;color:#dce3ef;padding:14px;font:12px/1.6 ui-monospace,SFMono-Regular,Menlo,monospace}.answer-actions{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-top:10px}.answer-actions>span{color:#596474;font-size:9px}
        .result-card{display:grid;grid-template-columns:45px 1fr auto;gap:14px;align-items:center;margin-top:15px;padding:19px}.result-icon{width:38px;height:38px;display:grid;place-items:center;border-radius:11px;background:#10231f;color:#5be1bf}.result-card.incorrect .result-icon{background:#271718;color:#ff7b7b}.result-card h3{margin:5px 0 3px;font-size:15px}.result-card p{margin:0;color:#697484;font-size:10px;line-height:1.5}.result-status{color:#62d9bd;font-size:8px;font-weight:800;text-transform:uppercase}.result-card.incorrect .result-status{color:#ff8585}
        .related-card{margin-top:15px;padding:25px}.related-heading{display:flex;justify-content:space-between;gap:20px}.related-heading h2{margin:7px 0 6px;font-size:23px;letter-spacing:-.035em}.related-heading p{max-width:700px;margin:0;color:#6e7888;font-size:10px;line-height:1.6}.suggestion-count{color:#7d9cff;border-color:rgba(92,123,255,.2);white-space:nowrap}.topic-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin-top:19px}.topic-card{padding:16px;border:1px solid rgba(255,255,255,.06);border-radius:12px;background:#0a0d13}.topic-card-top{display:flex;justify-content:space-between;gap:8px}.topic-relation{color:#646e7d;font-size:8px;text-transform:uppercase;letter-spacing:.1em}.topic-level{padding:4px 6px;border-radius:5px;background:#111721;color:#62a0ff;font-size:7px;font-weight:800;text-transform:uppercase}.topic-level.foundation{color:#59d7b7}.topic-level.advanced{color:#c48aff}.topic-card h3{margin:12px 0 6px;font-size:15px}.topic-card p{min-height:45px;margin:0;color:#687383;font-size:10px;line-height:1.55}.topic-link{margin-top:12px;padding:0;border:0;background:transparent;color:#6aa2ff;font-size:9px;font-weight:700}.topic-link span{margin-left:8px}.related-footer{margin-top:15px;padding-top:13px;border-top:1px solid rgba(255,255,255,.05);color:#535e6e;font-size:9px}.footer{display:flex;justify-content:space-between;padding:22px 0 30px;color:#505a69;font-size:8px;letter-spacing:.13em}
        @media(max-width:1050px){.workspace{grid-template-columns:210px 1fr}.mode-strip{grid-template-columns:1fr}.mode-cards{grid-template-columns:repeat(3,1fr)}}@media(max-width:760px){.topbar,.hero,.workspace,.footer{width:calc(100% - 28px)}.workspace{grid-template-columns:1fr}.sidebar{padding:0 0 20px;border-right:0;border-bottom:1px solid rgba(255,255,255,.07)}.mode-list{grid-template-columns:repeat(3,1fr)}.sidebar-note{display:none}.command-form{grid-template-columns:1fr}.topic-grid{grid-template-columns:1fr}.result-card{grid-template-columns:38px 1fr}.result-status{grid-column:2}.footer{display:block;line-height:1.8}}@media(max-width:520px){.mode-list{grid-template-columns:repeat(2,1fr)}.mode-cards{grid-template-columns:repeat(2,1fr)}.hero{padding-top:45px}.lesson-card{grid-template-columns:1fr}.section-number{display:none}.related-heading{display:block}.suggestion-count{display:inline-block;margin-top:10px}.answer-actions{display:block}.answer-actions .primary-button,.answer-actions .secondary-button{margin-top:10px}}
      `}</style>
    </main>
  );
}
