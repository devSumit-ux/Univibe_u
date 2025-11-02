-- Function to handle user login events
create or replace function public.handle_user_login()
returns trigger as $$
begin
  insert into user_logins (
    user_id,
    login_timestamp,
    ip_address,
    user_agent
  ) values (
    new.id,
    now(),
    nullif(current_setting('request.headers', true)::json->>'x-forwarded-for', ''),
    nullif(current_setting('request.headers', true)::json->>'user-agent', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create login tracking table if it doesn't exist
create table if not exists public.user_logins (
  id bigint primary key generated always as identity,
  user_id uuid references auth.users(id) on delete cascade,
  login_timestamp timestamptz not null default now(),
  ip_address text,
  user_agent text
);

-- Create RLS policy for user_logins
alter table public.user_logins enable row level security;

create policy "Users can only see their own logins"
  on public.user_logins for select
  using (auth.uid() = user_id);

-- Drop any existing trigger then create it
drop trigger if exists on_auth_user_login on auth.users;
create trigger on_auth_user_login
  after update of last_sign_in_at on auth.users
  for each row
  when (old.last_sign_in_at is distinct from new.last_sign_in_at)
  execute procedure public.handle_user_login();

-- Grant necessary permissions
grant select, insert on public.user_logins to authenticated;
grant usage on sequence public.user_logins_id_seq to authenticated;