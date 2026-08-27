import { decodeResume } from "../schema/resume"

// The only file to touch when career data changes. Decoded (and therefore
// validated) at module load — invalid data fails the dev server/build loudly.
export const resume = decodeResume({
  name: "Ricardo Valero",
  headline: "Software Engineer",
  summary:
    "I build typed, declarative systems — effects that declare their requirements and failures, schemas at every boundary, builds that reproduce anywhere — and I keep the tooling fast and light.",
  // Public build: contact routes through GitHub and LinkedIn only — no phone
  // or email, which are handed out deliberately rather than published.
  links: [
    {
      kind: "github",
      label: "ricardo-valero",
      href: "https://github.com/ricardo-valero/",
    },
    {
      kind: "linkedin",
      label: "ricardo-valero-de-la-rosa",
      href: "https://www.linkedin.com/in/ricardo-valero-de-la-rosa/",
    },
  ],
  work: [
    {
      name: "Manuable, S.A.P.I. de C.V.",
      url: "https://manuable.com/",
      roles: [
        {
          title: "Senior Software Engineer",
          start: "2025-04",
          projects: [
            {
              name: "Multi-provider Shipping Platform",
              bullets: [
                "Hardened provider integrations (FedEx, DHL, Estafeta): rate pricing and margins, label recovery flows, and error surfacing",
                "Built and refined UI components across the product and fixed N+1 query performance issues",
              ],
              tech: ["Ruby", "Rails", "PostgreSQL", "JavaScript"],
              demo: {
                archetype: "rate-shop",
                labels: ["FedEx", "DHL", "Estafeta"],
              },
            },
            {
              name: "Integration Hub — Provider Shipment Service",
              bullets: [
                "Designed and built solo a standalone service executing provider ship-quote/rate and label-generation calls for multiple consumer applications",
                "Stateless on tenancy: provider credentials exchanged for encrypted session bearers, never persisted at rest",
              ],
              tech: ["Elixir", "Phoenix"],
              demo: {
                archetype: "pipeline",
                labels: ["apps", "hub", "providers"],
              },
            },
            {
              name: "Data Hub — Centralized Ingestion and Transformation",
              bullets: [
                "Built ingestion pipelines landing source systems into BigQuery with a SQLMesh transformation layer, as a data-stack monorepo",
                "Consolidated earlier fragmented ETL services (Airbyte, ad-hoc GCP jobs) into a single platform",
              ],
              tech: ["Python", "dlt", "SQLMesh", "BigQuery", "GCP", "Metabase"],
              demo: {
                archetype: "pipeline",
                labels: ["sources", "dlt", "SQLMesh", "BI"],
              },
            },
            {
              name: "Invoice Data Ingestion — Spreadsheets to BigQuery",
              bullets: [
                "Transformed raw Excel, CSV, and spreadsheet invoice data into structured BigQuery ingestions with multi-sheet imports",
              ],
              tech: ["Elixir", "Phoenix", "libSQL", "BigQuery"],
              demo: {
                archetype: "form-flow",
                labels: ["invoices", "rows", "BigQuery"],
              },
            },
            {
              name: "Infrastructure Tooling",
              bullets: [
                "Built a Nix-managed CLI deploying a self-hosted PaaS (Dokploy) and compose services across AWS and GCP",
                "Fleet management for company services — machines, DNS, secrets, and deploys — one VM per app",
              ],
              tech: ["Nix", "NixOS", "Terraform", "AWS", "GCP", "Docker"],
              demo: {
                archetype: "terminal",
                labels: ["infra deploy aws", "terraform apply", "nix build"],
              },
            },
          ],
        },
      ],
    },
    {
      name: "Hitower Technohub, S. de R.L. de C.V.",
      url: "https://mx.linkedin.com/company/hitower-it",
      roles: [
        {
          title: "Senior Software Engineer",
          start: "2024-09",
          end: "2025-02",
          projects: [
            {
              name: "SEO and Content Optimization Web Service for Improved Search Rankings (Write2Rank)",
              bullets: [
                "Developed a full-stack web application for content analysis and ranking suggestions.",
                "Designed and implemented scalable backend APIs and frontend interfaces.",
              ],
              tech: [
                "PHP",
                "Laravel",
                "PostgreSQL",
                "TypeScript",
                "Node.js",
                "Next.js",
              ],
              demo: {
                archetype: "dashboard",
                labels: ["score", "keywords", "rank"],
              },
            },
            {
              name: "CI/CD Pipeline Optimizations",
              bullets: [
                "Conducted experiments to improve build times and deployment processes.",
                "Implemented reproducible builds to enhance reliability.",
                "Optimized caching and container usage for faster CI/CD.",
              ],
              tech: ["AWS", "GitLab CI", "Docker", "Nix"],
              demo: {
                archetype: "terminal",
                labels: ["docker build", "nix build", "deploy"],
              },
            },
          ],
        },
      ],
    },
    {
      name: "Diseño Control y Sistemas a la Medida, S.A. de C.V. (aka Industrial Code)",
      url: "https://industrial-code.com/",
      roles: [
        {
          title: "Senior Software Engineer",
          start: "2021-04",
          end: "2023-05",
          projects: [
            {
              name: "Assembly Line Real-time Production Monitoring Web Application",
              client: "Polaris Inc.",
              bullets: [
                "Led design and architecture of UI/UX, tech stack, database, and APIs",
              ],
              tech: [
                "TypeScript",
                "Node.js",
                "Fastify",
                "tRPC",
                "DrizzleORM",
                "PostgreSQL",
                "React",
              ],
              demo: {
                archetype: "dashboard",
                labels: ["line 1", "line 2", "takt"],
              },
            },
            {
              name: "Vehicle Registration Hybrid Web and Mobile Application (Registegic)",
              bullets: [
                "Led design and architecture of UI/UX, tech stack, database, and APIs",
              ],
              tech: [
                "AWS",
                "TypeScript",
                "Node.js",
                "Fastify",
                "tRPC",
                "Prisma",
                "PostgreSQL",
                "React",
              ],
              demo: {
                archetype: "form-flow",
                labels: ["vehicle", "owner", "plate"],
              },
            },
            {
              name: "Warehouse Repackaging Control Web Application",
              client: "Polaris Inc.",
              bullets: [
                "Led design and architecture of UI/UX, tech stack, database, and APIs",
              ],
              tech: [
                "TypeScript",
                "Node.js",
                "Fastify",
                "GraphQL",
                "Prisma",
                "PostgreSQL",
                "React",
              ],
              demo: {
                archetype: "form-flow",
                labels: ["scan", "repack", "confirm"],
              },
            },
            {
              name: "Hardware Integration for IoT",
              bullets: [
                "Designed tech stack and APIs for serial adapters, printers, tools, and IoT sensors",
              ],
              tech: ["TypeScript", "Node.js", "SQLite"],
              demo: {
                archetype: "pipeline",
                labels: ["sensors", "gateway", "API"],
              },
            },
          ],
        },
      ],
    },
    {
      name: "Tecnología en Sistemas de Integración S.A. de C.V. (TSI)",
      url: "https://www.tsi-sa.com.mx/site/es/index.php",
      roles: [
        {
          title: "Junior Software Engineer",
          start: "2019-01",
          end: "2021-02",
          projects: [
            {
              name: "Assembly Line Control Applications",
              client: "Polaris Inc.",
              bullets: [
                "Developed custom SCADA/MES, hardware integration, data collection, database design, and APIs",
              ],
              tech: ["VBScript", "Indusoft", "REST", "OpenProtocol", "ODBC"],
              demo: {
                archetype: "dashboard",
                labels: ["station", "torque", "cycle"],
              },
            },
            {
              name: "Work Shift Management Web Application",
              client: "Polaris Inc.",
              bullets: [
                "Developed a full-stack app, database design, and APIs",
              ],
              tech: ["C#", ".NET", "REST", "EntityFramework", "MSSQL", "React"],
              demo: {
                archetype: "form-flow",
                labels: ["shift", "crew", "line"],
              },
            },
            {
              name: "Assembly Line Reporting Web Application",
              client: "Polaris Inc.",
              bullets: [
                "Developed a full-stack app, database design, and APIs",
              ],
              tech: ["C#", ".NET", "REST", "EntityFramework", "MSSQL", "Razor"],
              demo: {
                archetype: "dashboard",
                labels: ["output", "downtime", "shift"],
              },
            },
          ],
        },
        {
          title: "Internship in Automation Engineering",
          start: "2018-08",
          end: "2018-12",
          projects: [
            {
              name: "Ladder-logic PLC Program Development",
              bullets: [
                "In charge of several ladder-logic PLC programs for industrial clients, on Honeywell and Rockwell controllers",
              ],
              tech: ["Ladder Logic", "Honeywell PLC", "Rockwell PLC"],
              demo: {
                archetype: "ladder",
                labels: ["start", "interlock", "motor"],
              },
            },
          ],
        },
      ],
    },
    {
      name: "Institut für Mikrostrukturtechnik (IMT), Karlsruher Institut für Technologie (KIT)",
      roles: [
        {
          title: "Internship in Advanced Materials and Optical Spectroscopy",
          start: "2017-03",
          end: "2017-07",
          projects: [
            {
              name: "Automated Dip-coating Control for SURMOF Deposition",
              bullets: [
                "Programmed MATLAB timing control for a dip-coating machine in solar-cell research: immersion, hold, withdrawal, and transfer between liquid baths",
                "Optimized thin-film deposition for large-area SURMOF layers",
              ],
              tech: ["MATLAB"],
              demo: {
                archetype: "dip-coat",
                labels: ["bath A", "bath B"],
              },
            },
          ],
        },
      ],
    },
  ],
  sideProjects: [
    {
      name: "Deplugger — Type-safe Workflow Platform",
      url: "https://deplugger.com",
      bullets: [
        "Designed an op/workflow DSL where workflows are data: every op declares input/output schemas, so composed workflows are validated end-to-end at every step",
        "Built a dual-target compiler: the same workflow runs as an ephemeral effect or compiles to a durable, replay-safe workflow with activity semantics",
        "Streaming RPC surfaces live run telemetry to the UI; credentials encrypted at rest with schema-derived secret redaction",
      ],
      tech: [
        "TypeScript",
        "Effect",
        "Bun",
        "SolidJS",
        "SQLite",
        "Nix",
        "Cloudflare",
      ],
    },
    {
      name: "Raggio — Schema Library for Elixir",
      url: "https://github.com/ricardo-valero/raggio_ex",
      bullets: [
        "Port of Effect-TS Schema to Elixir: composable, bidirectional schemas for decoding, encoding, and validation with typed errors",
      ],
      tech: ["Elixir"],
    },
  ],
  education: [
    {
      institution:
        "Universidad Autónoma de Nuevo León (UANL) — Facultad de Ingeniería Mecánica y Eléctrica (FIME)",
      program: "Bachelor in Mechanical and Electrical Engineering",
      start: "2013-08",
      end: "2018-12",
      note: "Specialization in Thermodynamics and Refrigeration",
    },
    {
      institution: "Karlsruher Institut für Technologie (KIT)",
      program: "Academic Exchange in Mechanical Engineering",
      start: "2016-08",
      end: "2017-07",
      note: "Scholarship from the German Academic Exchange Service (DAAD)",
    },
  ],
  skills: [
    {
      category: "Languages",
      items: ["TypeScript", "Python", "Ruby", "Elixir", "C#", "PHP", "SQL"],
    },
    {
      category: "Backend",
      items: [
        "Node.js",
        "Bun",
        "Deno",
        "Express",
        "Fastify",
        "tRPC",
        "Effect",
        "DrizzleORM",
        "Prisma",
        "Rails",
        "Phoenix",
        ".NET",
        "EntityFramework",
        "Laravel",
      ],
    },
    {
      category: "Data",
      items: ["dlt", "SQLMesh", "BigQuery", "Metabase"],
    },
    {
      category: "Frontend",
      items: ["Next.js", "React", "SolidJS", "Svelte", "WebAPIs", "WASM"],
    },
    {
      category: "DevOps",
      items: [
        "AWS",
        "GCP",
        "Docker",
        "Nix",
        "Terraform",
        "GitLab CI",
        "GitHub Actions",
      ],
    },
    {
      category: "Databases",
      items: ["PostgreSQL", "MariaDB", "MSSQL", "SQLite"],
    },
    {
      category: "Protocols",
      items: [
        "SSH",
        "HTTP",
        "WebSockets",
        "REST",
        "GraphQL",
        "gRPC",
        "OpenProtocol",
        "ODBC",
      ],
    },
    {
      category: "Daily Drivers",
      items: [
        "macOS",
        "Ghostty",
        "Zed",
        "Claude Code",
        "opencode",
        "Nix",
        "direnv",
        "OpenSpec",
      ],
    },
  ],
  languages: [
    { name: "Spanish", level: "native" },
    { name: "English", level: "advanced" },
    { name: "German", level: "basic" },
  ],
})
