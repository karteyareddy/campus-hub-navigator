-- Create a table for Study Materials
create table if not exists study_materials (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  subject text not null,
  unit integer not null,
  type text not null,
  file_url text not null,
  file_name text not null,
  user_id uuid references auth.users not null
);

-- Enable RLS
alter table study_materials enable row level security;

-- Create policies
create policy "Public can view Study Materials"
  on study_materials for select
  to public
  using (true);

create policy "Authenticated users can upload Study Materials"
  on study_materials for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Create a storage bucket for Study Materials
insert into storage.buckets (id, name, public)
values ('study-materials', 'study-materials', true);

-- Storage policies
create policy "Public can view Study Material documents"
  on storage.objects for select
  to public
  using ( bucket_id = 'study-materials' );

create policy "Authenticated users can upload Study Material documents"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'study-materials' AND auth.uid() = owner );
