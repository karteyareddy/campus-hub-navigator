# Campus Hub Navigator

A campus companion web app for students, teachers and admins: timetables, free classrooms, professors, study materials, previous-year question papers and a topic heatmap, all backed by Supabase.

## Features

- **Role-based login** (student / teacher / admin) with Supabase Auth, password reset and profile rows guarded by row-level security.
- **Timetable and free periods**: see today's schedule and which classrooms are free right now.
- **Classrooms and professors** directory with building and room lookup.
- **Study materials and previous-year questions** uploaded by teachers, browsable by subject.
- **Topic heatmap** that shows which topics appear most in past papers.
- **Admin panel** for managing users, rooms and content.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · shadcn/ui (Radix) · React Hook Form + Zod · TanStack Query · Supabase (Postgres, Auth, RLS)

## Run locally

```bash
npm install
cp .env.example .env     # VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
npm run dev              # http://localhost:8080
```

Create a Supabase project and run `supabase_setup.sql`, then `fix_admin_role.sql`, in the SQL editor. Promote your own account to `admin` in the `profiles` table to reach the admin pages.

## Layout

```
src/pages/        Dashboard, Timetable, FreePeriods, Classrooms, Professors,
                  StudyMaterials, PreviousYearQuestions, TopicHeatmap, admin/
src/integrations/ Supabase client and generated types
src/components/   shadcn/ui primitives and app components
supabase/         local config
```

Originally scaffolded with Lovable; deployed on Vercel.
