import Link from "next/link";
import { ReactNode } from "react";

type LearningMode = "lesson" | "video" | "quiz" | "playground" | "business" | "resources";
type ShellVariant = "default" | "workspace";
type LearningTrack = "excel" | "python";

type LearningModeShellProps = {
  active: LearningMode;
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  variant?: ShellVariant;
  track?: LearningTrack;
};

const modes: Array<{ id: LearningMode; label: string; href: string; icon: string }> = [
  { id: "lesson", label: "Lesson", href: "/learn", icon: "01" },
  { id: "video", label: "Video", href: "/learn/video", icon: "02" },
  { id: "quiz", label: "Quiz", href: "/learn/quiz", icon: "03" },
  { id: "playground", label: "Playground", href: "/learn/playground", icon: "04" },
  { id: "business", label: "Business questions", href: "/learn/business", icon: "05" },
  { id: "resources", label: "Resources", href: "/learn/resources", icon: "06" },
];

const tracks: Array<{ id: LearningTrack; label: string; subtitle: string; href: string }> = [
  { id: "excel", label: "Excel", subtitle: "Formulas & analysis", href: "/learn/playground" },
  { id: "python", label: "Python", subtitle: "Pandas & data", href: "/learn/python" },
];

function Brand() {
  return (
    <Link href="/learn" className="brand" aria-label="Back to Ilm-os learning">
      <span className="brand-mark">i</span>
      <span><strong>Ilm-os</strong><small>Learning OS</small></span>
    </Link>
  );
}

function TrackSwitcher({ active }: { active: LearningTrack }) {
  return (
    <div className="track-switcher" aria-label="Learning workspace">
      {tracks.map((track) => (
        <Link key={track.id} href={track.href} className={`track-item ${active === track.id ? "active" : ""}`}>
          <span className={`track-icon ${track.id}`}>{track.id === "excel" ? "X" : "Py"}</span>
          <span><strong>{track.label}</strong><small>{track.subtitle}</small></span>
        </Link>
      ))}
    </div>
  );
}

function WorkspaceHeader({ track }: { track: LearningTrack }) {
  return (
    <header className="workspace-header">
      <Link href="/learn" className="back-button">← <span>Back to Learning</span></Link>
      <Brand />
      <label className="workspace-search">
        <span>⌕</span>
        <input aria-label="Search learning topics" placeholder="Search VLOOKUP, Pivot Table, pandas..." />
      </label>
      <TrackSwitcher active={track} />
      <nav className="workspace-nav" aria-label="Main navigation">
        <Link href="/">Home</Link>
        <Link href="/learn" className="active">Learn</Link>
        <Link href="/progress">Progress</Link>
      </nav>
      <div className="user-chip"><span>LU</span><strong>Local User</strong><b>⌄</b></div>
    </header>
  );
}

export default function LearningModeShell({ active, eyebrow, title, description, children, variant = "default", track = "excel" }: LearningModeShellProps) {
  if (variant === "workspace") {
    return (
      <main className="ilm-shell workspace-shell">
        <div className="glow glow-one" /><div className="glow glow-two" />
        <WorkspaceHeader track={track} />
        <div className="workspace-progress"><span>Lesson progress</span><i><b /></i><strong>68%</strong></div>
        <section className="workspace-content">{children}</section>
        <footer className="ilm-footer"><span>ILM-OS · LEARNING WORKSPACE</span><span>Excel · Python · API-ready architecture</span></footer>
        <style jsx>{workspaceStyles}</style>
      </main>
    );
  }

  return (
    <main className="ilm-shell">
      <div className="glow glow-one" /><div className="glow glow-two" />
      <header className="ilm-header">
        <Brand />
        <div className="header-right"><TrackSwitcher active={track} /><div className="header-status"><span /> Learning workspace</div></div>
      </header>
      <div className="ilm-layout">
        <aside className="rail">
          <div className="rail-label">VLOOKUP COURSE</div><div className="course-title">Excel Lookup Mastery</div><div className="course-meta">Module 03 · Lookup functions</div>
          <nav className="mode-nav" aria-label="Learning modes">{modes.map((mode) => <Link key={mode.id} href={mode.href} className={`mode-link ${active === mode.id ? "active" : ""}`}><span>{mode.icon}</span><strong>{mode.label}</strong>{active === mode.id && <i>●</i>}</Link>)}</nav>
          <div className="rail-progress"><div className="rail-progress-head"><span>COURSE PROGRESS</span><strong>68%</strong></div><div className="progress-track"><span /></div><p>Lesson → video → quiz → practice</p></div>
          <div className="rail-note"><span>↗</span><div><strong>Learning graph</strong><p>Connected topics remain available without interrupting the current lesson.</p></div></div>
        </aside>
        <section className="mode-content">
          <div className="mode-hero"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div><Link href="/learn" className="back-link">← Course overview</Link></div>
          {children}
        </section>
      </div>
      <footer className="ilm-footer"><span>ILM-OS · FRONTEND LEARNING EXPERIENCE</span><span>Excel · Python · API-ready architecture</span></footer>
      <style jsx>{defaultStyles}</style>
    </main>
  );
}

