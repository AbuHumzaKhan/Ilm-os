import Link from "next/link";
import { ReactNode } from "react";

type LearningMode = "lesson" | "video" | "quiz" | "playground" | "business";

type LearningModeShellProps = {
  active: LearningMode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const modes: Array<{ id: LearningMode; label: string; href: string; icon: string }> = [
  { id: "lesson", label: "Lesson", href: "/learn", icon: "01" },
  { id: "video", label: "Video", href: "/learn/video", icon: "02" },
  { id: "quiz", label: "Quiz", href: "/learn/quiz", icon: "03" },
  { id: "playground", label: "Playground", href: "/learn/playground", icon: "04" },
  { id: "business", label: "Business questions", href: "/learn/business", icon: "05" },
];

export default function LearningModeShell({
  active,
  eyebrow,
  title,
  description,
  children,
}: LearningModeShellProps) {
  return (
    <main className="ilm-shell">
      <div className="glow glow-one" />
      <div className="glow glow-two" />

      <header className="ilm-header">
        <Link href="/learn" className="brand">
          <span className="brand-mark">i</span>
          <span>
            <strong>Ilm-os</strong>
            <small>Learning OS</small>
          </span>
        </Link>
        <div className="header-status"><span /> Learning workspace</div>
      </header>

      <div className="ilm-layout">
        <aside className="rail">
          <div className="rail-label">VLOOKUP COURSE</div>
          <div className="course-title">Excel Lookup Mastery</div>
          <div className="course-meta">Module 03 · Lookup functions</div>

          <nav className="mode-nav" aria-label="Learning modes">
            {modes.map((mode) => (
              <Link
                key={mode.id}
                href={mode.href}
                className={`mode-link ${active === mode.id ? "active" : ""}`}
              >
                <span>{mode.icon}</span>
                <strong>{mode.label}</strong>
                {active === mode.id && <i>●</i>}
              </Link>
            ))}
          </nav>

          <div className="rail-progress">
            <div className="rail-progress-head"><span>COURSE PROGRESS</span><strong>68%</strong></div>
            <div className="progress-track"><span /></div>
            <p>Lesson → video → quiz → practice</p>
          </div>

          <div className="rail-note">
            <span>↗</span>
            <div>
              <strong>Learning graph</strong>
              <p>Connected topics remain available without interrupting the current lesson.</p>
            </div>
          </div>
        </aside>

        <section className="mode-content">
          <div className="mode-hero">
            <div>
              <div className="eyebrow">{eyebrow}</div>
              <h1>{title}</h1>
              <p>{description}</p>
            </div>
            <Link href="/learn" className="back-link">← Course overview</Link>
          </div>

          {children}
        </section>
      </div>

      <footer className="ilm-footer">
        <span>ILM-OS · FRONTEND LEARNING EXPERIENCE</span>
        <span>Next.js · API-ready architecture</span>
      </footer>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        :global(body) { margin: 0; background: #07090d; color: #edf2fa; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        :global(a) { color: inherit; text-decoration: none; }
        .ilm-shell { min-height: 100vh; position: relative; overflow: hidden; background: radial-gradient(circle at 78% 4%, rgba(73, 91, 255, .16), transparent 28%), radial-gradient(circle at 5% 75%, rgba(26, 214, 174, .08), transparent 25%), #07090d; }
        .glow { position: fixed; width: 460px; height: 460px; border-radius: 50%; filter: blur(120px); opacity: .14; pointer-events: none; }
        .glow-one { top: -280px; right: -130px; background: #5868ff; }
        .glow-two { bottom: -300px; left: -150px; background: #20d8b0; }
        .ilm-header, .ilm-layout, .ilm-footer { width: min(1320px, calc(100% - 48px)); margin: 0 auto; position: relative; z-index: 1; }
        .ilm-header { height: 82px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,.07); }
        .brand { display: flex; align-items: center; gap: 12px; }
        .brand-mark { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 11px; background: #2437d8; font-weight: 900; font-size: 19px; box-shadow: 0 0 30px rgba(55,73,255,.3); }
        .brand strong, .brand small { display: block; }
        .brand strong { font-size: 15px; letter-spacing: .04em; }
        .brand small { margin-top: 2px; color: #778091; font-size: 10px; text-transform: uppercase; letter-spacing: .16em; }
        .header-status { display: flex; align-items: center; gap: 8px; color: #9aa3b2; font-size: 13px; }
        .header-status span { width: 7px; height: 7px; border-radius: 50%; background: #24d5aa; box-shadow: 0 0 14px rgba(36,213,170,.7); }
        .ilm-layout { display: grid; grid-template-columns: 250px minmax(0, 1fr); gap: 34px; padding: 38px 0 70px; }
        .rail { border-right: 1px solid rgba(255,255,255,.07); padding-right: 28px; min-height: 760px; }
        .rail-label, .eyebrow { color: #5f9cff; font-size: 11px; font-weight: 800; letter-spacing: .16em; }
        .course-title { margin-top: 11px; font-size: 20px; font-weight: 750; letter-spacing: -.02em; }
        .course-meta { margin-top: 7px; color: #727c8d; font-size: 12px; line-height: 1.5; }
        .mode-nav { display: grid; gap: 6px; margin-top: 34px; }
        .mode-link { display: grid; grid-template-columns: 36px 1fr 12px; align-items: center; gap: 10px; padding: 12px 10px; border: 1px solid transparent; border-radius: 13px; color: #8d96a5; transition: .18s ease; }
        .mode-link:hover { background: rgba(255,255,255,.025); color: #dbe2ee; }
        .mode-link > span { font-size: 10px; color: #5e6878; font-weight: 800; }
        .mode-link strong { font-size: 13px; font-weight: 650; }
        .mode-link i { font-style: normal; font-size: 7px; color: #5f9cff; }
        .mode-link.active { color: #f1f5fb; background: rgba(54,74,235,.12); border-color: rgba(80,101,255,.22); }
        .mode-link.active > span { color: #7caaff; }
        .rail-progress { margin-top: 38px; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.07); }
        .rail-progress-head { display: flex; justify-content: space-between; color: #7e8797; font-size: 10px; font-weight: 800; letter-spacing: .11em; }
        .rail-progress-head strong { color: #dfe6f2; letter-spacing: 0; font-size: 12px; }
        .progress-track { height: 5px; margin-top: 11px; border-radius: 99px; background: #161a22; overflow: hidden; }
        .progress-track span { display: block; width: 68%; height: 100%; border-radius: inherit; background: linear-gradient(90deg, #3852ff, #51a1ff); }
        .rail-progress p, .rail-note p { color: #626c7b; font-size: 11px; line-height: 1.6; }
        .rail-note { display: flex; gap: 10px; margin-top: 32px; padding: 14px; border: 1px solid rgba(255,255,255,.06); border-radius: 13px; background: rgba(255,255,255,.018); }
        .rail-note > span { color: #56a0ff; }
        .rail-note strong { font-size: 11px; }
        .rail-note p { margin: 5px 0 0; }
        .mode-content { min-width: 0; }
        .mode-hero { display: flex; align-items: flex-end; justify-content: space-between; gap: 30px; padding: 10px 0 30px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .mode-hero h1 { margin: 9px 0 8px; font-size: clamp(34px, 5vw, 58px); line-height: .98; letter-spacing: -.055em; }
        .mode-hero p { max-width: 680px; margin: 0; color: #8c95a5; font-size: 15px; line-height: 1.7; }
        .back-link { flex: 0 0 auto; padding: 11px 14px; border: 1px solid rgba(255,255,255,.09); border-radius: 10px; color: #aeb7c5; font-size: 12px; }
        .back-link:hover { color: #fff; border-color: rgba(100,130,255,.35); }
        .ilm-footer { display: flex; justify-content: space-between; padding: 20px 0 30px; color: #555f70; font-size: 9px; letter-spacing: .14em; }
        @media (max-width: 900px) { .ilm-layout { grid-template-columns: 1fr; } .rail { border-right: 0; border-bottom: 1px solid rgba(255,255,255,.07); min-height: auto; padding: 0 0 22px; } .mode-nav { grid-template-columns: repeat(5, minmax(0,1fr)); margin-top: 20px; } .mode-link { grid-template-columns: 1fr; justify-items: center; text-align: center; } .mode-link i { display: none; } .rail-progress, .rail-note { display: none; } }
        @media (max-width: 620px) { .ilm-header, .ilm-layout, .ilm-footer { width: min(100% - 28px, 1320px); } .mode-nav { grid-template-columns: repeat(2, 1fr); } .mode-hero { display: block; } .back-link { display: inline-block; margin-top: 18px; } .ilm-footer { display: block; line-height: 1.8; } }
      `}</style>
    </main>
  );
}
