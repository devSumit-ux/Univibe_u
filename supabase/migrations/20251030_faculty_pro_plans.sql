-- Migration: Faculty Pro Plans and Pro Faculty Restriction

-- 1. Create faculty_pro_plans table
CREATE TABLE IF NOT EXISTS faculty_pro_plans (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    duration_days INTEGER NOT NULL,
    features TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add pro_plan_id to profiles (faculty only)
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS pro_plan_id BIGINT REFERENCES faculty_pro_plans(id),
ADD COLUMN IF NOT EXISTS pro_plan_expiry TIMESTAMPTZ;

-- 3. Only allow consultation features for faculty with pro_plan_id not null and pro_plan_expiry > now()
-- (Enforced in app logic/UI, not directly in DB)

-- 4. (Optional) Add index for quick lookup
CREATE INDEX IF NOT EXISTS idx_profiles_pro_plan_id ON profiles(pro_plan_id);
