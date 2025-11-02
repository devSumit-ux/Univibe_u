-- Add faculty specific fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS faculty_title text,
ADD COLUMN IF NOT EXISTS department text,
ADD COLUMN IF NOT EXISTS office_hours jsonb,
ADD COLUMN IF NOT EXISTS research_interests text[],
ADD COLUMN IF NOT EXISTS education_background jsonb,
ADD COLUMN IF NOT EXISTS publications text[],
ADD COLUMN IF NOT EXISTS profile_visibility boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS office_location text;

-- Create faculty availability table
CREATE TABLE IF NOT EXISTS faculty_availability (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    faculty_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week smallint, -- 0-6 for Sunday-Saturday
    start_time time,
    end_time time,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create faculty office hours table
CREATE TABLE IF NOT EXISTS faculty_office_hours (
    id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    faculty_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    day_of_week smallint,
    start_time time,
    end_time time,
    location text,
    notes text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add RLS policies
ALTER TABLE faculty_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculty_office_hours ENABLE ROW LEVEL SECURITY;

-- Faculty can manage their own availability
CREATE POLICY "Faculty can manage their own availability"
ON faculty_availability
FOR ALL USING (faculty_id = auth.uid());

-- Anyone can view faculty availability if profile is visible
CREATE POLICY "Public can view faculty availability"
ON faculty_availability
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = faculty_availability.faculty_id
        AND profiles.profile_visibility = true
    )
);

-- Faculty can manage their own office hours
CREATE POLICY "Faculty can manage their own office hours"
ON faculty_office_hours
FOR ALL USING (faculty_id = auth.uid());

-- Anyone can view faculty office hours if profile is visible
CREATE POLICY "Public can view faculty office hours"
ON faculty_office_hours
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = faculty_office_hours.faculty_id
        AND profiles.profile_visibility = true
    )
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faculty_availability_faculty_id ON faculty_availability(faculty_id);
CREATE INDEX IF NOT EXISTS idx_faculty_office_hours_faculty_id ON faculty_office_hours(faculty_id);