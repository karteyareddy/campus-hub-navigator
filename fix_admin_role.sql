-- 1. Backfill profiles for existing users who might have signed up before the table existed
insert into public.profiles (id, email, full_name, role)
select 
  id, 
  email, 
  raw_user_meta_data->>'full_name',
  coalesce(raw_user_meta_data->>'role', 'student')
from auth.users
where id not in (select id from public.profiles);

-- 2. Update the specific user to be an admin
-- REPLACE 'your_email@klu.ac.in' with your actual email address!
update public.profiles
set role = 'admin'
where email = 'your_email@klu.ac.in';

-- 3. Verify the update
select * from public.profiles where role = 'admin';
