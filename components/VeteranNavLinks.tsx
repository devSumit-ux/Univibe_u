import React from "react";
import { NavLink } from "react-router-dom";
import { Profile, UserSubscriptionWithPlan } from "../types";

interface VeteranNavLinksProps {
  isMobile: boolean;
  navLinkClasses: (props: { isActive: boolean }) => string;
  closeMobileMenu: () => void;
  profile: Profile | null;
  subscription: UserSubscriptionWithPlan | null;
  onSignOut: () => void;
  unreadMessagesCount?: number;
  pendingGroupInvitesCount?: number;
}

const VeteranNavLinks: React.FC<VeteranNavLinksProps> = ({
  isMobile,
  navLinkClasses,
  closeMobileMenu,
  profile,
  subscription,
  onSignOut,
  unreadMessagesCount = 0,
  pendingGroupInvitesCount = 0,
}) => {
  return (
    <>
      <NavLink
        to="/veteran/common-room"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        <span>Veteran Common Room</span>
      </NavLink>
      <NavLink
        to="/veteran/profile"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
        <span>My Profile</span>
      </NavLink>
      <NavLink
        to="/veteran/appointments"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        <span>My Appointments</span>
      </NavLink>
      <NavLink
        to="/wallet"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        <span>Wallet</span>
      </NavLink>
      <NavLink
        to="/chat"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" />
        </svg>
        <span>Messages</span>
        {unreadMessagesCount > 0 && (
          <span className="text-xs font-bold text-white bg-red-600 px-2 py-0.5 rounded-full">
            {unreadMessagesCount}
          </span>
        )}
      </NavLink>
      <NavLink
        to="/about"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M18 10c0 4.418-3.582 8-8 8s-8-3.582-8-8 3.582-8 8-8 8 3.582 8 8zm-8-4a1 1 0 100 2 1 1 0 000-2zm1 10h-2v-2h2v2zm0-4h-2V7h2v5z" />
        </svg>
        <span>About Us</span>
      </NavLink>
      <NavLink
        to="/download-app"
        className={({ isActive }) =>
          `flex items-center gap-2 p-2 rounded-lg transition-colors ${
            isActive ? "bg-primary text-white" : "hover:bg-dark-card"
          }`
        }
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M7 10V3a1 1 0 112 0v7h2.586l-3.293 3.293a1 1 0 01-1.414 0L2.586 10H5z" />
        </svg>
        <span>Download App</span>
      </NavLink>
      <hr className="my-3 border-slate-200/60" />
      <button
        onClick={() => {
          closeMobileMenu();
          onSignOut();
        }}
        className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-semibold transition-colors text-red-600 hover:bg-red-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Sign Out
      </button>
    </>
  );
};

export default VeteranNavLinks;
