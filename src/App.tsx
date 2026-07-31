import { useEffect, useMemo } from 'react'
import { loadDemos, projectTitle, VERSIONS, type Version } from './lib/loadDemos'
import { useRoute } from './lib/router'
import DemoView from './components/DemoView'
import EmbedView from './components/EmbedView'

export default function App() {
  const projects = useMemo(() => loadDemos(), [])
  const { route, navigate, replace } = useRoute()

  const isEmbed = route.segments[0] === 'embed'
  const slug = isEmbed ? route.segments[1] : route.segments[0]
  const project = projects.find((p) => p.id === slug)

  const rawVersion = route.query.get('v')
  const version = VERSIONS.includes(rawVersion as Version) ? (rawVersion as Version) : null

  // Bare "/" has no project in the URL — put the first one there so every view is linkable.
  useEffect(() => {
    if (!isEmbed && !slug && projects[0]) replace(projects[0].id)
  }, [isEmbed, slug, projects, replace])

  if (isEmbed) return <EmbedView project={project} version={version} />

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d0d17', color: '#eee' }}>
      <aside
        style={{
          width: 240,
          flexShrink: 0,
          borderRight: '1px solid #222',
          overflowY: 'auto',
        }}
      >
        {projects.map((p) => (
          <a
            key={p.id}
            href={import.meta.env.BASE_URL + p.id}
            onClick={(e) => {
              e.preventDefault()
              navigate(p.id)
            }}
            style={{
              display: 'block',
              padding: '12px 16px',
              background: p.id === slug ? '#1a1a2e' : 'transparent',
              color: '#eee',
              textDecoration: 'none',
            }}
          >
            {projectTitle(p)}
          </a>
        ))}
      </aside>

      <main style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        {project ? (
          <DemoView
            project={project}
            version={version}
            onVersionChange={(v) => navigate(project.id, { v })}
          />
        ) : (
          <p>{slug ? `No demo called "${slug}".` : 'No demos yet.'}</p>
        )}
      </main>
    </div>
  )
}
