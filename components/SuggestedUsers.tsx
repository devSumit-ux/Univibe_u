import React, { useState, useEffect } from "react";
import { supabase } from "../services/supabase";
import { Profile } from "../types";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Spinner from "./Spinner";
import VerifiedBadge from "./VerifiedBadge";

const SuggestedUsers: React.FC = () => {
  const { user, profile } = useAuth();
  const [suggestions, setSuggestions] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);

      let query = supabase
        .from("profiles")
        .select("*")
        .neq("id", user.id)
        .limit(5);

      // For parents, suggest other parents or students from same state if available
      if (profile?.enrollment_status === "parent") {
        query = query.or(
          `enrollment_status.eq.parent,enrollment_status.eq.student`
        );
        if (profile.state) {
          query = query.eq("state", profile.state);
        }
        // Always include other parents regardless of state
        query = query.or(`enrollment_status.eq.parent`);
      } else if (profile?.college) {
        // For students, suggest from same college
        query = query.eq("college", profile.college);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching suggestions:", error);
      } else if (data) {
        setSuggestions(data);
      }
      setLoading(false);
    };

    if (user && profile) {
      fetchSuggestions();
    } else {
      setLoading(false);
    }
  }, [user, profile]);

  if (loading) {
    return (
      <div className="bg-card p-4 rounded-2xl shadow-soft border border-border">
        <h3 className="text-lg font-bold text-text-heading mb-4">
          You Might Know
        </h3>
        <div className="flex justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-2xl shadow-soft border border-border">
      <h3 className="text-lg font-bold text-text-heading mb-4">
        You Might Know
      </h3>
      {suggestions.length === 0 ? (
        <p className="text-sm text-text-muted">
          No suggestions available at the moment.
        </p>
      ) : (
        <div className="space-y-4">
          {suggestions.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={s.avatar_url || `https://avatar.vercel.sh/${s.id}.png`}
                  alt={s.name || ""}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/profile/${s.id}`}
                      className="font-semibold text-text-heading hover:underline text-sm"
                    >
                      {s.name}
                    </Link>
                    <VerifiedBadge profile={s} />
                  </div>
                  <p className="text-xs text-text-muted">{s.college}</p>
                </div>
              </div>
              <Link
                to={`/profile/${s.id}`}
                className="text-sm font-semibold text-primary hover:underline bg-dark-card px-3 py-1.5 rounded-lg transition-colors hover:bg-border"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestedUsers;
