"use client";

import { FormEvent, useMemo, useState } from "react";

type Lesson = {
  id: string;
  concept_id: string;
  title: string;
  objective: string;
  content: string;
};

type Exercise = {
  id: string;
  prompt: string;
};

type LearningSession = {
  skill_id: string;
  topic_id: string;
  concept_id: string;
  lesson: Lesson;
  exercise: Exercise;
};

type AttemptResult = {
  attempt: {
    exercise_id: string;
    learner_id: string;
    answer: string;
    correct: boolean;
  };
  progress: {
    learner_id: string;
    lesson_id: string;
    status: "not_started" | "in_progress" | "completed";
  };
};

type RelatedTopic = {
  id: string;
  title: string;
  description: string;
  level: "Foundation" | "Core" | "Advanced";
  relation: string;
};

const API_URL = "http://127.0.0.1:8000";
const LEARNER_ID = "local-learner";

const RELATED_TOPICS: Record<string, RelatedTopic[]> = {
  vlookup: [
    {
      id: "hlookup",
      title: "HLOOKUP",
      description: "Learn horizontal lookup when your reference table is organized by rows.",
      level: "Foundation",
      relation: "Lookup family",
    },
    {
      id: "xlookup",
      title: "XLOOKUP",
      description: "Move from classic VLOOKUP patterns to the more flexible modern lookup function.",
      level: "Core",
      relation: "Modern alternative",
    },
    {
      id: "index-match",
      title: "INDEX + MATCH",
      description: "Build flexible lookup solutions by separating position finding from value retrieval.",
      level: "Core",
      relation: "Alternative pattern",
    },
    {
      id: "match",
      title: "MATCH",
      description: "Understand how Excel finds the position of a value inside a range.",
      level: "Foundation",
      relation: "Supporting concept",
    },
    {
      id: "lookup",
      title: "LOOKUP",
      description: "Explore the classic LOOKUP function and where it fits in the lookup family.",
      level: "Core",
      relation: "Related function",
    },
    {
      id: "iferror-lookup",
      title: "IFERROR + Lookup",
      description: "Make lookup formulas safer by handling missing matches and user-facing errors.",
      level: "Advanced",
      relation: "Practical extension",
    },
  ],
};

