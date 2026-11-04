export type Version = 'html' | 'react'

export interface DemoConfig {
  title?: string
  description?: string
  entry?: string
  dependencies?: Record<string, string>
  externalResources?: string[]
  category?: string
  group?: string
}

export interface DemoVariant {
  files: Record<string, string>
  config: DemoConfig
}

export interface Project {
  id: string
  html: DemoVariant | null
  react: DemoVariant | null
}

export const VERSIONS: Version[] = ['html', 'react']

// Grab the raw text of every demo file so Sandpack can render it as-is.
const rawFiles = import.meta.glob('../demos/**/*.{html,css,js,jsx,json}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

// Assemble into [{ id, html, react }]
export function loadDemos(): Project[] {
  const projects: Record<string, Project> = {}

  for (const [filePath, content] of Object.entries(rawFiles)) {
    // ../demos/<version>/<projectId>/<fileName>
    const m = filePath.match(/demos\/(html|react)\/([^/]+)\/(.+)$/)
    if (!m) continue
    const version = m[1] as Version
    const projectId = m[2]
    const fileName = m[3]

    projects[projectId] ??= { id: projectId, html: null, react: null }
    const project = projects[projectId]
    const variant = (project[version] ??= { files: {}, config: {} })

    if (fileName === 'config.json') {
      variant.config = JSON.parse(content) as DemoConfig
    } else {
      variant.files['/' + fileName] = content // Sandpack keys files by "/name"
    }
  }

  return Object.values(projects).sort((a, b) => a.id.localeCompare(b.id))
}

function projectConfig(project: Project): DemoConfig | undefined {
  return project.html?.config || project.react?.config
}

export function projectTitle(project: Project): string {
  return projectConfig(project)?.title || project.id
}

export type SidebarEntry =
  { kind: 'demo'; project: Project } | { kind: 'group'; name: string; projects: Project[] }

/**
 * The sidebar's order. Demos sharing a `group` sit under one heading, placed
 * among the rest by the group's name, so variants of one topic don't run the
 * list on. A group of one is just its demo.
 */
export function sidebarEntries(projects: Project[]): SidebarEntry[] {
  const entries: SidebarEntry[] = []
  const groups = new Map<string, Project[]>()

  for (const project of projects) {
    const name = projectConfig(project)?.group
    if (!name) entries.push({ kind: 'demo', project })
    else groups.set(name, [...(groups.get(name) ?? []), project])
  }
  for (const [name, members] of groups) {
    entries.push(
      members.length > 1
        ? { kind: 'group', name, projects: members }
        : { kind: 'demo', project: members[0] },
    )
  }

  const label = (e: SidebarEntry) => (e.kind === 'group' ? e.name : projectTitle(e.project))
  return entries.sort((a, b) => label(a).localeCompare(label(b)))
}

/** The sidebar's sections, in this order. Any other `category` follows them. */
export const CATEGORIES = ['Cursor', 'Text', 'Image', 'Card', 'Background', 'Scroll', 'UI']

export interface SidebarSection {
  name: string
  entries: SidebarEntry[]
}

/** Every demo filed under its `category`, each section ordered as above. */
export function sidebarSections(projects: Project[]): SidebarSection[] {
  const byCategory = new Map<string, Project[]>()
  for (const project of projects) {
    const name = projectConfig(project)?.category || 'Other'
    byCategory.set(name, [...(byCategory.get(name) ?? []), project])
  }

  const rank = (name: string) => {
    const i = CATEGORIES.indexOf(name)
    return i === -1 ? CATEGORIES.length : i
  }
  return [...byCategory]
    .map(([name, members]) => ({ name, entries: sidebarEntries(members) }))
    .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
}

/** A sidebar search hit: the query in the title, description, category or group. */
export function matchesQuery(project: Project, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const config = projectConfig(project)
  return [projectTitle(project), config?.description, config?.category, config?.group].some(
    (text) => text?.toLowerCase().includes(q),
  )
}

/** The sections cut down to the demos matching `query`; emptied ones drop out. */
export function filterSections(sections: SidebarSection[], query: string): SidebarSection[] {
  if (!query.trim()) return sections
  return sections.flatMap((section) => {
    const entries = section.entries.flatMap((entry): SidebarEntry[] => {
      if (entry.kind === 'demo') return matchesQuery(entry.project, query) ? [entry] : []
      const projects = entry.projects.filter((p) => matchesQuery(p, query))
      return projects.length ? [{ ...entry, projects }] : []
    })
    return entries.length ? [{ ...section, entries }] : []
  })
}

export function firstProject(sections: SidebarSection[]): Project | undefined {
  const first = sections[0]?.entries[0]
  return first?.kind === 'group' ? first.projects[0] : first?.project
}

export function availableVersions(project: Project): Version[] {
  return VERSIONS.filter((v) => project[v])
}
