## Purpose

Guarantees that every project on the résumé states what the author personally
contributed, as a claim structurally distinct from the project's description, so that no
project can be published without one and readers can tell the two kinds of statement
apart.

## ADDED Requirements

### Requirement: Every project declares a personal contribution

Each project entry in the résumé data SHALL carry a non-empty contribution statement
describing what the author personally did, decided, or changed — distinct from what the
project was. This statement SHALL be a required part of a project's structure, not an
optional annotation.

#### Scenario: Project data omits a contribution

- **WHEN** résumé data is loaded and any project entry lacks a contribution statement
- **THEN** decoding fails with an error identifying the offending project
- **AND** the dev server and the production build fail rather than rendering an
  incomplete project

#### Scenario: Project data supplies an empty contribution

- **WHEN** a project entry supplies a contribution that is empty or whitespace-only
- **THEN** decoding fails, the same as an omitted contribution

#### Scenario: Every project supplies a contribution

- **WHEN** all project entries supply non-empty contribution statements
- **THEN** decoding succeeds and every project exposes its contribution to render targets

### Requirement: Contribution statements are distinct per project

No two projects SHALL carry identical contribution text, and no contribution SHALL
duplicate the text of any of its own project's descriptive bullets. A contribution that
restates the project description conveys nothing the description does not already.

#### Scenario: Reviewing the rendered résumé

- **WHEN** a reader scans consecutive projects within the same role
- **THEN** each project's contribution names something specific to that project — a
  decision made, a constraint solved, an outcome owned, or people led
- **AND** no contribution text is repeated across projects

### Requirement: Independent work carries no contribution field

Side projects SHALL NOT carry a contribution statement. Independent work is wholly the
author's by construction, so the field would assert nothing and its presence would imply
the distinction is meaningful there.

#### Scenario: Side project data includes a contribution

- **WHEN** a side-project entry supplies a contribution field
- **THEN** decoding rejects it as an unknown field

### Requirement: Contributions render distinctly from bullets

Every view that renders a project SHALL present its contribution with visual treatment
distinct from that project's descriptive bullets, so the reader can distinguish "what
this was" from "what was mine" without reading both. The contribution SHALL NOT be
rendered as an additional item in the bullet list.

#### Scenario: Reading a project in the document view

- **WHEN** a project is rendered in the document view
- **THEN** its contribution appears set apart from the bullet list by typography,
  position, or both
- **AND** it is legible as a different kind of statement than the bullets

#### Scenario: Reading a project in the timeline view

- **WHEN** a project is rendered in the timeline view
- **THEN** its contribution is likewise distinguished from that project's bullets

#### Scenario: Exporting to PDF

- **WHEN** the PDF is generated from the built document view
- **THEN** the contribution appears with the same distinction it has on screen, since the
  PDF is a render target of that view rather than a separate document

### Requirement: Employer-owned work is described without being linked

Project entries describing work owned by an employer SHALL NOT link to private or
employer-controlled repositories. Evidence of such work SHALL be conveyed by description
alone.

#### Scenario: A project's supporting repository is private

- **WHEN** a project's underlying repository is private or owned by an employer
- **THEN** no URL to it appears in the résumé data or any render target
- **AND** the contribution conveys the substance — scope, decisions, measurable
  outcomes — without requiring the reader to open anything
