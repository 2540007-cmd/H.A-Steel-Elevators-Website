/* ============================================================
   H.A Steel Elevators — Projects Data + Render Logic
   Data now lives in Cloudflare KV, edited via /admin.html,
   and fetched live from /api/projects on every page load.
   ============================================================ */

let PROJECTS = [];

/* ============================================================
   RENDER LOGIC
   ============================================================ */

const projectsSection = document.getElementById("projectsSection");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("projectSearch");
const sortSelect = document.getElementById("sortSelect");
const filterPills = document.querySelectorAll(".filter-pill");

let activeFilter = "all";
let searchTerm = "";
let sortOrder = "latest";

function matchesFilter(project) {
    if (activeFilter === "all") return true;
    return project.category === activeFilter;
}

function matchesSearch(project) {
    if (!searchTerm) return true;
    const haystack = `${project.title} ${project.company} ${project.location}`.toLowerCase();
    return haystack.includes(searchTerm.toLowerCase());
}

function getFilteredSorted() {
    let list = PROJECTS.filter(p => matchesFilter(p) && matchesSearch(p));
    list.sort((a, b) => sortOrder === "latest" ? b.year - a.year : a.year - b.year);
    return list;
}

function groupByCategory(list) {
    const groups = {};
    list.forEach(p => {
        if (!groups[p.category]) groups[p.category] = [];
        groups[p.category].push(p);
    });
    return groups;
}

const categoryLabels = {
    Category: "Elevators",
    Crane: "Overhead Cranes",
    Shed: "Shed Fabrication",
    Warehouse: "Warehouses",
    Others: "Other Projects"
};

function render() {
    const list = getFilteredSorted();
    projectsSection.innerHTML = "";

    resultsCount.textContent = `${list.length} PROJECT${list.length !== 1 ? "S" : ""}`;

    if (list.length === 0) {
        emptyState.classList.add("visible");
        return;
    }
    emptyState.classList.remove("visible");

    if (activeFilter !== "all") {
        // Single flat grid when a specific filter is active
        const grid = document.createElement("div");
        grid.className = "cards-grid";
        list.forEach(p => grid.appendChild(buildCard(p)));
        projectsSection.appendChild(grid);
        return;
    }

    // Grouped by category when showing "All"
    const groups = groupByCategory(list);
    Object.keys(groups).forEach(catKey => {
        const block = document.createElement("div");
        block.className = "category-block";

        const heading = document.createElement("div");
        heading.className = "category-heading";
        heading.innerHTML = `
            <h2>${categoryLabels[catKey] || catKey}</h2>
            <span class="cat-count">${groups[catKey].length}</span>
            <div class="category-rule"></div>
        `;
        block.appendChild(heading);

        const grid = document.createElement("div");
        grid.className = "cards-grid";
        groups[catKey].forEach(p => grid.appendChild(buildCard(p)));
        block.appendChild(grid);

        projectsSection.appendChild(block);
    });
}

function buildCard(project) {
    const card = document.createElement("div");
    card.className = "project-card";
    card.addEventListener("click", () => openModal(project));

    card.innerHTML = `
        <div class="card-img">
            <img src="${project.images[0]}" alt="${project.title}" loading="lazy">
            <span class="card-type-badge">${project.typeLabel}</span>
            <span class="card-year-badge">${project.year}</span>
        </div>
        <div class="card-body">
            <h3>${project.title}</h3>
            <div class="card-meta">
                <span class="company">${project.company}</span>
                <span>${project.location}</span>
            </div>
        </div>
        <div class="card-footer">
            <span class="view-label">View Details</span>
            <span class="view-label">→</span>
        </div>
    `;
    return card;
}

/* ============================================================
   MODAL
   ============================================================ */

const modalOverlay = document.getElementById("modalOverlay");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalSubtitle = document.getElementById("modalSubtitle");
const modalMainPhoto = document.getElementById("modalMainPhoto");
const modalThumbs = document.getElementById("modalThumbs");
const modalCompany = document.getElementById("modalCompany");
const modalLocation = document.getElementById("modalLocation");
const modalYearDetail = document.getElementById("modalYearDetail");
const modalCategoryDetail = document.getElementById("modalCategoryDetail");
const modalScope = document.getElementById("modalScope");
const modalDescription = document.getElementById("modalDescription");

function openModal(project) {
    modalTitle.textContent = project.title;
    modalSubtitle.textContent = `${project.company} — ${project.location}`;

    modalMainPhoto.src = project.images[0];
    modalMainPhoto.alt = project.title;

    modalThumbs.innerHTML = "";
    project.images.forEach((src, i) => {
        const thumb = document.createElement("div");
        thumb.className = "photo-thumb" + (i === 0 ? " active" : "");
        thumb.innerHTML = `<img src="${src}" alt="${project.title} photo ${i + 1}">`;
        thumb.addEventListener("click", () => {
            modalMainPhoto.src = src;
            modalThumbs.querySelectorAll(".photo-thumb").forEach(t => t.classList.remove("active"));
            thumb.classList.add("active");
        });
        modalThumbs.appendChild(thumb);
    });

    modalCompany.textContent = project.company;
    modalLocation.textContent = project.location;
    modalYearDetail.textContent = project.year;
    modalCategoryDetail.textContent = project.typeLabel;
    modalScope.innerHTML = project.scope;
    modalDescription.innerHTML = project.description;


    modalOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    modalOverlay.classList.remove("open");
    document.body.style.overflow = "";
}

modalClose.addEventListener("click", closeModal);
modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
});

/* ============================================================
   EVENT LISTENERS — filters, search, sort
   ============================================================ */

filterPills.forEach(pill => {
    pill.addEventListener("click", () => {
        filterPills.forEach(p => p.classList.remove("active"));
        pill.classList.add("active");
        activeFilter = pill.dataset.filter;
        render();
    });
});

searchInput.addEventListener("input", (e) => {
    searchTerm = e.target.value;
    render();
});

sortSelect.addEventListener("change", (e) => {
    sortOrder = e.target.value;
    render();
});

/* ============================================================
   INIT — fetch live data, then render
   ============================================================ */

async function init() {
    try {
        const res = await fetch('/api/projects', { cache: 'no-store' });
        if (!res.ok) throw new Error(`API returned ${res.status}`);
        PROJECTS = await res.json();
    } catch (err) {
        console.error('Failed to load projects:', err);
        projectsSection.innerHTML = '';
        emptyState.classList.add('visible');
        emptyState.querySelector('p').textContent =
            'Could not load projects right now. Please refresh or try again shortly.';
        return;
    }
    render();
}

init();
