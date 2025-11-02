-- Migration: create/replace trigger to insert into public.profiles when a new auth user is created
-- This trigger prefers enrollment_status from auth user metadata (raw_user_meta_data or user_metadata)

create or replace function public.handle_new_auth_user_profiles()
returns trigger as $$
declare
  v_enrollment_status text;
  v_name text;
  v_error_msg text;
begin
  -- Ensure we have an ID and email
  if new.id is null then
    raise exception 'User ID cannot be null';
  end if;
  
  if new.email is null then
    raise exception 'Email cannot be null';
  end if;

  -- Extract name from metadata with proper error handling
  v_name := coalesce(
    nullif(new.raw_user_meta_data->>'name', ''),
    new.user_metadata->>'name',
    split_part(new.email, '@', 1)  -- Fallback to email username if no name provided
  );

  -- Try to use enrollment_status provided in auth metadata; fall back to 'exploring'
  v_enrollment_status := coalesce(
    nullif(new.raw_user_meta_data->>'enrollment_status', ''),
    new.user_metadata->>'enrollment_status',
    'exploring'
  );

  -- Validate enrollment status
  if v_enrollment_status not in ('exploring', 'current_student', 'incoming_student', 'passed_out', 'parent', 'faculty') then
    v_enrollment_status := 'exploring';
  end if;

  -- Wrap the insert in an exception handler
  begin
    insert into public.profiles (
      id,
      email,
      name,
      enrollment_status,
      role,
      faculty_title,
      department,
      consultation_rate,
      consultation_available,
      consultation_duration,
      created_at
    )
    values (
      new.id,
      new.email,
      v_name,
      v_enrollment_status,
    case 
      when v_enrollment_status = 'faculty' then 'faculty'
      when v_enrollment_status = 'parent' then 'parent'
      else 'student'
    end,
    case when v_enrollment_status = 'faculty' then new.raw_user_meta_data->>'faculty_title' else null end,
    case when v_enrollment_status = 'faculty' then new.raw_user_meta_data->>'department' else null end,
    case when v_enrollment_status = 'faculty' then (new.raw_user_meta_data->>'consultation_rate')::numeric else null end,
    case when v_enrollment_status = 'faculty' then coalesce((new.raw_user_meta_data->>'consultation_available')::boolean, false) else false end,
    case when v_enrollment_status = 'faculty' then coalesce((new.raw_user_meta_data->>'consultation_duration')::int, 30) else null end,
    now()
  )
  on conflict (id) do update
    set email = excluded.email,
        name = coalesce(profiles.name, excluded.name),
        enrollment_status = coalesce(profiles.enrollment_status, excluded.enrollment_status),
        role = case 
          when coalesce(profiles.enrollment_status, excluded.enrollment_status) = 'faculty' then 'faculty'
          when coalesce(profiles.enrollment_status, excluded.enrollment_status) = 'parent' then 'parent'
          else 'student'
        end
  ;

    return new;
  exception 
    when others then
      -- Get the error message
      GET STACKED DIAGNOSTICS v_error_msg = MESSAGE_TEXT;
      
      -- Log the error (this will appear in your Supabase logs)
      raise notice 'Profile creation failed: %', v_error_msg;
      
      -- Re-raise the error with a user-friendly message
      raise exception 'Failed to create user profile. Error: %', v_error_msg;
  end;
end;
$$ language plpgsql security definer;

-- Drop any existing trigger with the same name, then create it on auth.users
drop trigger if exists auth_user_profiles on auth.users;
create trigger auth_user_profiles
  after insert on auth.users
  for each row
  execute procedure public.handle_new_auth_user_profiles();

-- Notes:
-- - This function uses both raw_user_meta_data and user_metadata fields from auth.users.
-- - If the client includes { data: { enrollment_status: 'faculty' } } in the signUp options,
--   it will be available under raw_user_meta_data->>'enrollment_status' and will be used.
-- - The on conflict update tries to preserve an existing profiles.name and enrollment_status
--   if already set; adjust to your desired merge semantics.

