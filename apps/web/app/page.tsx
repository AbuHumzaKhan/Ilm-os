import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <h1>Ilm-os</h1>
      <p>Structured, practical learning.</p>
      <Link href="/learn">Start learning</Link>
    </main>
  );
}
