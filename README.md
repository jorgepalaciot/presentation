# jorgepalaciotello — source

Static, bilingual (ES/EN) personal site. No build step, no framework —
plain HTML/CSS/JS so it runs on GitHub Pages today and migrates to any
static host (Netlify, Vercel, custom domain) without changes.

## Structure

```
/                     root redirector: detects browser language, sends to /es/ or /en/
/en/                  English site (canonical source of English copy)
/es/                  Spanish site (canonical source of Spanish copy — not a translation layer)
/en/blog/, /es/blog/  blog index (post pages will live at /en/blog/<slug>/ etc.)
/assets/css/tokens.css   design tokens: color (light/dark), type scale, spacing
/assets/css/style.css    components and layout
/assets/js/main.js       theme persistence + scroll-reveal animation
/assets/img/             photos (jorge-palacio-tello.jpg = hero, jorge-square.jpg = avatar/favicon/OG image)
robots.txt, sitemap.xml  SEO baseline
```

Language and theme both persist via `localStorage` (`jpt-lang`, `jpt-theme`)
and fall back to `navigator.language` / `prefers-color-scheme` when nothing
is stored yet, per spec.

## ⚠️ Before this goes live — placeholders to replace

Search the codebase for these and fix before publishing:

| Placeholder | Where | What to do |
|---|---|---|
| `REPLACE_WITH_EMAIL@example.com` | every page, in `mailto:` links and footer | replace with a real email you check |
| `jorgepalaciotello.com` | canonical/OG tags in every `<head>` | replace with your real domain, or your `username.github.io/repo` URL until you buy a domain |
| Teleperformance / La Hostería / Caja Sullana / XIMA | `/en/index.html` and `/es/index.html`, Experience section | currently **not listed with titles/dates** on purpose — I don't have confirmed job titles or employment dates from your uploaded certificates. Give me exact title + start/end month-year for each and I'll add them to the timeline properly instead of leaving the placeholder note. |
| CV download button | not yet added | once you have a PDF CV, tell me and I'll add a "Download CV" button linking to `/assets/cv/jorge-palacio-tello-cv.pdf` |
| GitHub profile link | not yet added to footer | tell me your GitHub username once the repo is up |

Run this to find them all:
```
grep -rn "REPLACE_WITH_EMAIL\|jorgepalaciotello.com" .
```

## Deploy to GitHub Pages

1. Create a repo (e.g. `jorge-palacio-tello.github.io` for a root domain-style
   URL, or any name — GitHub Pages supports both `username.github.io` repos
   and regular repos served from `/`).
2. Push this folder's contents to the repo root (or to a `docs/` folder if
   you prefer — adjust Pages settings accordingly).
3. In the repo: **Settings → Pages → Source → Deploy from branch → main → /(root)**.
4. Your site is live at `https://<username>.github.io/` (or
   `https://<username>.github.io/<repo>/` — if it's the latter, every
   absolute path in the HTML/CSS starting with `/` will break, because they
   assume the site is served from the domain root). Tell me which case
   applies and I'll adjust all paths accordingly, or set up a `CNAME` file
   once you have a custom domain — either fixes this cleanly.
5. Once you buy a domain, add a `CNAME` file at the repo root containing
   just the domain name, and point your DNS `A`/`CNAME` records per GitHub's
   Pages documentation.

## What's built vs. what's next

**Built:** home page (EN/ES), design system, dark/light + language toggles,
blog architecture (no fake posts — empty on purpose until 3 drafts are ready).

**Not built yet:** dedicated `/experience/` page with full role-by-role
detail, `/projects/` (the aquaculture thesis as a proper case study),
`/contact/` as a standalone page (currently just `mailto:` links), individual
blog post template. These come next, once the placeholders above are filled —
building them with fake dates/emails now would just mean redoing them.