export default function LearnPage() {
  const [message, setMessage] = useState("Teach me VLOOKUP");
  const [answer, setAnswer] = useState("");
  const [session, setSession] = useState<LearningSession | null>(null);
  const [attempt, setAttempt] = useState<AttemptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const relatedTopics = useMemo(
    () => (session ? RELATED_TOPICS[session.concept_id] ?? [] : []),
    [session],
  );

  async function startLearning(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!message.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAttempt(null);
    setAnswer("");

    try {
      const response = await fetch(`${API_URL}/api/learning/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learner_id: LEARNER_ID, message: message.trim() }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Unable to start the lesson.");
      }

      setSession(data as LearningSession);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to connect to the learning API.");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session || !answer.trim() || submitting) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/learning/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          learner_id: LEARNER_ID,
          exercise_id: session.exercise.id,
          answer: answer.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(typeof data.detail === "string" ? data.detail : "Unable to submit the answer.");
      }

      setAttempt(data as AttemptResult);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit the answer.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetLesson() {
    setSession(null);
    setAttempt(null);
    setAnswer("");
    setError(null);
  }

  function inspectTopic(topic: RelatedTopic) {
    setMessage(`Teach me ${topic.title}`);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const completed = attempt?.progress.status === "completed";
  const submitted = Boolean(attempt);

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">i</div>
          <div>
            <strong>Ilm-os</strong>
            <span>Learning OS</span>
          </div>
        </div>
        <div className="status-pill">
          <span className="status-dot" />
          Local learning environment
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">PERSONAL LEARNING WORKSPACE</div>
        <h1>Learn with context.<br /><span>Practice with purpose.</span></h1>
        <p className="hero-copy">
          Search for one concept and Ilm-os can surface the connected skills around it,
          so a single question can become a complete learning path.
        </p>
      </section>

      <section className="workspace">
        <aside className="sidebar">
          <div className="panel-label">SESSION</div>
          <div className="session-card">
            <div className="session-icon">⌘</div>
            <div>
              <strong>{session ? session.lesson.title : "No active lesson"}</strong>
              <span>{session ? "Learning session active" : "Start a lesson below"}</span>
            </div>
          </div>

          <div className="panel-label progress-label">PROGRESS</div>
          <div className="progress-card">
            <div className="progress-ring">
              <span>{completed ? "100" : session ? "50" : "0"}<small>%</small></span>
            </div>
            <div>
              <strong>{completed ? "Completed" : session ? "In progress" : "Not started"}</strong>
              <span>{completed ? "Exercise submitted successfully" : "Lesson → exercise → progress"}</span>
            </div>
          </div>

          {session && relatedTopics.length > 0 && (
            <div className="sidebar-topics">
              <div className="panel-label">SUGGESTED PATH</div>
              <div className="topic-mini-list">
                {relatedTopics.slice(0, 4).map((topic, index) => (
                  <button key={topic.id} type="button" onClick={() => inspectTopic(topic)} className="topic-mini">
                    <span className="topic-mini-number">0{index + 1}</span>
                    <span>
                      <strong>{topic.title}</strong>
                      <small>{topic.relation}</small>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="sidebar-note">
            <span className="note-icon">✓</span>
            <div>
              <strong>Persistent by design</strong>
              <p>Your learning attempts are stored in PostgreSQL through the API.</p>
            </div>
          </div>
        </aside>

        <div className="content-column">
          <section className="command-card">
            <div className="card-heading">
              <div>
                <div className="eyebrow">01 / START</div>
                <h2>What do you want to learn?</h2>
              </div>
              <span className="api-badge">API CONNECTED</span>
            </div>

            <form onSubmit={startLearning} className="command-form">
              <div className="input-wrap">
                <span className="input-prefix">›</span>
                <input
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Teach me VLOOKUP"
                  aria-label="Learning request"
                />
              </div>
              <button className="primary-button" type="submit" disabled={loading}>
                {loading ? "Starting…" : "Start learning"}
                {!loading && <span>→</span>}
              </button>
            </form>
          </section>

          {error && (
            <div className="error-card" role="alert">
              <span>!</span>
              <div>
                <strong>Request failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          {session && (
            <>
              <section className="lesson-card">
                <div className="section-number">02</div>
                <div className="lesson-main">
                  <div className="eyebrow">LESSON · {session.concept_id.toUpperCase()}</div>
                  <h2>{session.lesson.title}</h2>
                  <p className="objective"><strong>Objective:</strong> {session.lesson.objective}</p>
                  <div className="lesson-content">{session.lesson.content}</div>
                </div>
              </section>

              {relatedTopics.length > 0 && (
                <section className="related-card">
                  <div className="related-heading">
                    <div>
                      <div className="eyebrow">LEARNING ECOSYSTEM</div>
                      <h2>Continue beyond {session.lesson.title.replace(" Fundamentals", "")}</h2>
                      <p>
                        You searched for <strong>{session.lesson.title.replace(" Fundamentals", "")}</strong>.
                        These connected topics are suggested next so you can explore the surrounding skill tree.
                      </p>
                    </div>
                    <span className="suggestion-count">{relatedTopics.length} TOPICS</span>
                  </div>

                  <div className="topic-grid">
                    {relatedTopics.map((topic) => (
                      <article key={topic.id} className="topic-card">
                        <div className="topic-card-top">
                          <span className="topic-relation">{topic.relation}</span>
                          <span className={`topic-level ${topic.level.toLowerCase()}`}>{topic.level}</span>
                        </div>
                        <h3>{topic.title}</h3>
                        <p>{topic.description}</p>
                        <button type="button" className="topic-link" onClick={() => inspectTopic(topic)}>
                          Explore topic <span>→</span>
                        </button>
                      </article>
                    ))}
                  </div>

                  <div className="related-footer">
                    <span>Suggestions are based on the current concept and will become fully data-driven as the learning graph expands.</span>
                  </div>
                </section>
              )}

              <section className="exercise-card">
                <div className="exercise-topline">
                  <div>
                    <div className="eyebrow">03 / PRACTICE</div>
                    <h2>Apply what you learned</h2>
                  </div>
                  <span className="exercise-tag">EXERCISE</span>
                </div>

                <div className="prompt-box">
                  <span className="prompt-label">TASK</span>
                  <p>{session.exercise.prompt}</p>
                </div>

                <form onSubmit={submitAnswer}>
                  <label className="answer-label" htmlFor="answer">Your answer</label>
                  <textarea
                    id="answer"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    placeholder={'=VLOOKUP("E102",A2:D10,4,FALSE)'}
                    rows={3}
                    disabled={submitted}
                  />
                  <div className="answer-actions">
                    <span>Answer is evaluated securely by the API.</span>
                    {!submitted ? (
                      <button className="primary-button" type="submit" disabled={submitting || !answer.trim()}>
                        {submitting ? "Checking…" : "Submit answer"}
                        {!submitting && <span>→</span>}
                      </button>
                    ) : (
                      <button className="secondary-button" type="button" onClick={resetLesson}>
                        Start another lesson
                      </button>
                    )}
                  </div>
                </form>
              </section>

              {attempt && (
                <section className={`result-card ${attempt.attempt.correct ? "success" : "incorrect"}`}>
                  <div className="result-icon">{attempt.attempt.correct ? "✓" : "×"}</div>
                  <div>
                    <div className="eyebrow">RESULT</div>
                    <h3>{attempt.attempt.correct ? "Correct answer" : "Not quite"}</h3>
                    <p>
                      {attempt.attempt.correct
                        ? "Your answer was verified by the learning service and your progress was persisted."
                        : "Your attempt was saved. Review the lesson and try the exercise again."}
                    </p>
                  </div>
                  <div className="result-status">{attempt.progress.status.replace("_", " ")}</div>
                </section>
              )}
            </>
          )}
        </div>
      </section>

      <footer className="footer">
        <span>ILM-OS · PERSISTED LEARNING SLICE</span>
        <span>FastAPI · PostgreSQL · Next.js</span>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #080a0f; color: #eef1f7; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(button), :global(input), :global(textarea) { font: inherit; }
        :global(button) { cursor: pointer; }
        .page-shell { min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at 80% 10%, rgba(83, 101, 255, .13), transparent 30%), radial-gradient(circle at 10% 80%, rgba(28, 214, 174, .07), transparent 25%), #080a0f; }
        .ambient { position: absolute; width: 520px; height: 520px; border-radius: 50%; filter: blur(100px); opacity: .16; pointer-events: none; }
        .ambient-one { top: -300px; right: -150px; background: #5668ff; }
        .ambient-two { bottom: -340px; left: -180px; background: #1dd6ae; }
        .topbar, .hero, .workspace, .footer { width: min(1180px, calc(100% - 40px)); margin-inline: auto; position: relative; z-index: 1; }
        .topbar { display: flex; justify-content: space-between; align-items: center; padding: 28px 0; border-bottom: 1px solid rgba(255,255,255,.07); }
        .brand { display: flex; align-items: center; gap: 11px; }
        .brand-mark { width: 34px; height: 34px; display: grid; place-items: center; border-radius: 10px; background: linear-gradient(145deg, #6e7cff, #4c5ae7); box-shadow: 0 8px 25px rgba(79,91,230,.3); font-weight: 800; font-size: 19px; }
        .brand strong, .brand span { display: block; }
        .brand strong { font-size: 15px; letter-spacing: .02em; }
        .brand span { margin-top: 2px; color: #777f91; font-size: 10px; text-transform: uppercase; letter-spacing: .13em; }
        .status-pill { display: flex; align-items: center; gap: 8px; color: #8f97a8; font-size: 11px; letter-spacing: .04em; }
        .status-dot { width: 7px; height: 7px; border-radius: 50%; background: #35d9a8; box-shadow: 0 0 14px #35d9a8; }
        .hero { padding: 72px 0 48px; }
        .eyebrow { color: #6875ff; font-size: 10px; font-weight: 800; letter-spacing: .16em; }
        .hero h1 { margin: 12px 0 16px; max-width: 760px; font-size: clamp(42px, 6vw, 72px); line-height: .98; letter-spacing: -.055em; }
        .hero h1 span { color: #7f8798; }
        .hero-copy { max-width: 680px; margin: 0; color: #8f97a8; line-height: 1.7; font-size: 15px; }
        .workspace { display: grid; grid-template-columns: 275px minmax(0, 1fr); gap: 22px; align-items: start; }
        .sidebar, .command-card, .lesson-card, .exercise-card, .result-card, .error-card, .related-card { border: 1px solid rgba(255,255,255,.075); background: rgba(16,19,27,.78); backdrop-filter: blur(20px); box-shadow: 0 24px 80px rgba(0,0,0,.22); }
        .sidebar { padding: 20px; border-radius: 18px; position: sticky; top: 20px; }
        .panel-label { color: #555d6d; font-size: 9px; font-weight: 800; letter-spacing: .17em; }
        .session-card, .progress-card { display: flex; align-items: center; gap: 12px; padding: 14px 0; }
        .session-icon { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid rgba(112,125,255,.25); border-radius: 10px; background: rgba(95,108,255,.1); color: #7b87ff; }
        .session-card strong, .progress-card strong { display: block; font-size: 12px; }
        .session-card span, .progress-card span { display: block; margin-top: 4px; color: #666e7d; font-size: 10px; line-height: 1.4; }
        .progress-label { margin-top: 22px; }
        .progress-card { border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); padding: 17px 0; }
        .progress-ring { width: 48px; height: 48px; flex: 0 0 auto; display: grid; place-items: center; border-radius: 50%; border: 1px solid rgba(94,211,180,.25); background: radial-gradient(circle, rgba(54,213,169,.08), transparent 65%); color: #54d8b1; font-size: 12px; font-weight: 800; }
        .progress-ring small { font-size: 7px; margin-left: 1px; }
        .sidebar-topics { margin-top: 20px; }
        .topic-mini-list { display: grid; gap: 4px; margin-top: 10px; }
        .topic-mini { display: grid; grid-template-columns: 28px 1fr; align-items: center; gap: 7px; width: 100%; padding: 8px 6px; border: 0; border-radius: 9px; color: inherit; background: transparent; text-align: left; }
        .topic-mini:hover { background: rgba(102,115,255,.07); }
        .topic-mini-number { color: #4c5566; font-size: 8px; font-weight: 800; }
        .topic-mini strong, .topic-mini small { display: block; }
        .topic-mini strong { color: #cdd2dd; font-size: 10px; }
        .topic-mini small { margin-top: 2px; color: #5f6878; font-size: 8px; }
        .sidebar-note { display: flex; gap: 10px; margin-top: 18px; padding: 12px; border-radius: 12px; background: rgba(255,255,255,.025); }
        .note-icon { color: #53d8b0; font-size: 12px; }
        .sidebar-note strong { font-size: 10px; }
        .sidebar-note p { margin: 5px 0 0; color: #666e7d; font-size: 9px; line-height: 1.5; }
        .content-column { min-width: 0; display: grid; gap: 16px; }
        .command-card, .lesson-card, .exercise-card, .result-card, .error-card, .related-card { border-radius: 18px; }
        .command-card { padding: 25px; }
        .card-heading, .exercise-topline, .related-heading { display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; }
        h2 { margin: 7px 0 0; font-size: 22px; letter-spacing: -.025em; }
        .api-badge, .exercise-tag, .suggestion-count { padding: 6px 8px; border: 1px solid rgba(83,216,176,.18); border-radius: 6px; color: #53d8b0; background: rgba(83,216,176,.05); font-size: 8px; font-weight: 800; letter-spacing: .12em; white-space: nowrap; }
        .command-form { display: grid; grid-template-columns: 1fr auto; gap: 10px; margin-top: 22px; }
        .input-wrap { display: flex; align-items: center; min-width: 0; border: 1px solid rgba(255,255,255,.09); border-radius: 11px; background: #0b0e14; }
        .input-prefix { padding-left: 14px; color: #6975ff; font-size: 20px; }
        input, textarea { width: 100%; border: 0; outline: 0; color: #eef1f7; background: transparent; }
        input { padding: 13px 14px 13px 9px; font-size: 13px; }
        textarea { resize: vertical; min-height: 88px; padding: 15px; border: 1px solid rgba(255,255,255,.09); border-radius: 11px; background: #0b0e14; line-height: 1.6; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 12px; }
        input::placeholder, textarea::placeholder { color: #4f5665; }
        .primary-button, .secondary-button { border-radius: 10px; padding: 0 17px; border: 1px solid transparent; font-size: 11px; font-weight: 750; transition: .2s ease; }
        .primary-button { display: inline-flex; align-items: center; gap: 13px; color: #fff; background: linear-gradient(135deg, #6673ff, #4e5be5); box-shadow: 0 10px 25px rgba(79,91,230,.2); }
        .primary-button:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.08); }
        .primary-button:disabled { cursor: not-allowed; opacity: .45; }
        .secondary-button { color: #b7bfcd; border-color: rgba(255,255,255,.1); background: #11151d; padding: 10px 14px; }
        .lesson-card { display: grid; grid-template-columns: 52px 1fr; padding: 26px; }
        .section-number { color: #303746; font-size: 24px; font-weight: 800; letter-spacing: -.05em; }
        .lesson-main h2 { font-size: 28px; }
        .objective { margin: 14px 0; color: #b4bbc8; font-size: 13px; line-height: 1.65; }
        .objective strong { color: #eef1f7; }
        .lesson-content { padding: 14px 16px; border-left: 2px solid #5966ee; border-radius: 0 8px 8px 0; background: rgba(89,102,238,.055); color: #818a9b; font-size: 12px; line-height: 1.7; }
        .related-card { padding: 26px; }
        .related-heading h2 { font-size: 24px; }
        .related-heading p { max-width: 680px; margin: 10px 0 0; color: #727b8d; font-size: 11px; line-height: 1.7; }
        .related-heading p strong { color: #cfd4df; }
        .suggestion-count { color: #8791ff; border-color: rgba(104,117,255,.2); background: rgba(104,117,255,.06); }
        .topic-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; margin-top: 22px; }
        .topic-card { min-width: 0; padding: 16px; border: 1px solid rgba(255,255,255,.065); border-radius: 13px; background: rgba(255,255,255,.018); transition: transform .2s ease, border-color .2s ease, background .2s ease; }
        .topic-card:hover { transform: translateY(-2px); border-color: rgba(104,117,255,.22); background: rgba(104,117,255,.035); }
        .topic-card-top { display: flex; justify-content: space-between; align-items: center; gap: 10px; }
        .topic-relation { color: #555f70; font-size: 8px; font-weight: 800; letter-spacing: .11em; text-transform: uppercase; }
        .topic-level { padding: 4px 6px; border-radius: 5px; font-size: 7px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
        .topic-level.foundation { color: #7fd9bc; background: rgba(83,216,176,.07); }
        .topic-level.core { color: #8791ff; background: rgba(104,117,255,.08); }
        .topic-level.advanced { color: #c6a9ff; background: rgba(171,130,255,.08); }
        .topic-card h3 { margin: 12px 0 6px; font-size: 15px; letter-spacing: -.015em; }
        .topic-card p { min-height: 48px; margin: 0; color: #727b8c; font-size: 10px; line-height: 1.6; }
        .topic-link { display: inline-flex; align-items: center; gap: 7px; margin-top: 13px; padding: 0; border: 0; color: #7d89ff; background: transparent; font-size: 9px; font-weight: 800; }
        .topic-link:hover { color: #a4adff; }
        .related-footer { margin-top: 15px; padding-top: 13px; border-top: 1px solid rgba(255,255,255,.05); color: #4e5767; font-size: 8px; line-height: 1.5; }
        .exercise-card { padding: 26px; }
        .prompt-box { margin: 23px 0 20px; padding: 17px; border: 1px solid rgba(255,255,255,.065); border-radius: 11px; background: rgba(255,255,255,.025); }
        .prompt-label { color: #626b7c; font-size: 8px; font-weight: 800; letter-spacing: .16em; }
        .prompt-box p { margin: 8px 0 0; color: #d8dce4; font-size: 13px; line-height: 1.6; }
        .answer-label { display: block; margin-bottom: 8px; color: #7c8595; font-size: 10px; font-weight: 700; }
        .answer-actions { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-top: 10px; }
        .answer-actions > span { color: #555e6e; font-size: 9px; }
        .answer-actions .primary-button { height: 38px; }
        .result-card { display: flex; align-items: center; gap: 15px; padding: 18px 20px; }
        .result-icon { width: 40px; height: 40px; display: grid; place-items: center; border-radius: 11px; font-size: 18px; font-weight: 800; }
        .success .result-icon { color: #55d8b0; background: rgba(85,216,176,.08); }
        .incorrect .result-icon { color: #ff9b9b; background: rgba(255,100,100,.08); }
        .result-card h3 { margin: 4px 0; font-size: 14px; }
        .result-card p { margin: 0; color: #70798a; font-size: 10px; line-height: 1.5; }
        .result-status { margin-left: auto; color: #737c8c; font-size: 9px; text-transform: uppercase; letter-spacing: .12em; }
        .error-card { display: flex; gap: 12px; align-items: flex-start; padding: 15px 18px; border-color: rgba(255,100,100,.15); background: rgba(255,80,80,.045); }
        .error-card > span { color: #ff9b9b; font-weight: 800; }
        .error-card strong { font-size: 11px; }
        .error-card p { margin: 4px 0 0; color: #9b7e84; font-size: 10px; }
        .footer { display: flex; justify-content: space-between; padding: 35px 0 45px; color: #3e4553; font-size: 8px; font-weight: 800; letter-spacing: .14em; }
        @media (max-width: 800px) {
          .topbar, .hero, .workspace, .footer { width: min(100% - 28px, 620px); }
          .status-pill { display: none; }
          .hero { padding: 48px 0 34px; }
          .hero h1 { font-size: 48px; }
          .workspace { grid-template-columns: 1fr; }
          .sidebar { position: static; }
          .command-form { grid-template-columns: 1fr; }
          .primary-button { min-height: 42px; justify-content: center; }
          .answer-actions { align-items: stretch; flex-direction: column; }
          .result-card { align-items: flex-start; flex-wrap: wrap; }
          .result-status { margin-left: 55px; }
          .topic-grid { grid-template-columns: 1fr; }
          .related-heading { flex-direction: column; }
          .footer { gap: 10px; flex-direction: column; }
        }
      `}</style>
    </main>
  );
}
