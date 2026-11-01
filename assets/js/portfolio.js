// Folder that holds the projects: pages/<project>/<project>_vXX.html (+ .jpg)
const PAGES_DIR = "pages";

// Repo for the "Source" link when the site is not served from <owner>.github.io/<repo>
const FALLBACK_OWNER = "marcos-bernal-ai";
const FALLBACK_REPO = "pages-io";

function getRepo() {
  const host = location.hostname;
  if (host.endsWith(".github.io")) {
    const owner = host.replace(".github.io", "");
    const firstPath = location.pathname.split("/")[1];
    // Project site: owner.github.io/repo — User site: owner.github.io
    return { owner, repo: firstPath || host };
  }
  return { owner: FALLBACK_OWNER, repo: FALLBACK_REPO };
}

// Read the file list that the GitHub Action writes to pages/index.json
async function listFiles() {
  const res = await fetch(`${PAGES_DIR}/index.json`, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${PAGES_DIR}/index.json returned ${res.status}`);
  return res.json();
}

// Keep only the highest _vXX.html of each project folder
function latestVersions(paths) {
  const pattern = new RegExp(`^${PAGES_DIR}/([^/]+)/([^/]+)_v(\\d+)\\.html$`, "i");
  const projects = {};

  for (const path of paths) {
    const match = path.match(pattern);
    if (!match) continue;
    const [, folder, , version] = match;
    const number = parseInt(version, 10);
    const current = projects[folder];
    if (!current) {
      projects[folder] = { folder, number, version, html: path, versions: 1 };
    } else {
      current.versions++;
      if (number > current.number) Object.assign(current, { number, version, html: path });
    }
  }

  const fileSet = new Set(paths);
  return Object.values(projects)
    .map(p => {
      const jpg = p.html.replace(/\.html$/i, ".jpg");
      return { ...p, image: fileSet.has(jpg) ? jpg : null };
    })
    .sort((a, b) => a.folder.localeCompare(b.folder));
}

// "my_project-name" -> "My Project Name"
function prettyName(folder) {
  return folder
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function render(projects) {
  const grid = document.getElementById("grid");
  const template = document.getElementById("card-template");
  grid.innerHTML = "";

  projects.forEach((p, i) => {
    const card = template.content.cloneNode(true);
    const link = card.querySelector("a");
    const name = prettyName(p.folder);

    link.href = p.html;
    link.style.animationDelay = (i * 80) + "ms";
    card.querySelector("h2").textContent = name;
    card.querySelector("p").textContent =
      "v" + p.version + (p.versions > 1 ? " · " + p.versions + " versions" : "");

    const img = card.querySelector("img");
    if (p.image) {
      img.src = p.image;
      img.alt = name + " preview";
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "placeholder";
      placeholder.textContent = name.charAt(0);
      img.replaceWith(placeholder);
    }

    grid.appendChild(card);
  });

  document.getElementById("count").textContent =
    projects.length + (projects.length === 1 ? " project" : " projects");
}

function showMessage(text) {
  document.getElementById("grid").innerHTML = `<p class="message">${text}</p>`;
}

async function init() {
  const { owner, repo } = getRepo();
  document.getElementById("repo-link").href = `https://github.com/${owner}/${repo}`;

  try {
    const projects = latestVersions(await listFiles());
    if (projects.length === 0) {
      showMessage("No projects yet.");
      return;
    }
    render(projects);
  } catch (err) {
    showMessage("Could not load projects (" + err.message + ").");
  }
}

init();
