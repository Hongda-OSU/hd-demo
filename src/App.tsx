import { useEffect, useMemo, useState } from 'react'
import { loadDemos, projectTitle, VERSIONS, type Version } from './lib/loadDemos'
import { useRoute } from './lib/router'
import DemoView from './components/DemoView'
import EmbedView from './components/EmbedView'

const SIDEBAR_WIDTH = 240
const COLLAPSED_KEY = 'hd-demo:sidebar-collapsed'

export default function App() {
  const projects = useMemo(() => loadDemos(), [])
  const { route, navigate, replace } = useRoute()
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSED_KEY) === 'true',
  )

  const isEmbed = route.segments[0] === 'embed'
  const slug = isEmbed ? route.segments[1] : route.segments[0]
  const project = projects.find((p) => p.id === slug)

  const rawVersion = route.query.get('v')
  const version = VERSIONS.includes(rawVersion as Version) ? (rawVersion as Version) : null

  // Bare "/" has no project in the URL — put the first one there so every view is linkable.
  useEffect(() => {
    if (!isEmbed && !slug && projects[0]) replace(projects[0].id)
  }, [isEmbed, slug, projects, replace])

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  if (isEmbed) return <EmbedView project={project} version={version} />

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#0d0d17', color: '#eee' }}>
      <aside
        style={{
          width: collapsed ? 0 : SIDEBAR_WIDTH,
          flexShrink: 0,
          borderRight: collapsed ? 'none' : '1px solid #222',
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 0.2s ease',
        }}
      >
        <nav style={{ width: SIDEBAR_WIDTH }}>
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
        </nav>
      </aside>

      <main style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 16 }}>
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Show demo list' : 'Hide demo list'}
          title={collapsed ? 'Show demo list' : 'Hide demo list'}
          style={{
            marginBottom: 12,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid #2a2a3e',
            background: 'transparent',
            color: '#8b8b9e',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          {collapsed ? '»' : '«'}
        </button>

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
