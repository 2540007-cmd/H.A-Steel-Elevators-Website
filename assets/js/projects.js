/* ============================================================
   H.A Steel Elevators — Projects Data + Render Logic
   Populated from H_A_Steel_Elevators_Profile.pptx
   ============================================================ */

const PROJECTS = [

    {
        id: "south-africa-installation",
        title: "Muti-Story Cargo Elevator",
        category: "Elevators",
        typeLabel: "Cargo Elevator",
        company: "KKT Royal Sweets",
        location: "Conakry, Guinea, Africa",
        year: 2026,
        description: `Successfully completed the fabrication and installation of a 
                    multi-story cargo elevator for KKT Royal Sweets in Conakry, 
                    Guinea. The project was designed to provide efficient and 
                    reliable vertical material transportation, supporting the client’s 
                    operational needs with a durable and safe lifting solution.
                    `,
        scope: `• Multi-story cargo elevator fabrication<br>
                • Installation and fixing<br>
                • System testing and commissioning<br>
                • Quality inspection and technical support<br>`,
        images: [
            "../assets/images/southafrica1.webp",
            "../assets/images/southafrica2.webp"
        ]
    },

    {
        id: "salt factory",
        title: "Multi-Story Passanger Elevator",
        category: "Elevators",
        typeLabel: "Passanger Elevator",
        company: "Salt Factory",
        location: "Hub, Karachi, Pakistan",
        year: 2021,
        scope: `• Multi-story passanger elevator fabrication<br>
                • Installation and fixing<br>
                • System testing and commissioning<br>
                • Quality inspection and technical support<br>`,
        description: `Successfully completed the fabrication and installation of a 
                    multi-story passanger elevator for Salt Factory in Hub, 
                    Karachi, Pakistan. The project was designed to provide 
                    efficient and reliable vertical passanger transportation, 
                    supporting the client's operational needs.`,
        images: [
            "../assets/images/salt-fact.webp",
        ]
    },

    {
        id: "warehouse-mask-storage",
        title: "Warehouse Creation",
        category: "Warehouse",
        typeLabel: "Warehouse",
        company: "Mask Factory",
        location: "Karachi, Pakistan",
        year: 2020,
        scope: `• Customized warehouse structure fabrication<br>
                • Steel framework design and installation<br>
                • Site installation and fixing<br>
                • Durable storage solution development<br>`,
        description: `Successfully completed the fabrication and installation of a 
                    customized warehouse structure designed according to the 
                    client’s operational requirements. The facility was developed to 
                    provide a secure and controlled storage environment for 
                    sensitive fabric materials used in sterile mask production, 
                    ensuring protection from external environmental factors.`,
        images: [
            "../assets/images/Warehouse.webp"
        ]
    },

    {
        id: "alhadid-shed",
        title: "Shed Fabrication & Installation",
        category: "Shed",
        typeLabel: "Shed",
        company: "Al-Hadid Waste Management & Recycling Co",
        location: "Northern Bypass, Karachi, Pakistan",
        year: 2026,
        scope: `• Customized shed structure fabrication<br>
                • Steel framework installation<br>
                • On-site fixing and assembly<br>
                • Durable and functional workspace solution<br>`,
        description: `Successfully completed the fabrication and installation of a 
                    durable shed structure for Al-Hadid Waste Management. The 
                    structure was designed to provide a safe and shaded working 
                    environment for operational staff while performing waste 
                    management activities, including incinerator operations.`,
        images: [
            "../assets/images/alhadid.webp"
        ]
    },

    {
        id: "sunaina-textile",
        title: "Multi-Story Cargo Elevator Installation",
        category: "Elevators",
        typeLabel: "Cargo Elevator",
        company: "Sunaina Textile",
        location: "Karachi, Pakistan",
        year: 2022,
        scope: `• Multi-story cargo elevator fabrication<br>
                • Installation and fixing<br>
                • Material handling solution implementation<br>
                • Testing and operational support<br>`,
        description: `Successfully completed the fabrication and installation of a 
                    multi-story cargo elevator for Sunaina Textile. The elevator 
                    system was designed to provide efficient and reliable 
                    transportation of textile goods between multiple floors, 
                    improving material handling efficiency and supporting smooth 
                    daily operations`,
        images: [
            "../assets/images/sunaina.webp"
        ]
    },

    {
        id: "roomi-textile-conveyor",
        title: "Slide Conveyor Fabrication & Installation",
        category: "Others",
        typeLabel: "Manual Conveyor",
        company: "Roomi Textile",
        location: "F-122 B AREA, Sindh Industrial Trading Estate, Karachi, Pakistan",
        year: 2023,
        scope: `• Customized slide conveyor fabrication<br>
                • Installation and alignment<br>
                • Material transfer solution implementation<br>
                • Testing and operational support<br>`,
        description: `Successfully completed the fabrication and installation of a 
                        slide conveyor system for Roomi Textile. The conveyor was 
                        designed to enable fast, safe, and efficient transfer of 
                        materials from a higher level to a lower level, ensuring 
                        smooth workflow and reducing operational interruptions.`,
        images: [
            "../assets/images/Roomitex1.webp",
            "../assets/images/Roomitex2.webp"
        ]
    },

    {
        id: "fishery-storage-platform",
        title: "Warehouse Storage Platform Fabrication & Installation",
        category: "Others",
        typeLabel: "Warehouse Platform",
        company: "Fishery",
        location: "Fishery, West Wharf, Karachi, Pakistan",
        year: 2024,
        scope: `• Customized steel platform fabrication<br>
                • Multi-level storage structure development<br>
                • Installation and fixing inside warehouse<br>
                • Space optimization solution`,
        description: `Successfully completed the fabrication and installation of a 
                        multi-level storage platform inside a warehouse facility. 
                        The platform was designed to maximize available storage space 
                        by creating additional levels for organized fish storage while 
                        improving warehouse efficiency and utilization.`,
        images: [
            "../assets/images/fishery1.webp",
            "../assets/images/fishery2.webp"
        ]
    }

];

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
   INIT
   ============================================================ */

render();