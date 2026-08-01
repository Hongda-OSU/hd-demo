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
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(COLLAPSED_KEY) === 'true')

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
    <div
      style={{ display: 'flex', height: '100vh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      <aside
        style={{
          width: collapsed ? 0 : SIDEBAR_WIDTH,
          flexShrink: 0,
          background: 'var(--bg-raised)',
          borderRight: collapsed ? 'none' : '1px solid var(--border)',
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
                background: p.id === slug ? 'var(--bg-active)' : 'transparent',
                color: 'var(--text)',
                textDecoration: 'none',
              }}
            >
              {projectTitle(p)}
            </a>
          ))}
        </nav>
      </aside>

      {/* overflow:hidden, not auto — main is the height constraint the Sandpack
          panels resolve against, so it must not grow with its content. */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 12,
        }}
      >
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Show demo list' : 'Hide demo list'}
          title={collapsed ? 'Show demo list' : 'Hide demo list'}
          style={{
            flexShrink: 0,
            alignSelf: 'flex-start',
            marginBottom: 10,
            padding: '6px 10px',
            borderRadius: 6,
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          {collapsed ? '»' : '«'}
        </button>

        <div style={{ flex: 1, minHeight: 0 }}>
          {project ? (
            <DemoView
              project={project}
              version={version}
              onVersionChange={(v) => navigate(project.id, { v })}
            />
          ) : (
            <p>{slug ? `No demo called "${slug}".` : 'No demos yet.'}</p>
          )}
        </div>
      </main>
    </div>
  )
}
