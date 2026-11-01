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
  js/portfolio.js                  loads the project list and builds the cards
  fonts/                           self-hosted fonts (SIL Open Font License)
pages/
  index.json                       generated list of project files (do not edit)
  <project>/<project>_v01.html     a version of the project
  <project>/<project>_v01.jpg      its preview image (optional)
  <project>/<project>_v02.html     newer version → this one is shown
  <project>/<project>_v02.jpg
  <project>/assets/                the project's own files (ignored by the landing page)
scripts/build-index.sh             generates pages/index.json
.github/workflows/build-index.yml  runs the script on every push to main
```

## Adding a project or a new version

1. Create (or reuse) a folder in `pages/`, e.g. `pages/my_project/`.
2. Add `my_project_vXX.html` with the next version number.
3. Add `my_project_vXX.jpg` next to it as the preview (16:10 works best, e.g. 1200×750).
4. Push to `main`. The GitHub Action updates `pages/index.json` and the new
   card appears after about 30 seconds plus the usual Pages publish time.
   Pull afterwards, since the Action adds a commit.

Older versions stay in the repo and remain reachable by their URL.

## How it works

Everything the site needs is in this repo: no CDNs, font services or API calls.

GitHub Pages can't list folders, so `scripts/build-index.sh` writes the
`.html` and `.jpg` files of each project folder to `pages/index.json`. The
landing page reads that file, keeps the highest `_vXX` of each project and pairs
it with the `.jpg` of the same name.

To preview locally, run `./scripts/build-index.sh`, then
`python3 -m http.server` and open http://localhost:8000.

Folder and file names are case-sensitive on GitHub Pages; keep them lowercase.
