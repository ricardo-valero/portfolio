import { Schema } from "effect"

/**
 * Resume schema — the single source of truth for the shape of career data.
 * Every render target (views, future generators) consumes the decoded type.
 */

const YearMonth = Schema.String.check(
  Schema.isPattern(/^\d{4}-(0[1-9]|1[0-2])$/),
)

const HttpUrl = Schema.String.check(Schema.isPattern(/^https?:\/\//))

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
  name: Schema.NonEmptyString,
  client: Schema.optionalKey(Schema.NonEmptyString),
  bullets: Schema.Array(Schema.NonEmptyString),
  tech: Schema.Array(TechName),
  demo: Schema.optionalKey(Demo),
})

// Independent work outside employment — no client/role framing, no demos.
const SideProject = Schema.Struct({
  name: Schema.NonEmptyString,
  url: Schema.optionalKey(HttpUrl),
  bullets: Schema.Array(Schema.NonEmptyString),
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
  institution: Schema.NonEmptyString,
  program: Schema.NonEmptyString,
  start: YearMonth,
  end: YearMonth,
  note: Schema.optionalKey(Schema.NonEmptyString),
})

const SkillCategory = Schema.Struct({
  category: Schema.NonEmptyString,
  items: Schema.Array(TechName),
})

const SpokenLanguage = Schema.Struct({
  name: Schema.NonEmptyString,
  level: Schema.Literals(["native", "advanced", "basic"]),
})

export const Resume = Schema.Struct({
  name: Schema.NonEmptyString,
  headline: Schema.NonEmptyString,
  summary: Schema.optionalKey(Schema.NonEmptyString),
  links: Schema.Array(ContactLink),
  work: Schema.Array(Company),
  sideProjects: Schema.Array(SideProject),
  education: Schema.Array(EducationEntry),
  skills: Schema.Array(SkillCategory),
  languages: Schema.Array(SpokenLanguage),
})

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

export const decodeResume = Schema.decodeUnknownSync(Resume)
