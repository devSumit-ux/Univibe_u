import React, { useEffect, useState } from "react";
// HINT: Fetch appointments from backend
export default function VeteranAppointments({ veteran }: { veteran: any }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  useEffect(() => {
    // HINT: Replace with real backend call
    // Example: fetch('/api/veteran/appointments').then(res => res.json()).then(setAppointments);
    setAppointments([]); // Empty for now
  }, []);
  if (!veteran) return null;
  return (
    <div>
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? <p>No appointments yet.</p> : (
        <ul>
          {appointments.map((a,i) => <li key={i}>{a.date} - {a.topic}</li>)}
        </ul>
      )}
      {/* HINT: List and manage appointments here */}
    </div>
  );
}
