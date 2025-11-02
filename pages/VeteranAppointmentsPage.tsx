import React from "react";
import VeteranAppointments from "../components/veteran/VeteranAppointments";
import { useAuth } from "../hooks/useAuth";

const VeteranAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  return <VeteranAppointments veteran={user} />;
};

export default VeteranAppointmentsPage;
