## Purpose

Organizes the skills section so that engineering practices the author actually works by
are readable as practices, rather than being flattened into a list of tools, ensuring a
reader scanning for a capability finds it under a category that names that capability.

## ADDED Requirements

### Requirement: Practices are categorized separately from tools

The skills section SHALL distinguish engineering *practices* from the *tools* used to
carry them out. A practice SHALL NOT be listed only inside a category whose name denotes
tooling.

#### Scenario: A reader scans for spec-driven development experience

- **WHEN** a reader looks for evidence of spec-driven or AI-assisted engineering
- **THEN** they find a category naming that practice
- **AND** they do not have to infer it from a tool name appearing in a general-purpose
  tooling list

#### Scenario: A reader scans for testing experience

- **WHEN** a reader looks for automated-testing experience
- **THEN** they find a category naming testing, listing the testing tools and analysis
  used
- **AND** testing is not represented solely by its absence

### Requirement: The daily-tooling category lists only tools

The category describing day-to-day tooling SHALL contain only tools — editors, shells,
environment managers — and SHALL NOT be the sole location of any practice, framework, or
methodology.

#### Scenario: A methodology appears in the tooling category

- **WHEN** the daily-tooling category would list a methodology or practice
- **THEN** that entry belongs to a practice category instead

### Requirement: Skill claims are backed by demonstrable work

Every category SHALL list only items the author has actually used in work described
elsewhere in the résumé or in publicly verifiable projects.

#### Scenario: A skill has no corresponding work

- **WHEN** a skill would be listed with no project, role, or public repository behind it
- **THEN** it is not listed
