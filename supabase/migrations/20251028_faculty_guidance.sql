-- Add consultation related fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS consultation_rate decimal,
ADD COLUMN IF NOT EXISTS consultation_available boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS expertise_areas text[],
ADD COLUMN IF NOT EXISTS consultation_duration integer DEFAULT 30; -- in minutes

-- Create faculty consultation slots table
CREATE TABLE IF NOT EXISTS faculty_consultation_slots (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    faculty_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week smallint,
    start_time time,
    end_time time,
    is_available boolean DEFAULT true,
    created_at timestamptz DEFAULT now()
);

-- Create consultation bookings table
CREATE TABLE IF NOT EXISTS consultation_bookings (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    faculty_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    slot_id bigint REFERENCES faculty_consultation_slots(id) ON DELETE CASCADE,
    booking_date date NOT NULL,
    status text CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    topic text,
    description text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE faculty_consultation_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for consultation slots
CREATE POLICY "Faculty can manage their slots"
ON faculty_consultation_slots
FOR ALL USING (faculty_id = auth.uid());

CREATE POLICY "Anyone can view available slots"
ON faculty_consultation_slots
FOR SELECT USING (is_available = true);

-- RLS Policies for bookings
CREATE POLICY "Students can view and create their bookings"
ON consultation_bookings
FOR ALL USING (student_id = auth.uid());

CREATE POLICY "Faculty can view and manage their bookings"
ON consultation_bookings
FOR ALL USING (faculty_id = auth.uid());

-- Create indexes
CREATE INDEX idx_consultation_slots_faculty_id ON faculty_consultation_slots(faculty_id);
CREATE INDEX idx_consultation_bookings_student_id ON consultation_bookings(student_id);
CREATE INDEX idx_consultation_bookings_faculty_id ON consultation_bookings(faculty_id);
CREATE INDEX idx_consultation_bookings_slot_id ON consultation_bookings(slot_id);