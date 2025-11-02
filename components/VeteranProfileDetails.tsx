import React from "react";
import VerifiedBadge from "./VerifiedBadge";

interface VeteranProfileDetailsProps {
  profile: any;
  isSelf: boolean;
  onEdit?: () => void;
  onToggleVisibility?: () => void;
}

const VeteranProfileDetails: React.FC<VeteranProfileDetailsProps> = ({ profile, isSelf, onEdit, onToggleVisibility }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={profile.avatar_url || "/default-avatar.png"}
            alt={profile.name}
            className="w-24 h-24 rounded-full object-cover"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-gray-900">
                {profile.name}
                {profile.username && (
                  <span className="text-lg text-gray-500">
                    (@{profile.username})
                  </span>
                )}
              </h1>
              {profile.verified && <VerifiedBadge />}
            </div>
            {profile.bio && (
              <p className="text-gray-700 mt-2">{profile.bio}</p>
            )}
            {profile.expertise && (
              <p className="text-gray-700 mt-2">Expertise: {profile.expertise}</p>
            )}
            {profile.state && (
              <p className="text-gray-600">{profile.state}</p>
            )}
            {profile.home_town && (
              <p className="text-gray-600">{profile.home_town}</p>
            )}
            {profile.gender && (
              <p className="text-gray-600 capitalize">{profile.gender}</p>
            )}
          </div>
        </div>
        {isSelf && (
          <div className="space-y-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="block w-full px-4 py-2 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition"
              >
                Edit Profile
              </button>
            )}
            {onToggleVisibility && (
              <button
                onClick={onToggleVisibility}
                className={`block w-full px-4 py-2 text-sm rounded-md transition
                  ${profile.profile_visibility
                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                    : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
              >
                {profile.profile_visibility ? "Profile Visible" : "Profile Hidden"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Hobbies & Interests */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Hobbies & Interests
        </h2>
        <div className="flex flex-wrap gap-2">
          {profile.hobbies_interests?.map((hobby: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {hobby}
            </span>
          ))}
          {(!profile.hobbies_interests || profile.hobbies_interests.length === 0) && (
            <p className="text-gray-500">No hobbies or interests listed</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Contact Information
        </h2>
        <div className="space-y-2">
          {profile.linkedin_url && (
            <p className="text-gray-700">
              <span className="font-medium">LinkedIn:</span>{" "}
              <a
                href={profile.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.linkedin_url}
              </a>
            </p>
          )}
          {profile.twitter_url && (
            <p className="text-gray-700">
              <span className="font-medium">Twitter:</span>{" "}
              <a
                href={profile.twitter_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.twitter_url}
              </a>
            </p>
          )}
          {profile.github_url && (
            <p className="text-gray-700">
              <span className="font-medium">GitHub:</span>{" "}
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {profile.github_url}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VeteranProfileDetails;
