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
  // Accept 'student', 'Student', 'faculty', 'Faculty', and fallback to enrollment_status
  const role = user?.role?.toLowerCase?.() || "";
  const isStudent = role === "student" || user?.enrollment_status === "current" || user?.enrollment_status === "current_student";
  const isFaculty = role === "faculty";
  if (!user || (!isStudent && !isFaculty))
    return (
      <div style={{ padding: 32, textAlign: "center" }}>
        <h2>Request Tutoring from a Veteran</h2>
        <p>You must be logged in as a student or faculty to request tutoring from a veteran.</p>
      </div>
    );
  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: 24, background: "#fff", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}>
      <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Request Tutoring from a Veteran</h2>
      <p style={{ color: "#555", marginBottom: 16 }}>
        Need help with a subject or topic? Submit a request and a veteran will reach out to assist you. Please describe your topic or question clearly.
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Enter your topic or question..."
          value={topic}
          onChange={e => setTopic(e.target.value)}
          style={{ padding: 10, borderRadius: 6, border: "1px solid #ccc", fontSize: 16 }}
        />
        <button type="submit" style={{ padding: 10, borderRadius: 6, background: "#2563eb", color: "#fff", fontWeight: 600, fontSize: 16, border: "none" }}>
          Send Request
        </button>
        {status && <div style={{ marginTop: 8, color: status.includes("sent") ? "green" : "red" }}>{status}</div>}
      </form>
      <div style={{ marginTop: 24, color: "#888", fontSize: 14 }}>
        <b>How it works:</b>
        <ul style={{ margin: "8px 0 0 18px", padding: 0, textAlign: "left" }}>
          <li>Your request will be sent to all available veterans.</li>
          <li>Veterans can respond and help you via chat or video call.</li>
          <li>Check your messages for replies from veterans.</li>
        </ul>
      </div>
    </div>
  );
}
