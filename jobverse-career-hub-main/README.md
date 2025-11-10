# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d4608848-ee05-4f90-b58c-ea03c3855286

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d4608848-ee05-4f90-b58c-ea03c3855286) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d4608848-ee05-4f90-b58c-ea03c3855286) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Backend (Supabase Edge Functions)

This project includes serverless Edge Functions under the `supabase/functions/` folder:

- `analyze-resume` — analyzes uploaded resumes and returns a JSON analysis (score, strengths, improvements)
- `generate-resume` — generates a structured resume JSON from a prompt
- `interview-coach` — chat-based interview coaching endpoint

These functions are implemented for Deno (Supabase Edge Functions) and call the Lovable AI gateway. They expect a secret named `LOVABLE_API_KEY` to be available in the environment (or configured in your Supabase project secrets).

Local setup & running functions
1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Log in and start the local environment:

```powershell
supabase login
supabase init # if you haven't initialized locally
supabase start
```

3. Set local environment variables for functions. You can copy `.env.example` to `.env` and fill values. Make sure to set `LOVABLE_API_KEY` for AI requests.

4. Run functions locally (from repo root):

```powershell
cd supabase/functions
supabase functions serve analyze-resume --env-file ../../.env
```

Repeat for `generate-resume` and `interview-coach` as needed.

Deploying to Supabase

1. Add the `LOVABLE_API_KEY` secret to your Supabase project: Project Settings -> API -> Environment Variables or use the CLI:

```powershell
supabase secrets set LOVABLE_API_KEY="your-real-key"
```

2. Deploy functions:

```powershell
supabase functions deploy analyze-resume --project-ref <your-ref>
supabase functions deploy generate-resume --project-ref <your-ref>
supabase functions deploy interview-coach --project-ref <your-ref>
```

Notes and security
- Do NOT commit real secret keys to the repository. Use `.env` locally and Supabase secrets in production.
- The frontend uses the Supabase JS client to invoke functions by name (see `src/pages/*`).
- The Edge Functions in `supabase/functions/*` already include CORS headers to allow the frontend to call them.

If you'd like, I can add small helper scripts to `package.json` to make local serving and deployment easier.
