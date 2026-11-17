# P.K. Auto Deals — GitHub-ready website

A responsive React + Vite + TypeScript dealership website with inventory search/filtering, EMI calculator, enquiry forms, Supabase-backed admin, image uploads, and SQL setup.

## 1. Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

The public site works in demo mode without Supabase. Demo inventory is clearly marked as illustrative. Enquiry forms fall back to WhatsApp when Supabase is not configured.

## 2. Connect Supabase (required for live admin and lead storage)

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In **Project Settings → API**, copy the Project URL and anon/public key into `.env.local`.
4. Create a Storage bucket named `vehicle-images` (the SQL also documents the intended bucket policies).
5. In Supabase **Authentication → Users**, create an admin user. Do not expose the service-role key.
6. In Storage, set the `vehicle-images` bucket to public so published vehicle photos can be displayed. Restrict writes to authenticated users using the SQL policies.
7. Restart `npm run dev`.

Admin URL: `/admin`. Sign in with the Supabase user you created.

## 3. Deploy to Vercel

- Push this project to GitHub.
- Import the repository in Vercel.
- Framework preset: Vite.
- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in Vercel Project → Settings → Environment Variables.
- Redeploy after adding environment variables.

## 4. Vehicle images — important

Every model has a dedicated local SVG placeholder in `public/vehicles/`. These placeholders intentionally identify the exact model and say that a verified image is required. The project does **not** substitute an unrelated car photograph.

Before launch, upload real, licensed dealership photographs through `/admin` and assign them to the matching vehicle. Do not use manufacturer images unless you have permission. The admin image picker previews the chosen file before saving.

## 5. Demo data and publishing

The included vehicle records and sample prices/specifications are demonstration data, not actual P.K. Auto Deals stock. The inventory section visibly labels demo listings. Replace them with verified stock in Supabase before removing the demo notice.

The 100+ inspection-points statistic is intentionally omitted because it requires business confirmation. The inspection section describes categories, not a claim that a specific car has been inspected.

## 6. Security notes

- Only the Supabase anon key belongs in frontend environment variables.
- Never add the Supabase service-role key to Vite variables.
- RLS policies in `supabase/schema.sql` restrict inventory writes and lead reads/updates/deletes to authenticated users.
- For a production deployment, create admin users only through the Supabase dashboard and consider enabling MFA.
- Add a CAPTCHA provider before running high-volume public campaigns. Basic honeypot and validation are included, but they are not a substitute for CAPTCHA.

## Included

- Premium responsive public website
- Inventory filters, search and sorting
- Model-specific image placeholders
- EMI calculator
- WhatsApp, phone, directions and Instagram links
- Test-drive and general enquiry forms
- Supabase authentication and admin dashboard
- Inventory create/edit/delete and photo upload
- Lead management
- Database schema and RLS policies
