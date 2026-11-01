#!/usr/bin/env python3
"""Build pages/index.json, the project list read by the landing page.

Each folder in pages/ is a project. Inside it, versions are named
<anything>_vXX.html, with an optional preview image of the same name (.jpg).
Only files directly inside the project folder count, so a project's own
subfolders (assets/, img/, ...) are ignored.

For every project the latest version (highest number, so v10 > v09) is kept.

Usage: python3 scripts/build_index.py
"""

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PAGES_DIR = ROOT / "pages"
OUTPUT = PAGES_DIR / "index.json"

VERSION_PATTERN = re.compile(r"^(?P<base>.+)_v(?P<version>\d+)\.html$", re.IGNORECASE)


def pretty_name(folder):
    """'my_project-name' -> 'My Project Name'"""
    return " ".join(word.capitalize() for word in re.split(r"[_\-\s]+", folder) if word)


def warn(message):
    print(f"warning: {message}", file=sys.stderr)


def build_project(folder):
    versions = []
    for file in sorted(folder.glob("*.html")):
        match = VERSION_PATTERN.match(file.name)
        if match:
            versions.append((int(match["version"]), match["version"], file))
        else:
            warn(f"{file.relative_to(ROOT)} does not end in _vXX.html, skipped")

    if not versions:
        warn(f"{folder.relative_to(ROOT)}/ has no _vXX.html file, skipped")
        return None

    number, version, html = max(versions)
    image = html.with_suffix(".jpg")
    if not image.exists():
        warn(f"{html.relative_to(ROOT)} has no preview image ({image.name})")

    return {
        "name": pretty_name(folder.name),
        "folder": folder.name,
        "version": version,
        "versions": len(versions),
        "html": html.relative_to(ROOT).as_posix(),
        "image": image.relative_to(ROOT).as_posix() if image.exists() else None,
    }


def main():
    folders = sorted(p for p in PAGES_DIR.iterdir() if p.is_dir())
    projects = [p for p in (build_project(f) for f in folders) if p]

    OUTPUT.write_text(json.dumps({"projects": projects}, indent=2) + "\n")
    print(f"{OUTPUT.relative_to(ROOT)}: {len(projects)} project(s)")


if __name__ == "__main__":
    main()
