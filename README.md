# Backstage website

Production website and content-management system for Backstage, an Indian talent-management company built for the creator economy.

The public site and admin CMS both use the Next.js App Router. Supabase is the source of truth for creators, website content, enquiries, and admin authentication. Creator media is stored in Supabase Storage.

## Local setup

1. Install [Node.js 20.9+](https://nodejs.org/).
2. Clone this repository and install dependencies:

```bash
npm install
```

3. Copy the environment template and add your Supabase values:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin routes live under `/admin`.

## Environment variables

| Variable | Scope | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Supabase publishable key for browser and cookie session clients |

`.env.local` is ignored by Git. Do not commit secrets.

## Supabase connection

1. Open the existing Supabase project.
2. In **Project Settings → API Keys**, copy the project URL and publishable key into `.env.local`.
3. Confirm Auth redirect URLs include:

   - `http://localhost:3000/auth/callback`
   - `https://<your-production-domain>/auth/callback`

4. Generate types if the schema changes:

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

Row Level Security must protect all tables. Public reads (published creators, public settings) and enquiry inserts are allowed only through RLS policies. Admin reads and writes use the signed-in user's session and must also be allowed by RLS for `admin` and `editor` profiles.

Creator media belongs in the `creator-media` Storage bucket. Storage policies must prevent unauthenticated writes.

## Admin setup

1. Enable email/password in **Authentication → Providers**. Do not enable public sign-up in this app.
2. Create staff users in the Supabase dashboard.
3. Insert a matching `profiles` row with `role` set to `admin` or `editor`. Users without that record are denied access to `/admin`.
4. Sign in at `/admin/login` with email and password. Session refresh and route protection run in `src/proxy.ts`. `requireAdmin()` repeats the same checks in Server Components and data helpers.
5. `/admin/login` is public. Every other `/admin` route requires a valid session and an active staff profile.

## Roster import

The public roster is imported from a local spreadsheet. The source file is gitignored.

1. Place the workbook at `data/backstage-roster.xlsx`. Do not commit it.
2. Expected columns: `Creator Name`, `Links`, `TM`, `Content Note`.
3. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` for database comparison and import. The app never uses this key in browser code.

Dry-run (default, no writes):

```bash
npm run import-roster:dry-run
```

Import drafts:

```bash
npm run import-roster -- --import
```

Re-import mapped fields onto records that were edited in the CMS:

```bash
npm run import-roster -- --import --overwrite
```

Mapping: name → `display_name`, Links → `instagram_url`, TM → `manager_name`, Content Note → `full_bio` / `short_bio`. Slugs are derived from names. Rows upsert on `slug`. Missing categories become `Needs classification`. Follower counts, city, YouTube, and categories are never invented. Existing CMS-edited rows are skipped unless `--overwrite` is set.

## Development

```bash
npm run dev
npm run lint
npm run build
```

Use Server Components by default. Add Client Components only for forms, motion, or other browser interaction. Data access lives in `src/lib/data/` and talks to Supabase — do not add mock APIs, mock auth, or `localStorage` persistence.

The public visual identity lives in `src/app/globals.css` and `src/components/`. See [docs/design-system.md](docs/design-system.md) for tokens, type, and component usage.

## Deployment

1. Host the Next.js app on Vercel (or another Node.js 20.9+ host).
2. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in the hosting dashboard.
3. Add the production `/auth/callback` URL in the Supabase Auth redirect allow list.
4. Run `npm run lint` and `npm run build` in CI before promoting a release.
