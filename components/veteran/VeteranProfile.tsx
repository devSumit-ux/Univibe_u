import React, { useEffect, useState } from "react";
// HINT: Fetch veteran profile from backend
export default function VeteranProfile({ veteran }: { veteran: any }) {
  const [profile, setProfile] = useState<any>(null);
  useEffect(() => {
    // HINT: Replace with real backend call
    // Example: fetch('/api/veteran/profile').then(res => res.json()).then(setProfile);
    setProfile(veteran || { email: "veteran@example.com", name: "Veteran User" });
  }, [veteran]);
  if (!profile) return <div>Loading...</div>;
  return (
    <div>
      <h2>Veteran Profile</h2>
      <p>Email: {profile.email}</p>
      <p>Name: {profile.name}</p>
      {/* Add more profile fields as needed */}
      {/* HINT: Add edit profile logic here */}
    </div>
  );
}
