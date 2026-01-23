-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table to handle user roles and extra data
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  full_name text,
  role text default 'student' check (role in ('student', 'teacher', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create classrooms table
create table if not exists public.classrooms (
  id uuid default uuid_generate_v4() primary key,
  room_no text not null,
  building text not null,
  capacity int not null,
  type text not null,
  amenities text[] default '{}',
  is_available boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on classrooms
alter table public.classrooms enable row level security;

-- Policies for classrooms
-- Everyone can read
create policy "Classrooms are viewable by everyone." on public.classrooms
  for select using (true);

-- Only admins can insert/update/delete
create policy "Admins can insert classrooms." on public.classrooms
  for insert with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update classrooms." on public.classrooms
  for update using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete classrooms." on public.classrooms
  for delete using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Trigger to create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'student') 
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA for Classrooms (Migrating from static file)
insert into public.classrooms (room_no, building, capacity, type, amenities, is_available) values
('CS-101', 'Block A', 60, 'Lecture Hall', ARRAY['projector', 'wifi', 'ac'], true),
('CS-102', 'Block A', 60, 'Lecture Hall', ARRAY['projector', 'wifi', 'ac'], false),
('CS-201', 'Block A', 45, 'Lecture Hall', ARRAY['projector', 'wifi'], true),
('CS-202', 'Block A', 45, 'Lecture Hall', ARRAY['wifi'], true),
('Lab-1', 'Block B', 40, 'Computer Lab', ARRAY['computers', 'projector', 'wifi', 'ac'], false),
('Lab-2', 'Block B', 40, 'Computer Lab', ARRAY['computers', 'projector', 'wifi', 'ac'], true),
('Lab-3', 'Block B', 35, 'Computer Lab', ARRAY['computers', 'wifi'], true),
('Seminar Hall', 'Block C', 150, 'Seminar Hall', ARRAY['projector', 'wifi', 'ac', 'mic'], false),
('CS-301', 'Block A', 50, 'Lecture Hall', ARRAY['projector', 'wifi', 'ac'], true),
('CS-401', 'Block A', 40, 'Lecture Hall', ARRAY['projector', 'wifi'], true);


-- ---------------------------------------------------------
-- HELPER: Run this command to make yourself an admin
-- Replace 'your_email@klu.ac.in' with your actual email
-- ---------------------------------------------------------
-- update public.profiles
-- set role = 'admin'
-- where email = 'your_email@klu.ac.in';
