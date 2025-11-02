-- Create tables for faculty common room
create table if not exists public.faculty_posts (
    id bigint primary key generated always as identity,
    author_id uuid references public.profiles(id) not null,
    title text not null,
    content text not null,
    attachments jsonb[], -- Store file URLs and metadata
    pinned boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    -- Add a check constraint to ensure only faculty can post
    constraint faculty_posts_author_check check (
        exists (
            select 1 from public.profiles 
            where profiles.id = author_id 
            and profiles.enrollment_status = 'faculty'
        )
    )
);

create table if not exists public.faculty_post_reactions (
    id bigint primary key generated always as identity,
    post_id bigint references public.faculty_posts(id) on delete cascade,
    user_id uuid references public.profiles(id) not null,
    reaction_type text not null check (reaction_type in ('like', 'heart', 'celebrate', 'insightful', 'support')),
    created_at timestamptz default now(),
    -- Ensure unique reaction per user per post
    unique(post_id, user_id, reaction_type)
);

create table if not exists public.faculty_post_comments (
    id bigint primary key generated always as identity,
    post_id bigint references public.faculty_posts(id) on delete cascade,
    author_id uuid references public.profiles(id) not null,
    content text not null,
    parent_id bigint references public.faculty_post_comments(id) on delete cascade,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    -- Add a check constraint to ensure only faculty can comment
    constraint faculty_comments_author_check check (
        exists (
            select 1 from public.profiles 
            where profiles.id = author_id 
            and profiles.enrollment_status = 'faculty'
        )
    )
);

-- Add indexes for performance
create index if not exists faculty_posts_author_id_idx on public.faculty_posts(author_id);
create index if not exists faculty_posts_created_at_idx on public.faculty_posts(created_at desc);
create index if not exists faculty_post_reactions_post_id_idx on public.faculty_post_reactions(post_id);
create index if not exists faculty_post_comments_post_id_idx on public.faculty_post_comments(post_id);
create index if not exists faculty_post_comments_parent_id_idx on public.faculty_post_comments(parent_id);

-- Create trigger to update updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger set_timestamp_faculty_posts
    before update on public.faculty_posts
    for each row
    execute procedure public.handle_updated_at();

create trigger set_timestamp_faculty_comments
    before update on public.faculty_post_comments
    for each row
    execute procedure public.handle_updated_at();

-- Row Level Security (RLS)
-- Enable RLS
alter table public.faculty_posts enable row level security;
alter table public.faculty_post_reactions enable row level security;
alter table public.faculty_post_comments enable row level security;

-- Posts policies
create policy "Only faculty can view posts"
    on public.faculty_posts for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Only faculty can insert posts"
    on public.faculty_posts for insert
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Faculty can update their own posts"
    on public.faculty_posts for update
    using (author_id = auth.uid())
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Faculty can delete their own posts"
    on public.faculty_posts for delete
    using (author_id = auth.uid());

-- Reactions policies
create policy "Only faculty can view reactions"
    on public.faculty_post_reactions for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Only faculty can insert reactions"
    on public.faculty_post_reactions for insert
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Faculty can delete their own reactions"
    on public.faculty_post_reactions for delete
    using (user_id = auth.uid());

-- Comments policies
create policy "Only faculty can view comments"
    on public.faculty_post_comments for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Only faculty can insert comments"
    on public.faculty_post_comments for insert
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Faculty can update their own comments"
    on public.faculty_post_comments for update
    using (author_id = auth.uid())
    with check (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid()
            and profiles.enrollment_status = 'faculty'
        )
    );

create policy "Faculty can delete their own comments"
    on public.faculty_post_comments for delete
    using (author_id = auth.uid());

-- Helper function to get reaction counts
create or replace function public.get_faculty_post_reaction_counts(post_id bigint)
returns jsonb
language sql
stable
as $$
    select jsonb_object_agg(reaction_type, count)
    from (
        select reaction_type, count(*)::int as count
        from public.faculty_post_reactions
        where post_id = $1
        group by reaction_type
    ) counts;
$$;

-- Helper function to check if a user has reacted
create or replace function public.has_faculty_reacted(post_id bigint, user_id uuid)
returns jsonb
language sql
stable
as $$
    select jsonb_object_agg(reaction_type, true)
    from public.faculty_post_reactions
    where post_id = $1 and user_id = $2;
$$;