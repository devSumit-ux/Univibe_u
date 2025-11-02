-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text;

-- Update existing rows
UPDATE profiles 
SET role = CASE 
  WHEN enrollment_status = 'faculty' THEN 'faculty'
  WHEN enrollment_status = 'parent' THEN 'parent'
  ELSE 'student'
END;

-- Make role not nullable
ALTER TABLE profiles 
ALTER COLUMN role SET NOT NULL;

-- Add check constraint to validate role values
ALTER TABLE profiles 
ADD CONSTRAINT valid_role CHECK (role IN ('faculty', 'parent', 'student'));