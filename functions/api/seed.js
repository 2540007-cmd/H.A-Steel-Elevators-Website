/* ============================================================
   API: /api/seed
   POST -> one-time migration of the original 7 hardcoded projects
           into KV. Protected by ADMIN_PASSWORD. Safe to call
           more than once: it will NOT overwrite existing data
           unless KV is currently empty.
   ============================================================ */

const EXISTING_PROJECTS = [
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
                operational needs with a durable and safe lifting solution.`,
    scope: `• Multi-story cargo elevator fabrication<br>
            • Installation and fixing<br>
            • System testing and commissioning<br>
            • Quality inspection and technical support<br>`,
    images: ["/assets/images/southafrica1.webp", "/assets/images/southafrica2.webp"],
  },
  {
    id: "salt-factory",
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
    images: ["/assets/images/salt-fact.webp"],
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
    images: ["/assets/images/Warehouse.webp"],
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
    images: ["/assets/images/alhadid.webp"],
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
                daily operations.`,
    images: ["/assets/images/sunaina.webp"],
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
    images: ["/assets/images/Roomitex1.webp", "/assets/images/Roomitex2.webp"],
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
    images: ["/assets/images/fishery1.webp", "/assets/images/fishery2.webp"],
  },
];

export async function onRequestPost({ request, env }) {
  const auth = request.headers.get('Authorization');
  if (auth !== `Bearer ${env.ADMIN_PASSWORD}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const existing = await env.PROJECTS_KV.get('projects', { type: 'json' });
  if (existing && existing.length > 0) {
    return Response.json({ skipped: true, reason: 'KV already has data', count: existing.length });
  }

  const seeded = EXISTING_PROJECTS.map((p) => ({ ...p, createdAt: new Date().toISOString() }));
  await env.PROJECTS_KV.put('projects', JSON.stringify(seeded));

  return Response.json({ skipped: false, count: seeded.length });
}
