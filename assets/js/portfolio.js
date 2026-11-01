// Project list built by scripts/build_index.py (latest version of each project)
const INDEX_URL = "pages/index.json";

async function loadProjects() {
  const res = await fetch(INDEX_URL, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${INDEX_URL} returned ${res.status}`);
  const data = await res.json();
  return data.projects;
}

function render(projects) {
  const grid = document.getElementById("grid");
  const template = document.getElementById("card-template");
  grid.innerHTML = "";

  projects.forEach((p, i) => {
    const card = template.content.cloneNode(true);
    const link = card.querySelector("a");

    link.href = p.html;
    link.style.animationDelay = (i * 80) + "ms";
    card.querySelector("h2").textContent = p.name;
    card.querySelector("p").textContent =
      "v" + p.version + (p.versions > 1 ? " · " + p.versions + " versions" : "");

    const img = card.querySelector("img");
    if (p.image) {
      img.src = p.image;
      img.alt = p.name + " preview";
    } else {
      const placeholder = document.createElement("span");
      placeholder.className = "placeholder";
      placeholder.textContent = p.name.charAt(0);
      img.replaceWith(placeholder);
    }

    grid.appendChild(card);
  });

  document.getElementById("count").textContent =
    projects.length + (projects.length === 1 ? " project" : " projects");
}

function showMessage(text) {
  const message = document.createElement("p");
  message.className = "message";
  message.textContent = text;
  document.getElementById("grid").replaceChildren(message);
}

async function init() {
  document.getElementById("year").textContent = new Date().getFullYear();

  try {
    const projects = await loadProjects();
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