const baseStyles = `
  :global(*){box-sizing:border-box}:global(body){margin:0;background:#06090f;color:#edf2fa;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}:global(a){color:inherit;text-decoration:none}:global(button),:global(input),:global(textarea),:global(select){font:inherit}
  .ilm-shell{min-height:100vh;position:relative;overflow:hidden;background:radial-gradient(circle at 76% 3%,rgba(46,91,255,.14),transparent 26%),radial-gradient(circle at 5% 78%,rgba(22,205,167,.07),transparent 23%),#06090f}.glow{position:fixed;width:460px;height:460px;border-radius:50%;filter:blur(120px);opacity:.12;pointer-events:none}.glow-one{top:-300px;right:-120px;background:#4564ff}.glow-two{bottom:-300px;left:-170px;background:#17d2ae}.ilm-footer{width:min(1480px,calc(100% - 40px));margin:auto;display:flex;justify-content:space-between;padding:18px 0 26px;color:#536071;font-size:9px;letter-spacing:.14em;position:relative;z-index:1}.brand{display:flex;align-items:center;gap:10px;white-space:nowrap}.brand-mark{display:grid;place-items:center;width:38px;height:38px;border-radius:10px;background:#1f55f5;color:white;font-weight:900;font-size:20px;box-shadow:0 0 25px rgba(31,85,245,.25)}.brand strong,.brand small{display:block}.brand strong{font-size:16px;letter-spacing:.02em}.brand small{margin-top:1px;color:#758197;font-size:8px;text-transform:uppercase;letter-spacing:.16em}.track-switcher{display:flex;align-items:center;gap:4px;padding:4px;border:1px solid rgba(100,125,170,.22);border-radius:12px;background:rgba(12,20,33,.76)}.track-item{display:flex;align-items:center;gap:7px;padding:6px 9px;border-radius:8px;color:#758197}.track-item.active{background:rgba(45,86,235,.18);color:#e9eff9;box-shadow:inset 0 0 0 1px rgba(74,111,255,.2)}.track-icon{display:grid;place-items:center;width:25px;height:25px;border-radius:6px;font-size:9px;font-weight:900}.track-icon.excel{background:#123c2a;color:#42d79a}.track-icon.python{background:#2a3150;color:#ffd34e}.track-item strong,.track-item small{display:block}.track-item strong{font-size:10px}.track-item small{margin-top:1px;color:#667287;font-size:7px}.track-item.active small{color:#8b98ad}
`;

const workspaceStyles = `${baseStyles}
  .workspace-header{min-height:72px;width:min(1480px,calc(100% - 40px));margin:auto;display:grid;grid-template-columns:auto auto minmax(220px,1fr) auto auto auto;align-items:center;gap:14px;border-bottom:1px solid rgba(255,255,255,.07);position:relative;z-index:2}.back-button{padding:9px 13px;border:1px solid rgba(91,130,255,.22);border-radius:9px;background:rgba(19,31,51,.55);font-size:12px;color:#cdd7e6}.back-button:hover{border-color:rgba(91,130,255,.5)}.workspace-search{height:40px;max-width:430px;justify-self:center;width:100%;display:flex;align-items:center;gap:9px;padding:0 13px;border:1px solid rgba(100,125,170,.24);border-radius:999px;background:rgba(16,25,40,.72);color:#7d8ba1}.workspace-search span{font-size:20px;line-height:1}.workspace-search input{width:100%;border:0;outline:0;background:transparent;color:#dce5f3;font-size:12px}.workspace-search input::placeholder{color:#68758a}.workspace-nav{display:flex;align-items:center;gap:3px}.workspace-nav a{padding:9px 10px;border-radius:8px;color:#9aa6b8;font-size:11px}.workspace-nav a:hover,.workspace-nav a.active{color:#fff;background:rgba(39,91,255,.14)}.user-chip{display:flex;align-items:center;gap:7px;color:#c5cfdd;font-size:10px;white-space:nowrap}.user-chip span{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:#6f91bd;color:#fff;font-weight:800}.user-chip b{color:#7b8799}.workspace-progress{width:min(1480px,calc(100% - 40px));margin:0 auto;padding:15px 0 0;display:flex;justify-content:flex-end;align-items:center;gap:10px;color:#9da8b8;font-size:11px;position:relative;z-index:1}.workspace-progress i{width:145px;height:7px;border-radius:99px;background:#182131;overflow:hidden}.workspace-progress i b{display:block;width:68%;height:100%;border-radius:inherit;background:linear-gradient(90deg,#1d73ff,#3b91ff)}.workspace-progress strong{font-size:12px;color:#dce5f0}.workspace-content{width:min(1480px,calc(100% - 40px));margin:0 auto;padding:14px 0 30px;position:relative;z-index:1}@media(max-width:1250px){.workspace-header{grid-template-columns:auto auto minmax(180px,1fr) auto auto}.workspace-nav a{padding:8px 6px}.user-chip strong{display:none}}@media(max-width:1000px){.workspace-header{grid-template-columns:auto auto 1fr auto}.workspace-search{grid-column:1/-1;grid-row:2;max-width:none}.workspace-nav{display:none}}@media(max-width:760px){.workspace-header{width:calc(100% - 24px);padding:10px 0}.track-item small{display:none}.track-item{padding:6px}.workspace-content,.workspace-progress{width:calc(100% - 24px)}.back-button span{display:none}.brand small{display:none}}@media(max-width:560px){.workspace-header{grid-template-columns:auto 1fr auto}.workspace-header>.workspace-search{grid-column:1/-1;grid-row:2}.workspace-header>.track-switcher{justify-self:end}.user-chip{display:none}.ilm-footer{width:calc(100% - 24px);display:block;line-height:1.8}}
`;

