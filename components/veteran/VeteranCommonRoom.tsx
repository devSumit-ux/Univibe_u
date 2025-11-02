import React, { useState } from "react";
// HINT: Fetch and post messages via backend
export default function VeteranCommonRoom() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  // HINT: Replace with real backend fetch/post
  const sendMessage = () => {
    if (input) setMessages([...messages, { text: input, user: "You" }]);
    setInput("");
  };
  return (
    <div>
      <h2>Veteran Common Room</h2>
      <div style={{border:'1px solid #ccc',padding:8,minHeight:80}}>
        {messages.map((m,i) => <div key={i}><b>{m.user}:</b> {m.text}</div>)}
      </div>
      <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
      {/* HINT: Add chat/discussion logic here */}
    </div>
  );
}
