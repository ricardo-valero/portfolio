## Purpose

Ensures the résumé's rendered chronology accounts for the periods between employment, so
that time spent on independent work reads as deliberate work rather than as an
unexplained absence a reader must ask about.

## ADDED Requirements

### Requirement: Independent work may carry dates

Side-project entries SHALL be able to declare a start period and an optional end period,
using the same year-month form as employment. Entries without dates SHALL remain valid,
since not all independent work occupies a definite period.

#### Scenario: A side project declares a start and end

- **WHEN** a side-project entry declares a start and an end period
- **THEN** decoding succeeds and both are exposed to render targets

#### Scenario: A side project declares a start with no end

- **WHEN** a side-project entry declares a start but no end
- **THEN** the work is treated as ongoing, consistent with how an ongoing role is
  represented

#### Scenario: A side project declares no dates

- **WHEN** a side-project entry omits dates entirely
- **THEN** decoding succeeds and views render the entry without a period

#### Scenario: A malformed period is supplied

- **WHEN** a date is supplied in any form other than year-month
- **THEN** decoding fails, consistent with date handling elsewhere in the résumé

### Requirement: Chronological views show independent work in sequence

Views that present the career as a chronology SHALL place dated independent work in that
chronology alongside employment, so a period between roles is visibly occupied.

#### Scenario: Independent work falls between two roles

- **WHEN** a dated side project spans a period between the end of one role and the start
  of the next
- **THEN** the chronological view shows that work in the intervening period
- **AND** the period does not read as an unaccounted gap

#### Scenario: Independent work overlaps employment

- **WHEN** a dated side project overlaps a period of employment
- **THEN** both are shown; the overlap is not treated as a conflict
