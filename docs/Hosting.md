# DeepDive — Hosting on Vercel

This guide walks through deploying DeepDive to Vercel from scratch and operating the live deployment afterward. The application is a static client-side SPA (Vite + React + TypeScript) with no backend, no environment variables, and no database. Every piece of user data lives in `localStorage` on the user's machine. That makes Vercel's free Hobby tier more than sufficient.

This document complements `Project_Specification.md` (§26 Deployment) and `Build_Tracker.md` (Phase G).

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Configuration Summary](#2-project-configuration-summary)
3. [Vercel Account Setup](#3-vercel-account-setup)
4. [Importing the Repository](#4-importing-the-repository)
5. [Build & Output Configuration](#5-build--output-configuration)
6. [Environment Variables](#6-environment-variables)
7. [First Deployment](#7-first-deployment)
8. [Post-Deploy Verification Checklist](#8-post-deploy-verification-checklist)
9. [Custom Domain Setup](#9-custom-domain-setup)
10. [Continuous Deployment](#10-continuous-deployment)
11. [Preview Deployments for Pull Requests](#11-preview-deployments-for-pull-requests)
12. [Vercel CLI (Optional)](#12-vercel-cli-optional)
13. [Local Production Preview](#13-local-production-preview)
14. [Updating the Live Site](#14-updating-the-live-site)
15. [Rolling Back](#15-rolling-back)
16. [Performance Tuning](#16-performance-tuning)
17. [Auto-Backup Behaviour in Production](#17-auto-backup-behaviour-in-production)
18. [Troubleshooting](#18-troubleshooting)
19. [Costs and Quotas](#19-costs-and-quotas)
20. [Removing the Deployment](#20-removing-the-deployment)

---

## 1. Prerequisites

Before you start, make sure you have:

- **A Vercel account.** Sign up at <https://vercel.com> with your GitHub account so the integration can read your repos. The free Hobby tier is sufficient for DeepDive.
- **A GitHub repository for DeepDive.** This guide assumes the repo is `mrnmyd/deep-dive-client` on GitHub and the `main` branch holds the production code.
- **A working local build.** Run `npm install && npm run build` once locally to confirm the project builds cleanly before pointing Vercel at it.
- **Optional but recommended:** a custom domain, if you want to publish at something nicer than `*.vercel.app`.

You do not need a Vercel CLI install for the standard flow. The CLI is covered in §12 as an optional path.

---

## 2. Project Configuration Summary

Vercel will auto-detect the framework, but it's worth knowing what it will do:

| Setting          | Value                                                                | Source                                            |
| ---------------- | -------------------------------------------------------------------- | ------------------------------------------------- |
| Framework Preset | Vite                                                                 | Detected from `package.json` and `vite.config.ts` |
| Install Command  | `npm install`                                                        | Default                                           |
| Build Command    | `npm run build`                                                      | Default for Vite                                  |
| Output Directory | `dist`                                                               | Vite's default                                    |
| Node.js Version  | 20.x (or current default)                                            | Vercel default; can be pinned                     |
| Routing          | SPA rewrite                                                          | `vercel.json`                                     |
| Asset caching    | `Cache-Control: public, max-age=31536000, immutable` for `/assets/*` | `vercel.json`                                     |
| SVG caching      | `Cache-Control: public, max-age=86400`                               | `vercel.json`                                     |

The `vercel.json` at the repo root looks like this:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/(.*)\\.svg",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=86400" }]
    }
  ]
}
```

The SPA rewrite is critical: it sends every unmatched URL back to `index.html` so client-side React Router can handle deep links (`/dashboard`, `/problems`, `/?topic=topic_arrays_kadane`, etc.). Without it, refreshing the page on a non-root route returns a 404 from Vercel.

---

## 3. Vercel Account Setup

1. Open <https://vercel.com> and click **Sign Up** (or **Log In** if you already have an account).
2. Choose **Continue with GitHub** and complete the OAuth flow.
3. Authorize the Vercel GitHub App for the account that owns `deep-dive-client`. If you only want Vercel to see one repo, choose **Only select repositories** during the install and pick `deep-dive-client`. You can change this later under your GitHub Settings → Applications → Vercel.
4. Once you land in the Vercel dashboard, leave it open for the next step.

---

## 4. Importing the Repository

1. In the Vercel dashboard, click **Add New… → Project**.
2. Vercel lists the repositories its GitHub App can see. Find `deep-dive-client` and click **Import** beside it.
3. If the repo is not listed:
   - Click **Adjust GitHub App Permissions**.
   - In the GitHub permissions page, grant Vercel access to the repository.
   - Return to Vercel and refresh.

When the project page loads, Vercel will auto-detect:

- **Framework Preset:** Vite
- **Root Directory:** `./` (leave blank)
- **Build & Output Settings:** auto-filled and correct

You should not need to override any of these for DeepDive.

---

## 5. Build & Output Configuration

Verify the auto-detected settings before deploying. Click each row to confirm or override:

| Field            | Recommended value               |
| ---------------- | ------------------------------- |
| Framework Preset | Vite                            |
| Build Command    | leave default (`npm run build`) |
| Output Directory | leave default (`dist`)          |
| Install Command  | leave default (`npm install`)   |
| Root Directory   | leave default (`.`)             |
| Node.js Version  | 20.x (Vercel default)           |

If you want to pin Node, set `engines.node` in `package.json`. Skip unless Vercel's default starts breaking your build.

---

## 6. Environment Variables

DeepDive has zero runtime environment variables. The build does not depend on any. Leave the Environment Variables section empty.

If you ever add features that need secrets (analytics IDs, third-party APIs), add them under **Project Settings → Environment Variables** with the appropriate scope (Production / Preview / Development). Always prefix variables intended to reach the browser bundle with `VITE_` so Vite exposes them.

---

## 7. First Deployment

1. With the import screen still open, click **Deploy**.
2. Vercel runs `npm install` then `npm run build`. Expect build times in the 30 – 90 second range for a clean cache; subsequent builds are usually faster.
3. When the build finishes, Vercel shows a green deploy summary with three URLs:
   - **Production:** `https://<project>.vercel.app` — this is the canonical URL.
   - **Branch alias:** `https://<project>-git-main-<scope>.vercel.app` — always points at `main`.
   - **Deployment alias:** `https://<project>-<hash>.vercel.app` — pinned to this exact build.
4. Click any of the URLs to load DeepDive.

You should see the onboarding modal on first visit. Walk through name → daily goal → focus paper. After that, the Reader opens.

---

## 8. Post-Deploy Verification Checklist

Run through this list on the production URL before declaring the deploy stable.

**Reader and content**

- [ ] `/` opens the Reader with a topic loaded.
- [ ] Clicking a topic in the syllabus tree updates the URL `?topic=...` and renders the markdown.
- [ ] Browser refresh on `/?topic=topic_arrays_kadane` returns the same topic (SPA rewrite working).
- [ ] Mark Done, Mark for Review, and Prev / Next all behave.

**Routes**

- [ ] `/dashboard`, `/problems`, `/progress`, `/settings` all open without 404.
- [ ] `/study` and `/syllabus` redirect to `/`.

**Keyboard**

- [ ] `?` opens the keyboard help overlay.
- [ ] `Cmd+K` (or `Ctrl+K`) opens the command palette.
- [ ] `/` focuses the search input.
- [ ] `j` / `k` move between topics.

**Sessions and tracking**

- [ ] Start a session, study for two minutes, click Stop. The session-saved toast shows minutes.
- [ ] `/dashboard` reflects the streak and minutes for today.

**Data persistence**

- [ ] Reload the tab — Reader resumes the last topic.
- [ ] `/settings → Export data` downloads `preptracker_backup_YYYY-MM-DD.json`.
- [ ] `/settings → Import backup` restores from a file with no errors.
- [ ] `/settings → Reset progress` shows the confirmation dialog and clears state.

**Auto-backup (Chromium browsers only)**

- [ ] Open in Chrome, Edge, or Brave.
- [ ] `/settings → Pick backup folder` opens the OS folder picker.
- [ ] After picking a folder, the status pill cycles to "writing" and a JSON file appears in the folder.

**Mobile / responsive**

- [ ] Resize the window below 768px. Tree and rail collapse to drawer triggers in the top bar.
- [ ] Drawers open as side sheets and close cleanly.

**Theming**

- [ ] Toggle theme in the top bar — switches between dark and light without flicker.

**Errors**

- [ ] Open DevTools Console. There should be no red errors on initial load.
- [ ] No mixed-content warnings.
- [ ] No 404s in the network tab apart from intentional ones (e.g. favicon caching transitions).

---

## 9. Custom Domain Setup

The default `*.vercel.app` URL is fine for personal use. To attach a custom domain:

1. Open **Project Settings → Domains**.
2. Enter `yourdomain.com` (and optionally `www.yourdomain.com`) and click **Add**.
3. Vercel shows the DNS records you must configure at your registrar:
   - For an apex domain: an `A` record pointing to `76.76.21.21` (subject to change — always copy the value Vercel displays).
   - For a `www` subdomain: a `CNAME` record pointing to `cname.vercel-dns.com`.
4. Add those records at your DNS provider (Namecheap, Cloudflare, Route 53, etc.). Propagation usually takes a few minutes.
5. Vercel verifies the domain automatically and provisions a free TLS certificate via Let's Encrypt.

Once verified, you can decide which domain is the canonical one. Under **Domains**, mark the chosen domain as the **production** URL; the others will redirect to it.

---

## 10. Continuous Deployment

Vercel watches the `main` branch by default. Every push to `main` triggers a new production deployment. The flow looks like:

1. You push to `main` from your machine: `git push origin main`.
2. GitHub notifies Vercel via webhook.
3. Vercel queues the build, runs `npm install`, runs `npm run build`, and uploads `dist/` to its edge network.
4. The production URL is updated to point at the new deployment within a few seconds of the build finishing.

You do not need to do anything manual after the initial import. To pause continuous deployment, go to **Project Settings → Git** and disable the integration; re-enable when you want pushes to deploy again.

---

## 11. Preview Deployments for Pull Requests

Every non-`main` branch and every pull request gets a unique preview URL. Use this to dogfood changes without risking the production deploy.

The flow:

1. Create a feature branch: `git checkout -b feature/whatever`.
2. Push the branch: `git push -u origin feature/whatever`.
3. Open a PR against `main` on GitHub.
4. Vercel comments on the PR with a preview URL like `https://deep-dive-client-git-feature-whatever-<scope>.vercel.app`.
5. Click through the preview, run the post-deploy checklist on the new behaviour.
6. Merge the PR. The next push to `main` deploys to production.

Preview deployments use the same build config as production but run in isolated origins, so any localStorage data you create on a preview URL stays on that origin and does not collide with production.

---

## 12. Vercel CLI (Optional)

The dashboard flow is enough for most cases. If you want CLI control:

1. Install: `npm install -g vercel`.
2. Authenticate: `vercel login` (uses a magic link to your email or GitHub).
3. From the project root: `vercel link` to associate the directory with your Vercel project.
4. Common commands:
   - `vercel` — create a preview deployment of the current directory.
   - `vercel --prod` — deploy to production immediately, bypassing GitHub.
   - `vercel logs <deployment-url>` — fetch build and runtime logs.
   - `vercel env pull .env.local` — pull environment variables to a local file (DeepDive has none, so this is a no-op).

Use `vercel --prod` only when you need to push a fix without going through Git. The Git flow is the recommended path because it keeps the deployment provenance clean.

---

## 13. Local Production Preview

Before deploying changes, you can verify the production build locally:

```bash
npm run build
npm run preview
```

`vite preview` serves `dist/` at `http://localhost:4173`. This catches issues that only show up in the production bundle (lazy-loaded chunks, asset paths, service workers if you ever add one) without burning a Vercel deploy.

---

## 14. Updating the Live Site

The standard update flow:

1. Make your changes locally.
2. `npm run lint && npx tsc --noEmit && npm run build` — keep all three green before committing.
3. Commit on `main` (or merge a feature branch into `main`).
4. `git push origin main`.
5. Vercel rebuilds and replaces the production deployment automatically.

If the change is risky, branch + PR + preview is the safer path. Use the post-deploy checklist (§8) on the preview URL first.

---

## 15. Rolling Back

If a deploy goes bad:

1. Open the Vercel dashboard for the project.
2. Go to **Deployments**.
3. Find the last known-good deployment in the list.
4. Click the three-dot menu beside it and choose **Promote to Production**.

Vercel keeps every deployment forever (subject to plan limits), so you can revert to anything in history within seconds. Promotion does not change the underlying Git commit on `main`; it just retargets the production alias. If the underlying issue is in `main`, follow the promote with a real Git revert (`git revert <bad-commit>` then push) to keep the source of truth in sync.

---

## 16. Performance Tuning

DeepDive's bundle is the only meaningful performance variable. After deploy, check Vercel's analytics (if you enabled it) or DevTools' Lighthouse for the production URL. Targets per `Project_Specification.md` §23:

- First contentful paint under 1 second on a fast laptop with a warm cache.
- Under 2 seconds cold.

Practical levers if you ever miss those targets:

- **Lazy load more.** Currently `/dashboard`, `/problems`, `/progress`, `/settings` are lazy-loaded. The Reader chunk holds `react-markdown`, `fuse.js`, and `highlight.js`. If the Reader chunk grows uncomfortable, lazy-load `MarkdownContent` itself.
- **Strip unused languages from `highlight.js`.** Currently the entire library ships. You can replace `highlight.js/styles/github-dark.css` plus the dynamic import with a curated subset using `lowlight` if needed.
- **Trim Recharts.** Recharts is the heaviest dependency and only the `/progress` route uses it. The chunk split already isolates it.

---

## 17. Auto-Backup Behaviour in Production

The auto-backup feature uses the File System Access API. A few production-specific notes:

- **Origin scoping.** A folder picked on `localhost:5173` is not the same handle as one picked on `https://your-app.vercel.app`. The first time you visit production, you must re-pick the folder.
- **HTTPS required.** The File System Access API only works on secure origins. Vercel always serves over HTTPS, so this is automatic in production.
- **Permission re-grant.** Some browsers re-prompt for folder permission when the tab is reopened cold. The hook handles this transparently — the picker appears, you click "Allow", and the auto-backup resumes.
- **Folder choice tip.** Pick a synced folder (Dropbox, OneDrive, iCloud Drive, Google Drive desktop) for off-device redundancy. DeepDive writes a JSON snapshot; the cloud sync handles the rest.
- **Firefox / Safari.** No File System Access API. The Settings card shows a polite "Use Export instead" notice. Manual export from the same Settings page still works.

---

## 18. Troubleshooting

**Build fails on Vercel but succeeds locally.**

- Open the failed deployment in Vercel and read the **Build Logs** tab.
- Common causes: a Node version mismatch (pin via `engines.node` in `package.json`), an out-of-date lockfile (commit a fresh `package-lock.json`), or a TypeScript error that only surfaces with strict module resolution.
- Confirm `npm run build` runs locally on a clean clone (`rm -rf node_modules && npm install && npm run build`).

**404 on refresh of a non-root URL.**

- Confirm `vercel.json` is at the repo root and committed.
- Inspect the deployment's **Source** tab in Vercel — the file should appear in the file tree.
- The rewrite rule must be `"/(.*) → /index.html"`. If only certain routes 404, the regex is wrong.

**Site loads but shows a blank screen.**

- Open DevTools Console. Most blank screens are a single uncaught error during React hydration.
- Common cause: an asset path mismatch (e.g. wrong `base` in `vite.config.ts`). Vite's default `base` is `/` which is correct for Vercel — do not change it unless you deploy under a sub-path.

**Mixed-content or CORS errors.**

- The app is fully self-contained and never makes outbound requests at runtime. If you see CORS errors, something else (a browser extension, a misbehaving service worker from an earlier deploy) is interfering.
- Hard reload (Cmd+Shift+R or Ctrl+Shift+R) and re-test in an incognito window.

**Auto-backup picker does not open.**

- Verify the browser is Chromium-based. Firefox and Safari don't expose the API.
- Check Settings page for the fallback notice.
- Open DevTools and run `'showDirectoryPicker' in window`. If it returns `false`, the API is blocked (some corporate browsers disable it).
- Try in a normal browser window — extensions occasionally interfere.

**Old version still serving after push.**

- Hard reload. Vercel's CDN can serve cached HTML for a few seconds while it propagates.
- Confirm the new commit hash matches the latest deployment in the Vercel dashboard.
- The `index.html` is uncached by default; long cache headers apply only to `/assets/*` (which use content-hashed filenames, so they always update).

**Permission denied writing a backup file.**

- Re-pick the backup folder. Some OSes revoke directory permissions if the folder was moved or deleted.
- Avoid system folders (Desktop on macOS Sonoma, for example, requires explicit privacy permissions). Use a subfolder of your home directory or a synced cloud folder.

**Onboarding modal won't dismiss.**

- The modal closes when `pt_settings.userName` becomes non-empty. If you click through and the modal reappears, localStorage writes are failing.
- Open DevTools → Application → Local Storage and confirm the `pt_settings` key has a `userName` value.
- If localStorage is blocked (private mode in some browsers), the warning toast in the corner explains why.

---

## 19. Costs and Quotas

The Hobby (free) tier covers DeepDive comfortably:

- **Bandwidth:** 100 GB / month — far above what a personal study app generates.
- **Builds:** ~6000 build minutes / month — at typical DeepDive build times this allows hundreds of deploys per month.
- **Deployments:** unlimited.
- **Custom domains:** unlimited on Hobby.
- **Team members:** Hobby is single-user. Upgrade to Pro if you want collaborators.

There are no runtime function executions in DeepDive — it is pure static hosting at the edge, so the serverless function quota does not apply.

---

## 20. Removing the Deployment

If you ever need to take the site down:

1. **Project Settings → Advanced → Delete Project.**
2. Confirm by typing the project name.
3. The deployment is removed and the production alias goes offline.

Custom domains are released back to your DNS provider; remove the records you added earlier if you don't plan to point them anywhere else. Removing the project does not affect your GitHub repo or local clones.

---

_End of Hosting document._
