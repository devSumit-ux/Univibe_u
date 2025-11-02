import React, { useState } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "../hooks/useAuth";
import Spinner from "./Spinner";
import { toast } from "./Toast";

interface BookTourModalProps {
  guideId: string;
  guideName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const BookTourModal: React.FC<BookTourModalProps> = ({
  guideId,
  guideName,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !purpose.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("tour_bookings").insert({
        parent_id: user?.id,
        guide_id: guideId,
        booking_date: selectedDate,
        booking_time: selectedTime,
        purpose: purpose.trim(),
        status: "pending",
      });

      if (error) throw error;

      toast.success("Tour booking request sent successfully!");
      onSuccess();
    } catch (error: any) {
      console.error("Error booking tour:", error);
      toast.error("Failed to book tour. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book Virtual Tour</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600">
            <strong>Guide:</strong> {guideName}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            >
              <option value="">Select a time</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Tour
            </label>
            <textarea
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe what you'd like to see in the tour..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              rows={3}
              required
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !selectedDate || !selectedTime || !purpose.trim()
              }
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Booking..." : "Book Tour"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookTourModal;
