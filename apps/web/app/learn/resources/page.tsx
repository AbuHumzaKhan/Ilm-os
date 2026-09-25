"use client";

import LearningModeShell from "../../../components/learning/LearningModeShell";

const resources = [
  { type: "CHEAT SHEET", title: "VLOOKUP formula reference", description: "Syntax, arguments, exact-match patterns and common variations.", meta: "1 page · PDF-ready" },
  { type: "GUIDED EXAMPLE", title: "Employee sales lookup", description: "Follow a complete reporting scenario from raw table to final result.", meta: "Interactive · 8 steps" },
  { type: "REFERENCE", title: "Lookup family map", description: "Compare VLOOKUP, HLOOKUP, XLOOKUP, LOOKUP and INDEX + MATCH.", meta: "Concept map" },
  { type: "DATASET", title: "Lookup practice workbook", description: "A structured dataset designed for exercises and business questions.", meta: "Excel-ready" },
  { type: "READING", title: "Exact match vs approximate match", description: "Understand how matching behavior changes the result and when each mode is appropriate.", meta: "6 min read" },
  { type: "GLOSSARY", title: "Excel lookup terminology", description: "Quick definitions for lookup value, table array, return column and match mode.", meta: "12 terms" },
];

export default function ResourcesPage() {
  return (
    <LearningModeShell
      active="lesson"
      eyebrow="06 / LEARNING LIBRARY"
      title="Keep the useful material close."
      description="A resource library for notes, cheat sheets, datasets, examples and reading material. Resource records can later be served from the same learning graph and API."
    >
      <section className="library-head"><div><span>VLOOKUP RESOURCE LIBRARY</span><h2>Everything around the lesson</h2></div><strong>{resources.length} resources</strong></section>
      <section className="resource-grid">
        {resources.map((resource) => (
          <article key={resource.title} className="resource-card">
            <div className="resource-type">{resource.type}</div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <div className="resource-bottom"><span>{resource.meta}</span><button type="button">Open →</button></div>
          </article>
        ))}
      </section>
      <section className="library-note"><span>ARCHITECTURE NOTE</span><strong>Frontend is intentionally prepared before content delivery is wired.</strong><p>The next backend layer can return resource metadata, URLs, access rules, progress and completion events without changing this page structure.</p></section>
      <style jsx>{`
        .library-head { display:flex; justify-content:space-between; align-items:flex-end; margin-top:28px; padding-bottom:17px; border-bottom:1px solid rgba(255,255,255,.07); } .library-head span { color:#626d7d; font-size:9px; font-weight:800; letter-spacing:.13em; } .library-head h2 { margin:7px 0 0; font-size:23px; letter-spacing:-.03em; } .library-head strong { color:#687383; font-size:10px; }
        .resource-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-top:15px; } .resource-card { padding:21px; min-height:190px; border:1px solid rgba(255,255,255,.075); border-radius:17px; background:rgba(13,16,23,.86); } .resource-type { color:#5f9cff; font-size:9px; font-weight:800; letter-spacing:.14em; } .resource-card h3 { margin:10px 0 7px; font-size:17px; } .resource-card p { max-width:500px; color:#737d8d; font-size:11px; line-height:1.65; } .resource-bottom { display:flex; justify-content:space-between; align-items:center; margin-top:24px; } .resource-bottom span { color:#525c6c; font-size:9px; } .resource-bottom button { border:0; background:transparent; color:#70a6ff; font-size:10px; font-weight:700; }
        .library-note { margin-top:14px; padding:20px; border:1px solid rgba(82,105,255,.16); border-radius:16px; background:rgba(54,74,255,.055); } .library-note span { color:#6e9fff; font-size:9px; font-weight:800; letter-spacing:.13em; } .library-note strong { display:block; margin-top:7px; font-size:13px; } .library-note p { margin:6px 0 0; color:#697485; font-size:10px; line-height:1.6; }
        @media(max-width:720px){.resource-grid{grid-template-columns:1fr}.library-head{display:block}.library-head strong{display:block;margin-top:8px}}
      `}</style>
    </LearningModeShell>
  );
}
