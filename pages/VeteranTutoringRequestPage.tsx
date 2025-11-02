import React from "react";
import VeteranTutoringRequest from "../components/veteran/VeteranTutoringRequest";
import { useAuth } from "../hooks/useAuth";

const VeteranTutoringRequestPage: React.FC = () => {
  const { user } = useAuth();
  return <VeteranTutoringRequest user={user} />;
};

export default VeteranTutoringRequestPage;