const defaultStyles = `${baseStyles}
  .ilm-header{width:min(1320px,calc(100% - 48px));min-height:82px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.07);position:relative;z-index:1}.header-right{display:flex;align-items:center;gap:16px}.header-status{display:flex;align-items:center;gap:8px;color:#9aa3b2;font-size:13px}.header-status span{width:7px;height:7px;border-radius:50%;background:#24d5aa;box-shadow:0 0 14px rgba(36,213,170,.7)}.ilm-layout{width:min(1320px,calc(100% - 48px));margin:0 auto;display:grid;grid-template-columns:250px minmax(0,1fr);gap:34px;padding:38px 0 70px;position:relative;z-index:1}.rail{border-right:1px solid rgba(255,255,255,.07);padding-right:28px;min-height:760px}.rail-label,.eyebrow{color:#5f9cff;font-size:11px;font-weight:800;letter-spacing:.16em}.course-title{margin-top:11px;font-size:20px;font-weight:750}.course-meta{margin-top:7px;color:#727c8d;font-size:12px}.mode-nav{display:grid;gap:6px;margin-top:34px}.mode-link{display:grid;grid-template-columns:36px 1fr 12px;align-items:center;gap:10px;padding:12px 10px;border:1px solid transparent;border-radius:13px;color:#8d96a5}.mode-link:hover{background:rgba(255,255,255,.025);color:#dbe2ee}.mode-link>span{font-size:10px;color:#5e6878;font-weight:800}.mode-link strong{font-size:13px;font-weight:650}.mode-link i{font-style:normal;font-size:7px;color:#5f9cff}.mode-link.active{color:#f1f5fb;background:rgba(54,74,235,.12);border-color:rgba(80,101,255,.22)}.rail-progress{margin-top:38px;padding-top:22px;border-top:1px solid rgba(255,255,255,.07)}.rail-progress-head{display:flex;justify-content:space-between;color:#7e8797;font-size:10px;font-weight:800}.rail-progress-head strong{color:#dfe6f2;font-size:12px}.progress-track{height:5px;margin-top:11px;border-radius:99px;background:#161a22;overflow:hidden}.progress-track span{display:block;width:68%;height:100%;background:linear-gradient(90deg,#3852ff,#51a1ff)}.rail-progress p,.rail-note p{color:#626c7b;font-size:11px;line-height:1.6}.rail-note{display:flex;gap:10px;margin-top:32px;padding:14px;border:1px solid rgba(255,255,255,.06);border-radius:13px;background:rgba(255,255,255,.018)}.rail-note>span{color:#56a0ff}.rail-note p{margin:5px 0 0}.mode-content{min-width:0}.mode-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:30px;padding:10px 0 30px;border-bottom:1px solid rgba(255,255,255,.07)}.mode-hero h1{margin:9px 0 8px;font-size:clamp(34px,5vw,58px);line-height:.98;letter-spacing:-.055em}.mode-hero p{max-width:680px;margin:0;color:#8c95a5;font-size:15px;line-height:1.7}.back-link{padding:11px 14px;border:1px solid rgba(255,255,255,.09);border-radius:10px;color:#aeb7c5;font-size:12px}.mode-link.active>span{color:#7caaff}@media(max-width:900px){.ilm-header{width:calc(100% - 28px)}.header-right .header-status{display:none}.ilm-layout{grid-template-columns:1fr;width:calc(100% - 28px)}.rail{border-right:0;border-bottom:1px solid rgba(255,255,255,.07);min-height:auto;padding:0 0 22px}.mode-nav{grid-template-columns:repeat(3,minmax(0,1fr));margin-top:20px}.mode-link{grid-template-columns:1fr;justify-items:center;text-align:center}.mode-link i{display:none}}@media(max-width:620px){.mode-nav{grid-template-columns:repeat(2,1fr)}.mode-hero{display:block}.back-link{display:inline-block;margin-top:18px}.track-item small{display:none}}
`;
