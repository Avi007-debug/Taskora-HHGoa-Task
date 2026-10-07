-- ==============================================================================
-- Taskora — Supabase Database Schema & Production SQL Queries
-- ==============================================================================
-- This script contains:
-- 1. Table Definitions for tasks and focus_sessions
-- 2. Indexes for high performance
-- 3. Row Level Security (RLS) configuration & access policies
-- 4. Automatic timestamp triggers
-- 5. Complete CRUD & Analytics queries ready for execution
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- ==============================================================================
-- 2. TABLES DEFINITIONS
-- ==============================================================================

-- 2.1 Tasks Table (Person 1 Module)
create table if not exists public.tasks (
  id text primary key, -- Supports frontend string ID or gen_random_uuid()::text
  title text not null check (char_length(trim(title)) > 0),
  description text default '',
  priority text not null check (priority in ('low', 'medium', 'high')),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade default null -- Nullable for public/demo use
);

-- 2.2 Focus Sessions Table (Person 2 Module)
create table if not exists public.focus_sessions (
  id text primary key,
  duration integer not null default 25 check (duration > 0), -- Duration in minutes
  completed_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete cascade default null
);

-- ==============================================================================
-- 3. INDEXES FOR HIGH-VELOCITY QUERIES
-- ==============================================================================
create index if not exists idx_tasks_created_at on public.tasks (created_at desc);
create index if not exists idx_tasks_completed on public.tasks (completed);
create index if not exists idx_tasks_priority on public.tasks (priority);
create index if not exists idx_tasks_user_id on public.tasks (user_id);
create index if not exists idx_sessions_completed_at on public.focus_sessions (completed_at desc);
create index if not exists idx_sessions_user_id on public.focus_sessions (user_id);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
alter table public.tasks enable row level security;
alter table public.focus_sessions enable row level security;

-- Option A: Development / Demo Policy (Allows anon read & write)
create policy "Allow public access to tasks"
  on public.tasks
  for all
  to anon, authenticated
  using (true)
  with check (true);

create policy "Allow public access to focus_sessions"
  on public.focus_sessions
  for all
  to anon, authenticated
  using (true)
  with check (true);

-- Option B (Production with Auth): User-scoped isolation policy
-- (Uncomment when user authentication is enabled)
/*
create policy "Users can manage their own tasks"
  on public.tasks
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own focus sessions"
  on public.focus_sessions
  for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
*/

-- ==============================================================================
-- 5. AUTOMATIC UPDATED_AT TRIGGER
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_tasks_updated_at on public.tasks;
create trigger set_tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

-- ==============================================================================
-- 6. SAMPLE CRUD QUERIES
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 6.1 PERSON 1: TASK MANAGER QUERIES
-- ------------------------------------------------------------------------------

-- Query 1: Fetch all tasks (latest first)
select id, title, description, priority, completed, created_at
from public.tasks
order by created_at desc;

-- Query 2: Fetch tasks with status & priority filters
-- (e.g., Active tasks with High priority)
select id, title, description, priority, completed, created_at
from public.tasks
where completed = false
  and priority = 'high'
order by created_at desc;

-- Query 3: Search tasks by title or keyword
select id, title, description, priority, completed, created_at
from public.tasks
where title ilike '%meeting%' or description ilike '%meeting%'
order by created_at desc;

-- Query 4: Insert a new task
insert into public.tasks (id, title, description, priority, completed, created_at)
values (
  'task_' || substr(md5(random()::text), 1, 8),
  'Prepare GDG presentation with Wispr Flow',
  'Draft speaker slides and practice voice dictation demo.',
  'high',
  false,
  now()
)
returning *;

-- Query 5: Update a task's title, description, and priority
update public.tasks
set 
  title = 'Updated Task Title',
  description = 'Updated description details',
  priority = 'medium'
where id = 'YOUR_TASK_ID'
returning *;

-- Query 6: Toggle task completion status
update public.tasks
set completed = not completed
where id = 'YOUR_TASK_ID'
returning id, title, completed;

-- Query 7: Delete a task
delete from public.tasks
where id = 'YOUR_TASK_ID';

-- Query 8: Clear all completed tasks (Bulk Delete)
delete from public.tasks
where completed = true;


-- ------------------------------------------------------------------------------
-- 6.2 PERSON 2: FOCUS TIMER QUERIES
-- ------------------------------------------------------------------------------

-- Query 9: Record a completed focus session (25 minutes)
insert into public.focus_sessions (id, duration, completed_at)
values (
  'session_' || substr(md5(random()::text), 1, 8),
  25,
  now()
)
returning *;

-- Query 10: Fetch recent focus sessions
select id, duration, completed_at
from public.focus_sessions
order by completed_at desc
limit 10;

-- Query 11: Get today's total focus minutes
select 
  coalesce(sum(duration), 0) as total_focus_minutes,
  count(id) as total_sessions
from public.focus_sessions
where completed_at >= current_date;


-- ------------------------------------------------------------------------------
-- 6.3 PERSON 3: PRODUCTIVITY DASHBOARD ANALYTICS QUERY
-- ------------------------------------------------------------------------------

-- Query 12: Unified Analytics Summary (One-shot statistics fetch)
select 
  (select count(*) from public.tasks) as total_tasks,
  (select count(*) from public.tasks where completed = true) as completed_tasks,
  (select count(*) from public.tasks where completed = false) as pending_tasks,
  case 
    when (select count(*) from public.tasks) = 0 then 0
    else round(((select count(*) from public.tasks where completed = true)::decimal / (select count(*) from public.tasks)::decimal) * 100)
  end as completion_rate,
  (select count(*) from public.focus_sessions) as total_focus_sessions,
  (select coalesce(sum(duration), 0) from public.focus_sessions) as total_focus_minutes;
