import React, { useState, useEffect } from "react";
// HINT: Connect to Supabase to fetch veteran's available slots and book appointments (free or paid)
// Use similar logic as BookConsultationModal for faculty

interface VeteranBookConsultationModalProps {
  veteranId: string;
  veteranName: string;
  consultationRate: number; // 0 for free, >0 for paid
  consultationDuration: number;
  onClose: () => void;
  onSuccess: () => void;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  day_of_week: number;
  location: string;
  notes: string;
}

const VeteranBookConsultationModal: React.FC<VeteranBookConsultationModalProps> = ({
  veteranId,
  veteranName,
  consultationRate,
  consultationDuration,
  onClose,
  onSuccess,
}) => {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [purpose, setPurpose] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingSlots, setFetchingSlots] = useState(true);

  useEffect(() => {
    // HINT: Fetch available slots for this veteran from backend
    setAvailableSlots([]); // Replace with real fetch
    setFetchingSlots(false);
  }, [veteranId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !selectedDate || !purpose.trim()) return;
    setLoading(true);
    try {
      // HINT: Insert appointment into backend (Supabase)
      // Example: await supabase.from('veteran_appointments').insert({...})
      onSuccess();
    } catch (error) {
      alert("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book Appointment</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        <div className="mb-4">
          <p className="text-gray-600"><strong>Veteran:</strong> {veteranName}</p>
          <p className="text-gray-600"><strong>Rate:</strong> {consultationRate === 0 ? "Free" : `₹${consultationRate}`} for {consultationDuration} minutes</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Time Slot</label>
            {fetchingSlots ? (
              <div className="flex justify-center py-4">Loading...</div>
            ) : availableSlots.length === 0 ? (
              <p className="text-gray-500 text-sm">No available time slots</p>
            ) : (
              <select value={selectedSlot} onChange={e => setSelectedSlot(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary" required>
                <option value="">Select a time slot</option>
                {availableSlots.map(slot => (
                  <option key={slot.id} value={slot.id}>
                    {daysOfWeek[slot.day_of_week]}: {slot.start_time} - {slot.end_time}{slot.location && ` (${slot.location})`}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Purpose of Appointment</label>
            <textarea value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="Describe what you'd like to discuss..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary resize-none" rows={3} required />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading || !selectedSlot || !selectedDate || !purpose.trim()} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">{loading ? "Booking..." : "Book Appointment"}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VeteranBookConsultationModal;
