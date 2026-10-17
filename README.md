# pages-io

A minimalist portfolio served with GitHub Pages.

The landing page (`index.html`) finds every project in the `pages/` folder and
shows the **latest version** of each one as a card with a preview image.

## Structure

```
index.html                         landing page
pages/
  <project>/<project>_v01.html     a version of the project
  <project>/<project>_v01.jpg      its preview image (optional)
  <project>/<project>_v02.html     newer version → this one is shown
  <project>/<project>_v02.jpg
```

## Adding a project or a new version

1. Create (or reuse) a folder in `pages/`, e.g. `pages/my_project/`.
2. Add `my_project_vXX.html` with the next version number.
3. Add `my_project_vXX.jpg` next to it as the preview (16:10 works best, e.g. 1200×750).
4. Push. The landing page picks it up automatically.

Older versions stay in the repo and remain reachable by their URL.

## How it works

GitHub Pages can't list folders, so the landing page reads the repo's file list
with one call to the public GitHub API
(`/repos/<owner>/<repo>/git/trees/HEAD?recursive=1`). It reads the default
branch, so the repo must stay public. The API allows 60 calls per hour per
visitor.

Folder and file names are case-sensitive on GitHub Pages; keep them lowercase.
