import { decodeResume } from "../schema/resume"

// The only file to touch when career data changes. Decoded (and therefore
// validated) at module load, and again by scripts/validate-data.mjs before the
// bundle is written, so invalid data fails the dev server and the build.
//
// Every project carries a `contribution`: what was distinctly mine, as opposed
// to what the project was. It is required, and the schema rejects two projects
// that share one, because interchangeable entries are the failure it exists to
// prevent.
export const resume = decodeResume({
  name: "Ricardo Valero",
  headline: "Senior Software Engineer",
  summary:
    "I build typed, declarative systems: effects that declare their requirements and failures, schemas at every boundary, builds that reproduce anywhere. I work spec-first with coding agents, writing the specification and letting the implementation follow, and I keep the tooling fast and light.",
  // Public build: contact routes through GitHub and LinkedIn only, no phone
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
              contribution:
                "I found the provider logic duplicated across three places, with business rules tangled into application code, and led the refactor that pulled them apart. Adding a carrier or fixing a broken one went from about two weeks to about a day. I review the work of the three engineers building in this codebase.",
              bullets: [
                "Provider integrations (FedEx, DHL, Estafeta): rate pricing and margins, label recovery flows, and error surfacing",
                "UI components across the product, and N+1 query fixes on the slowest paths",
              ],
              tech: ["Ruby", "Rails", "PostgreSQL", "JavaScript"],
              demo: {
                archetype: "rate-shop",
                labels: ["FedEx", "DHL", "Estafeta"],
              },
            },
            {
              name: "Integration Hub: Provider Shipment Service",
              contribution:
                "Sole author. I shaped the public contract on Stripe's event envelope and idempotency keys, so consumer apps integrate once regardless of which carrier is behind the call, and made the pure/IO split structural: carrier modules declare no HTTP library, so the compiler refuses a network call from inside one.",
              bullets: [
                "Standalone service executing ship-quote, rate, and label-generation calls for multiple consumer applications, across eight carriers",
                "Stateless on tenancy: provider credentials exchanged for encrypted session bearers, never persisted at rest",
                "73 test files, with CI gating formatting, Credo, Dialyzer, and the suite on every push",
                "Delivered spec-first: 47 specified changes in the first seven weeks",
              ],
              tech: [
                "Elixir",
                "Phoenix",
                "PostgreSQL",
                "Oban",
                "OpenAPI",
                "Nix",
              ],
              demo: {
                archetype: "pipeline",
                labels: ["apps", "hub", "providers"],
              },
            },
            {
              name: "Data Hub: Centralized Ingestion and Transformation",
              contribution:
                "Earlier engineers had written the fragmented ETL off as debt to live with. I designed the replacement and ran the migration alone, and the engineers who joined afterwards were shipping against it inside a week.",
              bullets: [
                "Ingestion pipelines landing source systems into BigQuery with a SQLMesh transformation layer, as a data-stack monorepo",
                "Consolidated earlier fragmented ETL services (Airbyte, ad-hoc GCP jobs) into a single platform",
              ],
              tech: ["Python", "dlt", "SQLMesh", "BigQuery", "GCP", "Metabase"],
              demo: {
                archetype: "pipeline",
                labels: ["sources", "dlt", "SQLMesh", "BI"],
              },
            },
            {
              name: "Invoice Data Ingestion: Spreadsheets to BigQuery",
              contribution:
                "I took the input nobody wants to own: invoices arriving as inconsistent multi-sheet workbooks, no two quite alike, and turned them into typed rows the downstream models could depend on.",
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
              contribution:
                "I made a flake.nix a requirement on every project in the company and moved our CI on both Bitbucket and GitHub to build through Nix, so a build behaves the same on a laptop as it does in CI.",
              bullets: [
                "Built a Nix-managed CLI deploying a self-hosted PaaS (Dokploy) and compose services across AWS and GCP",
                "Fleet management for company services: machines, DNS, secrets, and deploys, one VM per app",
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
              name: "SEO and Content Optimization Web Service (Write2Rank)",
              contribution:
                "I owned the analysis path end to end, from the scoring APIs through the interface that had to explain a ranking suggestion well enough for a writer to act on it.",
              bullets: [
                "Full-stack web application for content analysis and ranking suggestions",
                "Backend APIs and frontend interfaces designed to scale with content volume",
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
              contribution:
                "I brought reproducible builds into a pipeline that did not have them, so a green build stopped depending on which machine produced it, and cut build times through caching and container changes.",
              bullets: [
                "Experiments to improve build times and deployment processes",
                "Reproducible builds, and caching and container usage tuned for faster CI/CD",
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
              contribution:
                "I built the view of the whole line: many live signal sources and APIs converging into one screen an operator could read at a glance while the line was running.",
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
              name: "Production Reporting Platform (SCADA/MES)",
              client: "Polaris Inc.",
              contribution:
                "The reporting charts degraded as production history piled up. I redesigned the schema and the indexes behind them so the reports stayed usable as the data grew, normalized what the old system had flattened, and carried the migration out against live production data.",
              bullets: [
                "Reporting and charting over accumulated assembly-line production data",
                "SQL Server schema, index design, and normalization; migration performed on live data",
                "Migrated the application from .NET Framework and EF6 to .NET Core and EF Core",
              ],
              tech: [
                "C#",
                ".NET Core",
                ".NET Framework",
                "EF Core",
                "EntityFramework",
                "MSSQL",
              ],
              demo: {
                archetype: "dashboard",
                labels: ["yield", "scrap", "history"],
              },
            },
            {
              name: "Vehicle Registration Hybrid Web and Mobile Application (Registegic)",
              contribution:
                "First hybrid web and mobile build in the company and my first mobile target, and I led three junior engineers through it.",
              bullets: [
                "Hybrid web and mobile delivery from a single codebase",
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
              contribution:
                "I drove the serial hardware straight from Chrome over Web Serial, with readings streaming live into React, so the floor needed nothing installed on the machine to scan and repack.",
              bullets: [
                "Scan, repack, and confirmation flow tied to floor hardware",
              ],
              tech: [
                "TypeScript",
                "Node.js",
                "Fastify",
                "GraphQL",
                "Prisma",
                "PostgreSQL",
                "React",
                "WebSerial",
              ],
              demo: {
                archetype: "form-flow",
                labels: ["scan", "repack", "confirm"],
              },
            },
            {
              name: "Hardware Integration for IoT",
              contribution:
                "I designed the adapter layer that let one API speak to serial devices, printers, tools, and sensors that each had their own protocol and none of which agreed on anything.",
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
              contribution:
                "My first production systems: the code that pulled data off the tools on the line and made it something the plant could act on.",
              bullets: [
                "Custom SCADA/MES, hardware integration, data collection, database design, and APIs",
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
              contribution:
                "Where I learned .NET and SQL Server properly, by modelling crews and shifts that everything downstream then had to agree with.",
              bullets: ["Full-stack application, database design, and APIs"],
              tech: ["C#", ".NET", "REST", "EntityFramework", "MSSQL", "React"],
              demo: {
                archetype: "form-flow",
                labels: ["shift", "crew", "line"],
              },
            },
            {
              name: "Assembly Line Reporting Web Application",
              client: "Polaris Inc.",
              contribution:
                "My first reporting work: turning raw line output and downtime into the numbers supervisors actually ran the shift on.",
              bullets: [
                "Shift and line output reporting over collected production data",
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
              contribution:
                "Where I started: writing control logic that moved physical machinery, on hardware where a mistake stops a plant rather than a process.",
              bullets: [
                "Several ladder-logic PLC programs for industrial clients, on Honeywell and Rockwell controllers",
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
              contribution:
                "My first automation of an experiment: the timing program that made a deposition run repeatable, so results could be compared between runs rather than between operators.",
              bullets: [
                "MATLAB timing control for a dip-coating machine in solar-cell research: immersion, hold, withdrawal, and transfer between liquid baths",
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
      name: "Deplugger: Type-safe Workflow Platform",
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
      name: "Raggio: Schema Library for Elixir",
      url: "https://github.com/ricardo-valero/raggio_ex",
      start: "2026-01",
      bullets: [
        "Port of Effect-TS Schema to Elixir: composable, bidirectional schemas for decoding, encoding, and validation with typed errors",
        "Adopted in production as the domain schema layer of a company service, replacing a hand-rolled DSL",
      ],
      tech: ["Elixir"],
    },
    {
      name: "Open-source Libraries for Roc and Effect",
      url: "https://github.com/ricardo-valero/",
      start: "2023-06",
      end: "2024-09",
      bullets: [
        "Ecosystem libraries for the Roc language: parser combinators, JSON, Unicode, ANSI, GraphQL, PostgreSQL, common data structures, and an experimental VS Code extension",
        "NES and Game Boy emulators written in pure Roc, as a test of the language under a demanding workload",
        "Earlier work across the Effect TypeScript ecosystem: runtime and data-type experiments, a PostgreSQL layer, and an ESLint rule set",
      ],
      tech: ["Roc", "TypeScript", "Effect", "Nix"],
    },
  ],
  education: [
    {
      institution:
        "Universidad Autónoma de Nuevo León (UANL), Facultad de Ingeniería Mecánica y Eléctrica (FIME)",
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
      items: ["TypeScript", "C#", "Python", "Ruby", "Elixir", "PHP", "SQL"],
    },
    {
      category: "AI-Assisted Engineering",
      items: [
        "Spec-Driven Development",
        "OpenSpec",
        "Claude Code",
        "opencode",
        "Agent skill authoring",
        "Structured prompts and specifications",
        "Review of AI-generated code",
      ],
    },
    {
      category: "Backend",
      items: [
        ".NET",
        "ASP.NET",
        "EntityFramework",
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
        "Laravel",
      ],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "SolidJS", "Svelte", "WebAPIs", "WASM"],
    },
    {
      category: "Databases",
      items: ["MSSQL", "PostgreSQL", "MariaDB", "SQLite"],
    },
    {
      category: "Testing",
      items: ["ExUnit", "Playwright", "happy-dom", "Credo", "Dialyzer"],
    },
    {
      category: "DevOps",
      items: [
        "AWS",
        "GCP",
        "Docker",
        "Nix",
        "Terraform",
        "GitHub Actions",
        "GitLab CI",
        "Bitbucket Pipelines",
      ],
    },
    {
      category: "Data",
      items: ["dlt", "SQLMesh", "BigQuery", "Metabase"],
    },
    {
      category: "Protocols",
      items: [
        "REST",
        "GraphQL",
        "gRPC",
        "HTTP",
        "WebSockets",
        "SSH",
        "OpenProtocol",
        "ODBC",
      ],
    },
    {
      category: "Daily Drivers",
      items: ["macOS", "Ghostty", "Zed", "Nix", "direnv"],
    },
  ],
  languages: [
    { name: "Spanish", level: "native" },
    { name: "English", level: "advanced" },
    { name: "German", level: "basic" },
  ],
})
