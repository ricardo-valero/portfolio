import { Window } from 'happy-dom'
import { readFileSync } from 'node:fs'

const viewId = process.argv[2] ?? 'document'
const window = new Window({ url: `http://localhost/#/${viewId}` })
const { document } = window
for (const key of ['document', 'window', 'navigator', 'location', 'history', 'HTMLElement', 'Element', 'Node', 'NodeList', 'HTMLCollection', 'SVGElement', 'CustomEvent', 'Event', 'KeyframeEffect', 'Animation', 'MutationObserver', 'ResizeObserver', 'getComputedStyle', 'requestAnimationFrame', 'cancelAnimationFrame', 'matchMedia', 'IntersectionObserver', 'CSS', 'performance', 'queueMicrotask']) {
  if (!(key in globalThis) && window[key] !== undefined) globalThis[key] = window[key]
}
globalThis.window = window
if (!globalThis.IntersectionObserver) {
  globalThis.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} }
  window.IntersectionObserver = globalThis.IntersectionObserver
}
document.body.innerHTML = '<div id="root"></div>'

const js = readFileSync('dist/assets/' + (await import('node:fs')).readdirSync('dist/assets').find(f => f.endsWith('.js')), 'utf8')
const blobUrl = 'data:text/javascript;base64,' + Buffer.from(js).toString('base64')
await import(blobUrl)
await new Promise(r => setTimeout(r, 300))

if (viewId === 'rapid') {
  // rapid view switching: two hash changes back-to-back; last must win, no throws
  const errors = []
  window.addEventListener('error', (e) => errors.push(e.message))
  window.location.hash = '/timeline'
  window.dispatchEvent(new window.Event('hashchange'))
  await new Promise(r => setTimeout(r, 30))
  window.location.hash = '/document'
  window.dispatchEvent(new window.Event('hashchange'))
  await new Promise(r => setTimeout(r, 1200))
  const finalHtml = document.getElementById('root').innerHTML
  const ok = finalHtml.includes('document-skill-row') && !finalHtml.includes('timeline-entry') && errors.length === 0
  console.log(ok ? '✓' : '✗', 'rapid switch: document wins, no errors', errors)
  process.exit(ok ? 0 : 1)
}

const html = document.getElementById('root').innerHTML
const checks = viewId === 'timeline'
  ? {
      'renders name': html.includes('Ricardo Valero'),
      'timeline entries (8 roles+edu)': (html.match(/timeline-entry/g) ?? []).length >= 8,
      'ongoing role first': html.indexOf('Manuable') < html.indexOf('Hitower'),
      'present range rendered': html.includes('04.2025 – Present'),
      'chronological (newest first)': html.indexOf('Hitower') < html.indexOf('Karlsruher Institut'),
      'work and education mixed': html.includes('Senior Software Engineer') && html.includes('Academic Exchange'),
      'collapsible details': html.includes('DrizzleORM'),
      'demo stages in timeline': (html.match(/demo-stage/g) ?? []).length >= 10,
      'contributions rendered apart from bullets': (html.match(/timeline-contribution/g) ?? []).length >= 15,
      'dated side projects join the chronology': html.includes('Independent work'),
    }
  : {
      'renders name': html.includes('Ricardo Valero'),
      'renders headline': html.includes('Software Engineer'),
      'work section': html.includes('Manuable') && html.includes('Hitower') && html.includes('Industrial Code') && html.includes('Polaris'),
      'present range rendered': html.includes('04.2025 – Present'),
      'education': html.includes('UANL') && html.includes('Karlsruher'),
      'skills': html.includes('PostgreSQL') && html.includes('Protocols') && html.includes('dlt'),
      'switcher buttons': html.includes('Timeline') && html.includes('Document'),
      'tech chips': html.includes('DrizzleORM') && html.includes('Elixir'),
      'demo stages in document (15 tagged)': (html.match(/demo-stage/g) ?? []).length >= 15,
      'demo archetypes render': html.includes('demo-rateshop') && html.includes('demo-pipeline') && html.includes('demo-terminal') && html.includes('demo-formflow') && html.includes('demo-dashboard'),
      'every project shows a contribution (17)': (html.match(/document-contribution/g) ?? []).length === 17,
      'contribution is not a bullet': !/<li[^>]*class="[^"]*contribution/.test(html),
      'no em dashes in rendered content': !html.includes('—'),
    }
let pass = true
for (const [name, ok] of Object.entries(checks)) { console.log(ok ? '✓' : '✗', name); if (!ok) pass = false }
console.log('root html size:', html.length)
process.exit(pass ? 0 : 1)
