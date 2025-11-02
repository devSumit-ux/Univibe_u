import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";
import VerifiedBadge from "../components/VerifiedBadge";
import BookConsultationModal from "../components/BookConsultationModal";

interface VeteranProfile {
  id: string;
  name: string;
  username: string;
  avatar_url: string;
  bio: string;
  expertise: string;
  state: string;
  home_town: string;
  gender: string;
  hobbies_interests: string[];
  linkedin_url: string;
  twitter_url: string;
  github_url: string;
  profile_visibility: boolean;
  verified: boolean;
  consultation_available?: boolean;
  consultation_rate?: number;
  consultation_duration?: number;
}

import VeteranProfileDetails from "../components/VeteranProfileDetails";

const VeteranProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [veteranProfile, setVeteranProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Timeout for loading
  React.useEffect(() => {
    if (!loading) return;
    const timeout = setTimeout(() => {
      setLoading(false);
      setError("Profile loading timed out. Please check your connection or if the veteran account exists.");
    }, 10000); // 10 seconds
    return () => clearTimeout(timeout);
  }, [loading]);
  const isSelf = user?.id === id;

  useEffect(() => {
    const fetchVeteranProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", id)
          // Case-insensitive role check for 'veteran'
          .ilike("role", "veteran")
          .single();
        if (profileError) throw profileError;
        if (!profileData) {
          setError("Veteran profile not found");
          setLoading(false);
          return;
        }
        if (!profileData.profile_visibility && !isSelf) {
          setError("This veteran profile is not yet visible");
          setLoading(false);
          return;
        }
        const parsedHobbies = Array.isArray(profileData.hobbies_interests)
          ? profileData.hobbies_interests
          : profileData.hobbies_interests
          ? profileData.hobbies_interests.split(",").map((h: string) => h.trim()).filter(Boolean)
          : [];
        setVeteranProfile({
          ...profileData,
          hobbies_interests: parsedHobbies,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchVeteranProfile();
  }, [id, isSelf]);

  const handleEdit = () => navigate(`/edit-veteran-profile`);
  const handleToggleVisibility = async () => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ profile_visibility: !veteranProfile?.profile_visibility })
        .eq("id", user?.id);
      if (error) throw error;
      setVeteranProfile((prev: any) =>
        prev ? { ...prev, profile_visibility: !prev.profile_visibility } : null
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!veteranProfile)
    return <div className="p-4 text-gray-600">Profile not found</div>;

  return (
    <VeteranProfileDetails
      profile={veteranProfile}
      isSelf={isSelf}
      onEdit={handleEdit}
      onToggleVisibility={handleToggleVisibility}
    />
  );
};

export default VeteranProfilePage;
