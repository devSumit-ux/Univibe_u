import React, { useState } from "react";
// HINT: Connect to backend to send request
export default function VeteranTutoringRequest({ user }: { user: any }) {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    // HINT: Replace with real backend call
    try {
      // Example: await fetch('/api/veteran/tutoring-request', { method: 'POST', body: JSON.stringify({ topic }) })
      if (topic) {
        setStatus("Request sent to veterans!");
      } else {
        setStatus("Please enter a topic");
      }
    } catch (err) {
      setStatus("Failed to send request");
    }
  };
  if (!user || (user.role !== "student" && user.role !== "teacher")) return null;
  return (
    <form onSubmit={handleSubmit}>
      <h2>Request Tutoring from a Veteran</h2>
      <input placeholder="Topic" value={topic} onChange={e=>setTopic(e.target.value)} />
      <button type="submit">Request</button>
      {status && <div>{status}</div>}
    </form>
  );
}
