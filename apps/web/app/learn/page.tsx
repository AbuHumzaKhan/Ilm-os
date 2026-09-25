"use client";

import { FormEvent, useState } from "react";

export default function LearnPage() {
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const response = await fetch("http://localhost:8000/api/learning/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ learner_id: "local-learner", message }),
    });

    const data = await response.json();
    setResult(response.ok ? data.lesson.title : data.detail);
  }

  return (
    <main style={{ maxWidth: 720, margin: "4rem auto", padding: "0 1rem" }}>
      <p>Ilm-os / Learn</p>
      <h1>What do you want to learn?</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Teach me VLOOKUP"
          style={{ width: "100%", padding: "0.9rem", margin: "1rem 0" }}
        />
        <button type="submit">Start learning</button>
      </form>
      {result && <p>Learning: {result}</p>}
    </main>
  );
}
