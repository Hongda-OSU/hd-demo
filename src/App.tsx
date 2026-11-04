import { useEffect, useMemo, useState } from 'react'
import { firstProject, loadDemos, sidebarSections, VERSIONS, type Version } from './lib/loadDemos'
import { useRoute } from './lib/router'
import { isNarrow, useNarrow } from './lib/narrow'
import DemoView from './components/DemoView'
import EmbedView from './components/EmbedView'
import Sidebar from './components/Sidebar'

const SIDEBAR_WIDTH = 240
const MIN_WIDTH = 200
const MAX_WIDTH = 480
const COLLAPSED_KEY = 'hd-demo:sidebar-collapsed'
const WIDTH_KEY = 'hd-demo:sidebar-width'

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

/** Sidebar width on a wide screen, set by dragging its edge, and remembered. */
function useSidebarWidth() {
  const clamp = (w: number) => Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, Math.round(w)))
  const [width, setWidth] = useState(() => {
    const stored = Number(localStorage.getItem(WIDTH_KEY))
    return stored ? clamp(stored) : SIDEBAR_WIDTH
  })

  useEffect(() => {
    localStorage.setItem(WIDTH_KEY, String(width))
  }, [width])

  return [width, (w: number) => setWidth(clamp(w))] as const
}

export default function App() {
  const projects = useMemo(() => loadDemos(), [])
  const sections = useMemo(() => sidebarSections(projects), [projects])
  const { route, navigate, replace } = useRoute()
  const [collapsed, setCollapsed] = useSidebarCollapsed()
  const [width, setWidth] = useSidebarWidth()
  const [dragging, setDragging] = useState(false)
  const narrow = useNarrow()

  const isEmbed = route.segments[0] === 'embed'
  const slug = isEmbed ? route.segments[1] : route.segments[0]
  const project = projects.find((p) => p.id === slug)

  const rawVersion = route.query.get('v')
  const version = VERSIONS.includes(rawVersion as Version) ? (rawVersion as Version) : null

  // Bare "/" has no project in the URL — put the first one there so every view is linkable.
  useEffect(() => {
    const first = firstProject(sections)
    if (!isEmbed && !slug && first) replace(first.id)
  }, [isEmbed, slug, sections, replace])

  if (isEmbed) return <EmbedView project={project} version={version} />

  const drawerOpen = narrow && !collapsed
  // The drawer keeps its fixed width; only the docked sidebar resizes.
  const sidebarWidth = narrow ? SIDEBAR_WIDTH : width

  return (
    <div
      style={{
        display: 'flex',
        height: '100dvh',
        background: 'var(--bg)',
        color: 'var(--text)',
        ...(dragging ? ({ cursor: 'col-resize', userSelect: 'none' } as const) : null),
      }}
    >
      {/* Narrow: the sidebar floats over the content as a drawer rather than
          taking 240 of 390px from the demo itself. */}
      <aside
        className="sidebar-scroll"
        style={{
          width: collapsed ? 0 : sidebarWidth,
          flexShrink: 0,
          background: 'var(--bg-raised)',
          borderRight: collapsed ? 'none' : '1px solid var(--border)',
          overflowX: 'hidden',
          overflowY: 'auto',
          scrollbarWidth: 'none',
          // Follow the pointer directly while dragging.
          transition: dragging ? 'none' : 'width 0.2s ease',
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
        <div style={{ width: sidebarWidth }}>
          <Sidebar
            sections={sections}
            activeId={project?.id}
            onSelect={(id) => {
              navigate(id)
              if (narrow) setCollapsed(true)
            }}
            shortcut={!collapsed && !narrow}
          />
        </div>
      </aside>

      {/* The window-splitter pattern: drag it, or focus it and use the arrows. */}
      {!narrow && !collapsed && (
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize demo list"
          aria-valuenow={width}
          aria-valuemin={MIN_WIDTH}
          aria-valuemax={MAX_WIDTH}
          tabIndex={0}
          className="sidebar-resizer"
          data-dragging={dragging || undefined}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            setDragging(true)
          }}
          onPointerMove={(e) => {
            if (dragging) setWidth(e.clientX)
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setWidth(width - 16)
            if (e.key === 'ArrowRight') setWidth(width + 16)
          }}
          style={{
            width: 7,
            margin: '0 -3px',
            flexShrink: 0,
            zIndex: 10,
            cursor: 'col-resize',
            touchAction: 'none',
          }}
        />
      )}

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
          // The preview iframe would swallow the drag once the pointer crosses it.
          pointerEvents: dragging ? 'none' : undefined,
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
