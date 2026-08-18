# jorgepalaciotello — source

Static, bilingual (ES/EN) personal site. No build step, no framework —
plain HTML/CSS/JS so it runs on GitHub Pages today and migrates to any
static host (Netlify, Vercel, custom domain) without changes.

**Live at:** https://jorgepalaciot.github.io/presentation/

All internal links (CSS, JS, images, nav, language switch) use **relative
paths**, not paths hardcoded to `/presentation/`. That's deliberate: it's
why the site works correctly under a project subpath today, and will keep
working with zero changes if you later move it to a custom domain served
from the root. Only `canonical`, `og:*`, and the sitemap use absolute URLs
(required by spec, since crawlers/social previews read them out of
context) — those currently point to the live URL above and need updating
if the domain changes (see "Migrating to a custom domain" below).

## Structure

```
/                     root redirector: detects browser language, sends to /es/ or /en/
/en/                  English site (canonical source of English copy)
/es/                  Spanish site (canonical source of Spanish copy — not a translation layer)
/en/blog/, /es/blog/  blog index (post pages live at /en/blog/<slug>/ etc.)
/en/projects/, /es/proyectos/  project case studies (Problem/Context/Approach/
                      Process/Result/Learning/Next step) — separate from the
                      blog, which is where the more personal reflection lives.
                      Same draft convention as blog posts: <meta name="robots"
                      content="noindex"> and a "Draft" badge stay on until every
                      section (including Learning / Next step) is finished.
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
| Teleperformance / La Hostería / Caja Sullana / XIMA | `/en/index.html` and `/es/index.html`, Experience section | currently **not listed with titles/dates** on purpose — I don't have confirmed job titles or employment dates from your uploaded certificates. Give me exact title + start/end month-year for each and I'll add them to the timeline properly instead of leaving the placeholder note. |
| Aquaculture project — Learning / Next step | `/en/projects/aquaculture-plant-business-case/`, `/es/proyectos/caso-de-negocio-planta-acuicultura/` | two `[Write this section]` blocks need your own judgment — see the todo-block prompts inside each file |
| Aquaculture blog article — reflection sections | `/en/blog/lean-read-aquaculture-thesis/`, `/es/blog/lectura-lean-tesis-acuicultura/` | same as above, two `[Write this section]` blocks pending |
| CV download button | not yet added | once you have a PDF CV, tell me and I'll add a "Download CV" button linking to `assets/cv/jorge-palacio-tello-cv.pdf` |
| GitHub profile link | not yet added to footer | tell me your GitHub username and I'll add it |

Run this to find the email placeholder:
```
grep -rn "REPLACE_WITH_EMAIL" .
```

## ⚠️ `robots.txt` is currently inert — read this

Per the robots.txt spec, crawlers only ever check `https://<host>/robots.txt`
— the true root of the domain. Since this site is served at
`https://jorgepalaciot.github.io/presentation/`, the `robots.txt` and
`sitemap.xml` living inside this repo are **not at a location any crawler
will look for**. They do nothing right now — not harmful, just inactive.
This isn't a bug I introduced; it's a structural limit of project-page
GitHub Pages hosting. Two ways to actually activate them:

1. **Get a custom domain** and point it at this repo (see below) — then
   `robots.txt`/`sitemap.xml` at the repo root become the real root files.
2. **Create a `jorgepalaciot.github.io` repo** (GitHub's special "user site"
   repo name) and either move this site there or have its `robots.txt`
   reference this sitemap. More fragile long-term than owning a domain.

Until then, the practical effect is: search engines crawl the site with
default behavior (nothing is blocked) — there's no downside, just no
extra guidance either. Not urgent, but don't assume it's doing something
it isn't.

## Deploy to GitHub Pages

Already live at https://jorgepalaciot.github.io/presentation/ — repo
`presentation`, **Settings → Pages → Source → Deploy from branch → main →
/(root)**. Since it's a project repo (not the special `jorgepalaciot.github.io`
user-site repo), it's served from a subpath. Every internal link is
relative, so this works correctly as-is — no path fixes needed for future
pushes.

## Migrating to a custom domain later

1. Buy the domain, point its DNS at GitHub Pages per
   [GitHub's docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Add a `CNAME` file at the repo root containing just the domain
   (e.g. `jorgepalaciotello.com`), no `http://`, no trailing slash.
3. Update the absolute URLs that can't be relative — `canonical`,
   `hreflang`, `og:url`, `og:image` in every page's `<head>`, plus the
   `<loc>` entries in `sitemap.xml` and the `Sitemap:` line in `robots.txt`.
   Tell me the domain when you have it and I'll do this in one pass; it's
   a find-and-replace of `jorgepalaciot.github.io/presentation` → your
   domain, nothing structural changes.
4. Everything else (nav, assets, language switch) needs zero changes,
   because those paths were never tied to a specific host.

## What's built vs. what's next

**Built:** home page (EN/ES), design system, dark/light + language toggles,
blog architecture (one draft article, more planned), projects architecture
(one draft case study — the aquaculture thesis — more added only once they
have real, verifiable content).

**Not built yet:** dedicated `/experience/` page with full role-by-role
detail, `/contact/` as a standalone page (currently just `mailto:` links).
These come next, once the placeholders above are filled — building them
with fake dates/emails now would just mean redoing them.
