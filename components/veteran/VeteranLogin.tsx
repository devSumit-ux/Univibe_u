import React, { useState } from "react";
// HINT: Connect to backend for real authentication
export default function VeteranLogin({ onLogin }: { onLogin: (user: any) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // HINT: Replace with real backend call
    try {
      // Example: await fetch('/api/veteran/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      if (email && password) {
        onLogin({ role: "veteran", email });
      } else {
        setError("Please enter email and password");
      }
    } catch (err) {
      setError("Login failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <h2>Veteran Login</h2>
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
      {error && <div style={{color:'red'}}>{error}</div>}
    </form>
  );
}
