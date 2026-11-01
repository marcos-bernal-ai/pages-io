# pages-io

A minimalist portfolio served with GitHub Pages.

**Live site:** https://marcos-bernal-ai.github.io/pages-io/

The landing page (`index.html`) finds every project in the `pages/` folder and
shows the **latest version** of each one as a card with a preview image.

## Structure

```
index.html                         landing page (markup only)
assets/
  css/style.css                    landing page styles
  js/portfolio.js                  reads pages/index.json and builds the cards
  fonts/                           self-hosted fonts (SIL Open Font License)
  favicon.svg                      "MB" tab icon
  claude.svg                       Claude icon used in the footer (from claude.ai)
pages/
  <project>/<project>_v01.html     a version of the project
  <project>/<project>_v01.jpg      its preview image (optional)
  <project>/<project>_v02.html     newer version → this one is shown
  <project>/<project>_v02.jpg
  <project>/assets/                the project's own files (ignored by the landing page)
scripts/build_index.py             builds pages/index.json (generated, not committed)
.github/workflows/deploy.yml       builds the index and publishes the site
```

## Adding a project or a new version

1. Create (or reuse) a folder in `pages/`, e.g. `pages/my_project/`.
2. Add `my_project_vXX.html` with the next version number.
3. Add `my_project_vXX.jpg` next to it as the preview (16:10 works best, e.g. 1200×750).
4. Push to `main`. The site is rebuilt and published in about a minute.

Older versions stay in the repo and remain reachable by their URL.

## How it works

Everything the site needs is in this repo: no CDNs, font services or API calls.

On every push to `main`, the **Deploy site** workflow runs
`scripts/build_index.py` and publishes the site to GitHub Pages. The script:

- treats every folder in `pages/` as a project;
- picks the highest `_vXX.html` version (v10 comes after v09) and its `.jpg`;
- counts the versions and turns the folder name into a title (`my_project` → "My Project");
- ignores the project's subfolders and prints warnings for misnamed files.

It writes the result to `pages/index.json`, which the landing page reads.

### One-time setup

In the repo, set **Settings → Pages → Build and deployment → Source** to
**GitHub Actions**.

### Local preview

```
python3 scripts/build_index.py
python3 -m http.server
```

Then open http://localhost:8000.

Folder and file names are case-sensitive on GitHub Pages; keep them lowercase.
