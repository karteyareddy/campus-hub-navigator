-- Create a table for Previous Year Questions
create table if not exists previous_year_questions (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  subject text not null,
  year integer not null,
  regulation text not null,
  exam_type text not null,
  file_url text not null,
  file_name text not null,
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table previous_year_questions enable row level security;

-- Create policies
create policy "Public can view PYQs"
  on previous_year_questions for select
  to public
  using (true);

create policy "Authenticated users can upload PYQs"
  on previous_year_questions for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create a storage bucket for PYQ documents
insert into storage.buckets (id, name, public)
values ('pyq-documents', 'pyq-documents', true);

-- Storage policies
create policy "Public can view PYQ documents"
  on storage.objects for select
  to public
  using ( bucket_id = 'pyq-documents' );

create policy "Authenticated users can upload PYQ documents"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'pyq-documents' AND auth.uid() = owner );
