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

## Link a Supabase project

This repo ships a canonical schema in `supabase/migrations/`. The live database already has tables and data; the migration is written to add missing pieces without deleting or overwriting rows.

1. Install the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) (or use `npx supabase`).
2. From the repo root, link the CLI to your existing project. Use the project ref from the Supabase dashboard; do not commit tokens or refs:

```bash
npx supabase login
npx supabase link --project-ref <project-ref>
```

3. Confirm Auth redirect URLs include:

   - `http://localhost:3000/auth/callback`
   - `https://<your-production-domain>/auth/callback`

4. Put the project URL and publishable key in `.env.local`. Never commit that file.

## Preview and apply migrations

Always preview before applying. The canonical migration is idempotent and data-preserving, but a dry run is still required on a database that already holds creators.

```bash
npx supabase db push --dry-run
```

Read the planned SQL. Confirm it does not drop tables, truncate, or delete rows. Then apply:

```bash
npx supabase db push
```

`db push` records the migration in `supabase_migrations.schema_migrations` so later runs skip it. Re-running the SQL by hand is still safe: statements use `IF NOT EXISTS` / `CREATE OR REPLACE` / `ON CONFLICT DO NOTHING`.

After a schema change, regenerate types if you need a fresh dump:

```bash
npx supabase gen types typescript --linked > src/types/database.ts
```

Review the generated file before committing. This app types the live text + CHECK constraint model; do not introduce Postgres enums.

## First auth user and profile

The app does not create staff profiles. Public sign-up is not part of this website.

1. In **Authentication → Providers**, enable email/password. Do not enable public sign-up for production.
2. Create a staff user in **Authentication → Users**.
3. Copy that user's UUID. Insert a matching `profiles` row in the SQL editor. `profiles` has no `email` column — email lives on `auth.users` only.

```sql
insert into public.profiles (id, full_name, role, is_active)
values (
  '<auth-user-uuid>',
  'Staff name',
  'admin',
  true
);
```

`role` must be `admin` or `editor`. `is_active` must be `true`. Users without that row, or with `is_active = false`, are denied `/admin`.

Sign in at `/admin/login`. Session refresh and route protection run in `src/proxy.ts`. `requireAdmin()` repeats the same checks in Server Components and data helpers. `/admin/login` is public. Every other `/admin` route requires a valid session and an active staff profile.

Row Level Security protects all tables. Anonymous clients can read published creators and public site settings, and insert enquiries with status `new`. Admin reads and writes use the signed-in session and must pass `is_backstage_admin()`.

Creator media belongs in the `creator-media` Storage bucket. The migration makes that bucket public for reads and restricts writes to active admin/editor profiles.

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

Mapping: name → `display_name`, Links → `instagram_url` / `instagram_handle`, TM → `manager_name`, Content Note → `full_bio` / `short_bio`. Slugs are derived from names. Rows upsert on `slug`. Missing categories become `Needs classification`. Follower counts, city, YouTube, and categories are never invented. Existing CMS-edited rows are skipped unless `--overwrite` is set. TikTok, X/Twitter, LinkedIn, and other secondary URLs belong in `creators.other_social_links`.

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
