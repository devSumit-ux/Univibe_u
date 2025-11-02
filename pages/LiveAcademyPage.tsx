import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";
import Spinner from "../components/Spinner";
import UserCardSkeleton from "../components/UserCardSkeleton";
import UserCard from "../components/UserCard";
import BookTourModal from "../components/BookTourModal";
import { supabase } from "../services/supabase";
import { Profile } from "../types";

const LiveAcademyPage: React.FC = () => {
  const { subscription, loading, profile } = useAuth();
  const [guides, setGuides] = useState<Profile[]>([]);
  const [guidesLoading, setGuidesLoading] = useState(false);
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    guideId: string;
    guideName: string;
  }>({ isOpen: false, guideId: "", guideName: "" });

  const hasProAccess =
    subscription?.status === "active" &&
    subscription.subscriptions.name?.toUpperCase() === "PRO";
  const isParent = profile?.enrollment_status === "parent";

  const fetchGuides = useCallback(async () => {
    setGuidesLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("is_tour_guide", true);

    if (data) {
      setGuides(data);
    }
    if (error) {
      console.error(error);
    }
    setGuidesLoading(false);
  }, []);

  const handleBookTour = (guideId: string, guideName: string) => {
    setBookingModal({ isOpen: true, guideId, guideName });
  };

  const handleBookingSuccess = () => {
    setBookingModal({ isOpen: false, guideId: "", guideName: "" });
    // Optionally refetch guides or show success message
  };

  useEffect(() => {
    if (isParent || hasProAccess) {
      fetchGuides();
    }
  }, [fetchGuides, isParent, hasProAccess]);

  if (loading || guidesLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasProAccess && !isParent) {
    return (
      <div className="text-center p-8 bg-card rounded-2xl shadow-soft border border-slate-200/50">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-text-heading">
          Unlock Live Academy
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-lg text-text-body">
          Upgrade to a PRO subscription to connect with experienced students for
          live guidance, mock interviews, and academic tours.
        </p>
        <Link
          to="/subscriptions"
          className="mt-8 inline-block bg-primary text-white px-8 py-3 rounded-xl hover:bg-primary-focus transition-transform hover:scale-105 transform font-semibold shadow-soft hover:shadow-soft-md active:scale-100"
        >
          ✨ Go Pro
        </Link>
      </div>
    );
  }

  // Show tour guides for parents, or placeholder for others
  if (isParent) {
    return (
      <div className="animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-heading">Live Academy</h1>
          <p className="text-text-body mt-2">
            Connect with verified students for virtual campus tours and
            guidance.
          </p>
        </div>

        {guides.length === 0 ? (
          <p className="text-center text-gray-500 bg-card p-10 rounded-lg border border-slate-200/80">
            No tour guides are available yet. Please check back later!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {guides.map((guide) => (
              <div key={guide.id} className="relative">
                <UserCard profile={guide} />
                <button
                  onClick={() => handleBookTour(guide.id, guide.name || "")}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-focus transition-colors font-semibold text-sm shadow-soft hover:shadow-soft-md"
                >
                  Book Tour
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Placeholder for PRO users
  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-text-heading">Live Academy</h1>
        <p className="text-text-body mt-2">
          Connect with top students for guidance and mentorship.
        </p>
      </div>

      <div className="p-6 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-r-lg mb-8">
        <p className="font-bold">Feature Coming Soon!</p>
        <p className="text-sm">
          The ability to book video calls and interact live with students is
          under development. Below is a preview of how it might look.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-card p-5 rounded-2xl shadow-soft border border-slate-200/50"
          >
            <div className="flex flex-col items-center text-center">
              <UserCardSkeleton />
              <div className="w-full mt-4">
                <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4 mx-auto"></div>
                <div className="h-10 bg-primary/20 rounded-lg mt-4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {bookingModal.isOpen && (
        <BookTourModal
          guideId={bookingModal.guideId}
          guideName={bookingModal.guideName}
          onClose={() =>
            setBookingModal({ isOpen: false, guideId: "", guideName: "" })
          }
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default LiveAcademyPage;
