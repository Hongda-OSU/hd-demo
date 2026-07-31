export type Version = 'html' | 'react'

export interface DemoConfig {
  title?: string
  description?: string
  entry?: string
  dependencies?: Record<string, string>
  externalResources?: string[]
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

export function projectTitle(project: Project): string {
  return (project.html?.config || project.react?.config)?.title || project.id
}

export function availableVersions(project: Project): Version[] {
  return VERSIONS.filter((v) => project[v])
}
