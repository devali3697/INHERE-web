# INHERE Hội An Photography Studio

Complete editable source code for the INHERE Hội An photography studio website and its admin CMS.

## Technology

- React 19 and TypeScript
- Vinext / Vite
- CSS and Tailwind CSS
- Supabase Authentication, PostgreSQL, Storage, and Realtime
- Node.js 22+

## Features

- Responsive bilingual studio website
- Portfolio, albums, services, blog, testimonials, and contact sections
- Instagram Reels section managed through Reel links
- Secure admin login
- Admin content management
- Supabase database migrations and Row Level Security policies
- English and Vietnamese content support

## Requirements

- Node.js 22.13.0 or newer
- npm
- A Supabase project

## Local Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/devali3697/INHERE-web.git
   cd INHERE-web
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the local environment file:

   ```bash
   cp .env.example .env.local
   ```

   On Windows, copy `.env.example` manually and rename the copy to `.env.local`.

4. Add your Supabase values to `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```

5. Start the development server:

   ```bash
   npm run dev
   ```

6. Open the local URL shown in the terminal. The admin panel is available at `/admin`.

## Supabase Setup

1. Create or open the Supabase project that will own the website data.
2. Open **SQL Editor** in the Supabase dashboard.
3. Run the SQL migrations from the repository's `supabase/` directory.
4. In **Authentication → URL Configuration**, set the production Site URL and add the production callback/redirect URLs.
5. Create the admin authentication user.
6. Configure the database admin identity and Row Level Security policies using the included migrations.
7. Add the Supabase project URL and publishable key to the hosting environment variables.

Run migrations in their intended sequence. Review each SQL file before applying it to an existing database.

## Build and Validation

Create a production build:

```bash
npm run build
```

Run the project checks:

```bash
npm test
```

Start the built application:

```bash
npm run start
```

## Deployment

The application requires a Node.js-compatible deployment environment and these environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

For Hostinger, choose a plan that supports Node.js applications or deploy through a compatible VPS. Configure the Node.js version, environment variables, install command, build command, and start command in the hosting panel.

Typical commands:

```text
Install: npm ci
Build: npm run build
Start: npm run start
```

After deployment, update Supabase Authentication URL Configuration with the live domain.

## Security

- The publishable Supabase key is intended for browser clients and must be protected by correct Row Level Security policies.
- Never commit a Supabase service-role key, database password, access token, or user password.
- Keep production secrets in the hosting provider's environment-variable settings.
- Review Row Level Security policies before connecting a new Supabase project.

## Project Ownership

The repository contains the editable application source, assets, package lockfile, build configuration, and Supabase SQL migrations. Live Supabase database rows, Authentication users, and uploaded Storage objects belong to the connected Supabase project and must be exported separately when transferring live data.
