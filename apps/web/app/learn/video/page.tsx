"use client";

import LearningModeShell from "../../../components/learning/LearningModeShell";

const chapters = [
  { time: "00:00", title: "What VLOOKUP solves", active: true },
  { time: "02:18", title: "Understanding the table array", active: false },
  { time: "05:04", title: "Exact vs approximate match", active: false },
  { time: "08:12", title: "Common mistakes", active: false },
  { time: "11:40", title: "A real reporting example", active: false },
];

export default function VideoPage() {
  return (
    <LearningModeShell
      active="video"
      eyebrow="02 / VIDEO LEARNING"
      title="See the concept in action."
      description="A dedicated visual lesson layer for demonstrations, explanations, chapter navigation and guided examples. The player is frontend-ready and can be connected to persisted media metadata later."
    >
      <section className="video-layout">
        <div className="player-card">
          <div className="player-screen">
            <div className="player-grid" />
            <div className="play-button">▶</div>
            <div className="player-copy">
              <span>ILM-OS · VLOOKUP FUNDAMENTALS</span>
              <strong>How VLOOKUP thinks</strong>
            </div>
            <div className="player-controls">
              <span>▶</span><span>1:42 / 12:36</span><span className="control-spacer" /><span>CC</span><span>⚙</span><span>⛶</span>
            </div>
          </div>
          <div className="video-info">
            <div>
              <div className="eyebrow">CURRENT CHAPTER</div>
              <h2>What VLOOKUP solves</h2>
              <p>Understand the business problem before learning the formula: find a record in a structured table and return a related value from the same row.</p>
            </div>
            <span className="duration">12:36</span>
          </div>
        </div>

        <aside className="chapter-card">
          <div className="chapter-head"><strong>Chapters</strong><span>5 sections</span></div>
          <div className="chapter-list">
            {chapters.map((chapter) => (
              <button key={chapter.time} type="button" className={`chapter ${chapter.active ? "active" : ""}`}>
                <span>{chapter.time}</span><strong>{chapter.title}</strong>
              </button>
            ))}
          </div>
        </aside>
      </section>

      <section className="resource-strip">
        <article><span>TRANSCRIPT</span><strong>Full lesson transcript</strong><p>Searchable text will be sourced from the lesson resource.</p></article>
        <article><span>NOTES</span><strong>Save learning notes</strong><p>Keep private notes beside the current chapter.</p></article>
        <article><span>RELATED</span><strong>XLOOKUP next</strong><p>Continue into the modern lookup alternative.</p></article>
      </section>

      <style jsx>{`
        .video-layout { display: grid; grid-template-columns: minmax(0,1fr) 310px; gap: 18px; margin-top: 28px; }
        .player-card, .chapter-card, .resource-strip article { border: 1px solid rgba(255,255,255,.075); background: rgba(13,16,23,.86); border-radius: 18px; overflow: hidden; }
        .player-screen { position: relative; min-height: 490px; display: flex; flex-direction: column; justify-content: center; align-items: center; background: radial-gradient(circle at 50% 45%, rgba(67,87,255,.23), transparent 34%), #090c12; overflow: hidden; }
        .player-grid { position: absolute; inset: 0; opacity: .18; background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px); background-size: 42px 42px; mask-image: linear-gradient(to bottom, transparent, #000, transparent); }
        .play-button { position: relative; display: grid; place-items: center; width: 74px; height: 74px; border-radius: 50%; background: #eef3ff; color: #1728bd; padding-left: 4px; font-size: 24px; box-shadow: 0 0 60px rgba(78,102,255,.35); }
        .player-copy { position: absolute; left: 28px; top: 28px; display: grid; gap: 7px; }
        .player-copy span { color: #6f9dff; font-size: 9px; font-weight: 800; letter-spacing: .15em; }
        .player-copy strong { font-size: 16px; }
        .player-controls { position: absolute; left: 22px; right: 22px; bottom: 18px; display: flex; gap: 15px; align-items: center; color: #aeb8c9; font-size: 11px; }
        .control-spacer { flex: 1; }
        .video-info { display: flex; justify-content: space-between; gap: 20px; padding: 22px 24px 25px; }
        .video-info h2 { margin: 7px 0; font-size: 24px; letter-spacing: -.03em; }
        .video-info p { margin: 0; max-width: 760px; color: #828b9b; line-height: 1.65; font-size: 13px; }
        .duration { color: #697383; font-size: 11px; padding-top: 5px; }
        .chapter-card { padding: 20px; }
        .chapter-head { display: flex; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,.07); }
        .chapter-head strong { font-size: 14px; } .chapter-head span { color: #687282; font-size: 11px; }
        .chapter-list { display: grid; gap: 5px; margin-top: 10px; }
        .chapter { display: grid; grid-template-columns: 48px 1fr; gap: 8px; text-align: left; padding: 12px 9px; border: 0; border-radius: 10px; color: #858e9e; background: transparent; }
        .chapter:hover { background: rgba(255,255,255,.025); } .chapter.active { background: rgba(64,83,255,.12); color: #e8edfa; }
        .chapter span { font-size: 10px; color: #5e6878; padding-top: 2px; } .chapter strong { font-size: 12px; line-height: 1.4; }
        .resource-strip { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-top: 16px; }
        .resource-strip article { padding: 19px; } .resource-strip span { color: #5f9cff; font-size: 9px; font-weight: 800; letter-spacing: .14em; } .resource-strip strong { display: block; margin-top: 8px; font-size: 14px; } .resource-strip p { color: #697384; font-size: 11px; line-height: 1.5; }
        @media (max-width: 1000px) { .video-layout { grid-template-columns: 1fr; } .chapter-list { grid-template-columns: repeat(2, 1fr); } .player-screen { min-height: 390px; } }
        @media (max-width: 650px) { .resource-strip { grid-template-columns: 1fr; } .chapter-list { grid-template-columns: 1fr; } .video-info { display: block; } .player-screen { min-height: 300px; } }
      `}</style>
    </LearningModeShell>
  );
}
