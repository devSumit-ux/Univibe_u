import React, { useState, useEffect, useRef } from "react";
// HINT: Use Supabase for real-time chat, file sharing, and integrate video call/screen share (see VideoCallPage)
// Use similar UI/UX as CollabChat

interface VeteranChatProps {
  chatId: string; // Unique chat/session id
  currentUser: any;
  otherUser: any;
}

const VeteranChat: React.FC<VeteranChatProps> = ({ chatId, currentUser, otherUser }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // HINT: Fetch messages from Supabase and subscribe to new ones
    setMessages([]); // Replace with real fetch
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !selectedFile) return;
    setIsSending(true);
    // HINT: Upload file if present, then send message to Supabase
    setMessages(prev => [...prev, { id: Date.now(), sender_id: currentUser.id, content: newMessage, file_url: null, created_at: new Date().toISOString() }]);
    setNewMessage("");
    setSelectedFile(null);
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 p-3 space-y-4 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender_id === currentUser.id ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-xl ${msg.sender_id === currentUser.id ? "bg-primary text-white rounded-br-none" : "bg-slate-200 text-text-heading rounded-bl-none"}`}>
              {msg.content && <p className="text-sm whitespace-pre-wrap break-all min-w-0">{msg.content}</p>}
              {msg.file_url && <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">File</a>}
              <p className="text-xs mt-1 text-right">{msg.created_at}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="p-3 border-t flex gap-2">
        <input type="file" ref={fileInputRef} onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="hidden" />
        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-slate-200 text-text-body rounded-full p-2.5 flex-shrink-0 hover:bg-slate-300 transition-colors" title="Attach file">📎</button>
        <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type a message..." className="w-full px-4 py-2 border rounded-full bg-slate-100 focus:ring-primary focus:border-primary transition-colors" />
        <button type="submit" disabled={isSending} className="bg-primary text-white rounded-full p-2.5 flex-shrink-0 hover:bg-primary-focus disabled:opacity-50 transition-colors">Send</button>
        {/* HINT: Add video call/screen share button here */}
        <button type="button" className="ml-2 bg-blue-500 text-white rounded-full p-2.5 hover:bg-blue-600 transition-colors" title="Start Video Call">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
        </button>
      </form>
      {selectedFile && <div className="px-3 pb-2 text-sm text-text-muted">File selected: {selectedFile.name}</div>}
    </div>
  );
};

export default VeteranChat;
