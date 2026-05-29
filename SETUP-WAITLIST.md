# SpaceBank — Setup Guide

Three parts: (1) connect the waitlist to a free Google Sheet, (2) deploy to GitHub Pages, (3) connect your GoDaddy domain.

---

## Part 1 — Connect the waitlist to Google Sheets (free)

The site is static, so signups are saved by a tiny Google Apps Script that writes to a Sheet you own. POST adds a row; GET returns the live count for the counter.

1. Go to https://sheets.google.com and create a new blank spreadsheet. Name it `SpaceBank Waitlist`.
2. In that sheet, open **Extensions → Apps Script**. A code editor opens.
3. Delete whatever is in `Code.gs`, then open `waitlist-backend.gs` from this folder, copy all of it, and paste it in. Click the **save** icon.
4. Click **Deploy → New deployment**.
   - Click the gear next to "Select type" → choose **Web app**.
   - **Description**: anything (e.g. `waitlist v1`).
   - **Execute as**: **Me**.
   - **Who has access**: **Anyone**.  ← important, or the form can't reach it.
   - Click **Deploy**. Approve the permissions when Google prompts you (choose your account → Advanced → Go to project → Allow).
5. Copy the **Web app URL** it gives you. It looks like:
   `https://script.google.com/macros/s/AKfy.....X/exec`
6. Open `waitlist.html`, find this line near the bottom:
   ```js
   const SCRIPT_URL = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
   ```
   Replace the placeholder with your URL (keep the quotes). Save.
7. (Optional) Change the counter seed on the next line — `const SEED = 1000;`. Set to `0` to show only real signups.

**Test it:** open `waitlist.html`, submit the form, then check the Google Sheet — a new row should appear, and the counter should tick up.

> If you ever change the script, do **Deploy → Manage deployments → Edit → New version** so the same URL keeps working.

---

## Part 2 — Deploy to GitHub Pages (free, static)

1. Create a free account at https://github.com if you don't have one.
2. Create a new repository — name it `spacebank` (or `yourusername.github.io` for a root site). Set it **Public**.
3. Upload the project: on the repo page click **Add file → Upload files**, drag in everything from this folder **except** `waitlist-backend.gs` and the `.md` guides (those aren't part of the site), then **Commit changes**.
4. Go to **Settings → Pages**. Under "Build and deployment", set **Source: Deploy from a branch**, **Branch: main / (root)**, click **Save**.
5. Wait ~1 minute. The page shows your live URL, e.g. `https://yourusername.github.io/spacebank/`.

Make sure `index.html` is at the repo root so it loads as the home page.

---

## Part 3 — Connect your GoDaddy domain

Point your custom domain (e.g. `spacebank.com`) at GitHub Pages.

**A. Tell GitHub your domain**
1. In the repo: **Settings → Pages → Custom domain**, type your domain (e.g. `www.spacebank.com`), click **Save**. This adds a `CNAME` file to the repo.

**B. Set DNS at GoDaddy**
1. Log in to GoDaddy → **My Products → Domains → DNS** for your domain.
2. Add these **A records** for the root domain (Host = `@`), pointing to GitHub's IPs:
   - `185.199.108.153`
   - `185.199.109.153`
   - `185.199.110.153`
   - `185.199.111.153`
3. Add a **CNAME record**: Host = `www`, Value = `yourusername.github.io` (your GitHub Pages host, no `https://`, with a trailing dot if GoDaddy requires it).
4. Save. DNS can take from a few minutes up to a few hours to propagate.

**C. Turn on HTTPS**
1. Back in **Settings → Pages**, once the domain verifies, check **Enforce HTTPS**.

That's it — your domain will serve the site over HTTPS.

---

## Quick checklist
- [ ] Apps Script deployed, access = Anyone
- [ ] `SCRIPT_URL` pasted into `waitlist.html`
- [ ] Test submission appears in the Sheet + counter updates
- [ ] Site files uploaded to GitHub, Pages enabled
- [ ] GoDaddy A + CNAME records set, custom domain saved in GitHub
- [ ] Enforce HTTPS checked
