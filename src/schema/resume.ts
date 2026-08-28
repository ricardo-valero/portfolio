import { Schema } from "effect"

/**
 * Resume schema: the single source of truth for the shape of career data.
 * Every render target (views, future generators) consumes the decoded type.
 */

const YearMonth = Schema.String.check(
  Schema.isPattern(/^\d{4}-(0[1-9]|1[0-2])$/),
)

const HttpUrl = Schema.String.check(Schema.isPattern(/^https?:\/\//))

/**
 * Human-readable text anywhere a reader will see it.
 *
 * - NonEmptyString admits "   ", which satisfies a required field without
 *   saying anything, so prose must contain a non-whitespace character.
 * - No em dashes. An author preference, enforced here rather than remembered:
 *   prose in this file is often drafted with assistance, and a rule that lives
 *   in the schema cannot be quietly reintroduced by the next rewrite.
 */
const Prose = Schema.NonEmptyString.check(
  Schema.isPattern(/\S/),
  Schema.isPattern(/^[^—]*$/),
)

// Tech names are structured references: views may relate a tech to every
// project that lists it, so these must stay identifiers, never prose.
const TechName = Schema.NonEmptyString

const ContactLink = Schema.Struct({
  kind: Schema.Literals(["phone", "email", "github", "linkedin", "website"]),
  label: Schema.NonEmptyString,
  href: Schema.NonEmptyString,
})

// Abstract animated preview: archetype picks the vignette, labels flavor it.
const Demo = Schema.Struct({
  archetype: Schema.Literals([
    "rate-shop",
    "pipeline",
    "dashboard",
    "terminal",
    "form-flow",
    "dip-coat",
    "ladder",
  ]),
  labels: Schema.optionalKey(Schema.Array(Schema.NonEmptyString)),
})

const Project = Schema.Struct({
  name: Prose,
  client: Schema.optionalKey(Schema.NonEmptyString),
  // What was distinctly mine on this project, as opposed to what the project
  // was. Required: a project with nothing personal to say about it is the
  // failure this field exists to catch, so it fails the build rather than
  // rendering an interchangeable entry. Uniqueness is enforced on Resume.
  contribution: Prose,
  bullets: Schema.Array(Prose),
  tech: Schema.Array(TechName),
  demo: Schema.optionalKey(Demo),
})

// Independent work outside employment: no client/role framing, no demos.
// Deliberately no `contribution`: independent work is wholly mine by
// construction, so the field would assert nothing. Excess-property checking
// at decode makes a stray one an error rather than a silent strip.
const SideProject = Schema.Struct({
  name: Prose,
  url: Schema.optionalKey(HttpUrl),
  // Dated independent work occupies the gaps between roles in chronological
  // views; undated entries stay valid and simply carry no period.
  start: Schema.optionalKey(YearMonth),
  end: Schema.optionalKey(YearMonth),
  bullets: Schema.Array(Prose),
  tech: Schema.Array(TechName),
})

const Role = Schema.Struct({
  title: Schema.NonEmptyString,
  start: YearMonth,
  // absent end = ongoing role ("Present"); no sentinel strings in data
  end: Schema.optionalKey(YearMonth),
  projects: Schema.Array(Project),
})

const Company = Schema.Struct({
  name: Schema.NonEmptyString,
  url: Schema.optionalKey(HttpUrl),
  roles: Schema.Array(Role),
})

const EducationEntry = Schema.Struct({
  institution: Prose,
  program: Prose,
  start: YearMonth,
  end: YearMonth,
  note: Schema.optionalKey(Prose),
})

const SkillCategory = Schema.Struct({
  category: Schema.NonEmptyString,
  items: Schema.Array(TechName),
})

const SpokenLanguage = Schema.Struct({
  name: Schema.NonEmptyString,
  level: Schema.Literals(["native", "advanced", "basic"]),
})

const normalize = (s: string) => s.trim().toLowerCase()

/**
 * Distinctness is a property of the whole collection, not of any one project,
 * so it lives here rather than on Project. Copy-pasted bullets are the specific
 * mistake this guards against: a contribution repeated across projects, or one
 * that merely restates a bullet of its own project, says nothing.
 *
 * Catches identical text only. Two differently-worded but equally vacuous
 * statements remain a human judgment.
 */
const contributionsAreDistinct = Schema.makeFilter<{
  readonly work: ReadonlyArray<typeof Company.Type>
}>((resume) => {
  const issues: Array<Schema.FilterIssue> = []
  const seen = new Map<string, string>()

  resume.work.forEach((company, c) =>
    company.roles.forEach((role, r) =>
      role.projects.forEach((project, p) => {
        const path = ["work", c, "roles", r, "projects", p, "contribution"]
        const key = normalize(project.contribution)

        const owner = seen.get(key)
        if (owner !== undefined) {
          issues.push({
            path,
            issue: `"${project.name}" repeats the contribution already used by "${owner}"; say what was distinct about this one`,
          })
        } else {
          seen.set(key, project.name)
        }

        if (project.bullets.some((b) => normalize(b) === key)) {
          issues.push({
            path,
            issue: `"${project.name}" has a contribution identical to one of its own bullets; the contribution must add something the description does not`,
          })
        }
      }),
    ),
  )

  return issues
})

export const Resume = Schema.Struct({
  name: Schema.NonEmptyString,
  headline: Schema.NonEmptyString,
  summary: Schema.optionalKey(Prose),
  links: Schema.Array(ContactLink),
  work: Schema.Array(Company),
  sideProjects: Schema.Array(SideProject),
  education: Schema.Array(EducationEntry),
  skills: Schema.Array(SkillCategory),
  languages: Schema.Array(SpokenLanguage),
}).check(contributionsAreDistinct)

export type Resume = typeof Resume.Type
export type Demo = typeof Demo.Type
export type DemoArchetype = Demo["archetype"]
export type Company = typeof Company.Type
export type Role = typeof Role.Type
export type Project = typeof Project.Type
export type SideProject = typeof SideProject.Type
export type EducationEntry = typeof EducationEntry.Type
export type SkillCategory = typeof SkillCategory.Type
export type ContactLink = typeof ContactLink.Type

// onExcessProperty: "error". The default strips unknown keys silently, and
// decodeUnknownSync takes `unknown`, so TypeScript does not check the inline
// literal in data/resume.ts either. Without this, a `contribution` mistakenly
// added to a side project (or any typo'd key) would vanish without a word.
export const decodeResume = Schema.decodeUnknownSync(Resume, {
  onExcessProperty: "error",
})
