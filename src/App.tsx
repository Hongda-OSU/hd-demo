import { useEffect, useMemo, useState } from 'react'
import { firstProject, loadDemos, sidebarEntries, VERSIONS, type Version } from './lib/loadDemos'
import { useRoute } from './lib/router'
import { isNarrow, useNarrow } from './lib/narrow'
import DemoView from './components/DemoView'
import EmbedView from './components/EmbedView'
import Sidebar from './components/Sidebar'

const SIDEBAR_WIDTH = 240
const COLLAPSED_KEY = 'hd-demo:sidebar-collapsed'

/**
 * Sidebar state, remembered — but collapsed by default on a phone, where 240px
 * of list on a 390px screen leaves nothing for the demo the visitor came for.
 * An explicit choice still wins, and still persists.
 */
function useSidebarCollapsed() {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem(COLLAPSED_KEY)
    return stored === null ? isNarrow() : stored === 'true'
  })

  useEffect(() => {
    localStorage.setItem(COLLAPSED_KEY, String(collapsed))
  }, [collapsed])

  return [collapsed, setCollapsed] as const
}

export default function App() {
  const projects = useMemo(() => loadDemos(), [])
  const entries = useMemo(() => sidebarEntries(projects), [projects])
  const { route, navigate, replace } = useRoute()
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const narrow = useNarrow()

  const isEmbed = route.segments[0] === 'embed'
  const slug = isEmbed ? route.segments[1] : route.segments[0]
  const project = projects.find((p) => p.id === slug)

  const rawVersion = route.query.get('v')
  const version = VERSIONS.includes(rawVersion as Version) ? (rawVersion as Version) : null

  // Bare "/" has no project in the URL — put the first one there so every view is linkable.
  useEffect(() => {
    const first = firstProject(entries)
    if (!isEmbed && !slug && first) replace(first.id)
  }, [isEmbed, slug, entries, replace])

  if (isEmbed) return <EmbedView project={project} version={version} />

  const drawerOpen = narrow && !collapsed

  return (
    <div
      style={{ display: 'flex', height: '100dvh', background: 'var(--bg)', color: 'var(--text)' }}
    >
      {/* Narrow: the sidebar floats over the content as a drawer rather than
          taking 240 of 390px from the demo itself. */}
      <aside
        style={{
          width: collapsed ? 0 : SIDEBAR_WIDTH,
          flexShrink: 0,
          background: 'var(--bg-raised)',
          borderRight: collapsed ? 'none' : '1px solid var(--border)',
          overflowX: 'hidden',
          overflowY: 'auto',
          transition: 'width 0.2s ease',
          ...(drawerOpen
            ? ({
                position: 'fixed',
                insetBlock: 0,
                left: 0,
                zIndex: 30,
                boxShadow: '0 0 32px rgba(0, 0, 0, 0.6)',
              } as const)
            : null),
        }}
      >
        <div style={{ width: SIDEBAR_WIDTH }}>
          <Sidebar
            entries={entries}
            activeId={project?.id}
            onSelect={(id) => {
              navigate(id)
              if (narrow) setCollapsed(true)
            }}
          />
        </div>
      </aside>

      {drawerOpen && (
        <div
          onClick={() => setCollapsed(true)}
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 20,
            background: 'rgba(0, 0, 0, 0.55)',
          }}
        />
      )}

      {/* overflow:hidden, not auto — main is the height constraint the Sandpack
          panels resolve against, so it must not grow with its content. */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: narrow ? 0 : 12,
        }}
      >
        {project ? (
          <DemoView
            project={project}
            version={version}
            onVersionChange={(v) => navigate(project.id, { v })}
            narrow={narrow}
            sidebarCollapsed={collapsed}
            onToggleSidebar={() => setCollapsed((c) => !c)}
          />
        ) : (
          <p style={{ padding: 12 }}>{slug ? `No demo called "${slug}".` : 'No demos yet.'}</p>
        )}
      </main>
    </div>
  )
}
