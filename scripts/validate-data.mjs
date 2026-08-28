// Decodes src/data/resume.ts before the bundle is written.
//
// `vite build` type-checks and bundles but never executes app code, and
// `decodeResume` takes `unknown`, so TypeScript cannot check the inline literal
// either. Without this step invalid resume data compiled cleanly, landed in
// dist/, and threw only in the visitor's browser.
//
// ssrLoadModule runs the module in Node through Vite's own pipeline, so the
// module-load decode fires with the same resolution the app gets. Runs before
// `vite build` so bad data never reaches dist/.
import { createServer } from "vite"

const ENTRY = "/src/data/resume.ts"

const server = await createServer({
  server: { middlewareMode: true },
  appType: "custom",
  // silent: Vite logs its own SSR evaluation error with a stack through the
  // effect internals, which buries the one line that matters. We print the
  // schema issue ourselves below.
  logLevel: "silent",
})

try {
  const { resume } = await server.ssrLoadModule(ENTRY)
  const projects = resume.work.flatMap((company) =>
    company.roles.flatMap((role) => role.projects),
  )
  console.log(
    `✓ resume data valid: ${projects.length} projects, ${resume.sideProjects.length} side projects`,
  )
} catch (error) {
  // The schema error carries the offending path; the stack is noise here.
  console.error("✗ resume data invalid\n")
  console.error(error?.cause?.message ?? error?.message ?? error)
  process.exitCode = 1
} finally {
  await server.close()
}
