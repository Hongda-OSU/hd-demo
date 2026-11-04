import { useEffect, useMemo, useRef, useState } from 'react'
import {
  filterEntries,
  firstProject,
  projectTitle,
  type Project,
  type SidebarEntry,
} from '../lib/loadDemos'
import { ChevronIcon, SearchIcon } from './icons'

interface Props {
  entries: SidebarEntry[]
  activeId: string | undefined
  onSelect: (id: string) => void
  /** Whether "/" focuses the search; off while the list is hidden or on a phone. */
  shortcut: boolean
}

const hidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
} as const

/**
 * The demo list, with a search over titles and descriptions. A group opens on its own when it holds the demo being shown,
 * so a deep link never lands on a hidden entry; a click on its heading then
 * overrides that either way. While searching, every group with a hit is open.
 */
export default function Sidebar({ entries, activeId, onSelect, shortcut }: Props) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({})
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  const searching = query.trim() !== ''
  const shown = useMemo(() => filterEntries(entries, query), [entries, query])

  // "/" jumps to the search, as on GitHub and MDN, unless already typing.
  useEffect(() => {
    if (!shortcut) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return
      const target = e.target as HTMLElement
      if (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        return
      }
      e.preventDefault()
      searchRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [shortcut])

  const link = (project: Project, indent: boolean) => (
    <a
      key={project.id}
      href={import.meta.env.BASE_URL + project.id}
      aria-current={project.id === activeId ? 'page' : undefined}
      onClick={(e) => {
        e.preventDefault()
        onSelect(project.id)
      }}
      style={{
        display: 'block',
        padding: indent ? '9px 16px 9px 14px' : '12px 16px',
        marginLeft: indent ? 22 : 0,
        borderLeft: indent ? '1px solid var(--handle)' : 'none',
        background: project.id === activeId ? 'var(--bg-active)' : 'transparent',
        color: 'var(--text)',
        fontSize: indent ? 15 : 16,
        textDecoration: 'none',
      }}
    >
      {projectTitle(project)}
    </a>
  )

  const group = (entry: Extract<SidebarEntry, { kind: 'group' }>) => {
    const holdsActive = entry.projects.some((p) => p.id === activeId)
    const open = searching || (toggled[entry.name] ?? holdsActive)
    return (
      <div key={entry.name}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setToggled((t) => ({ ...t, [entry.name]: !open }))}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            width: '100%',
            padding: '12px 16px 12px 10px',
            border: 'none',
            background: 'transparent',
            color: 'var(--text)',
            font: 'inherit',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              display: 'flex',
              color: 'var(--text-muted)',
              transform: open ? 'rotate(90deg)' : 'none',
              transition: 'transform 0.15s ease',
            }}
          >
            <ChevronIcon />
          </span>
          <span style={{ flexGrow: 1 }}>{entry.name}</span>
          <span
            style={{
              padding: '1px 7px',
              borderRadius: 10,
              background: 'var(--bg-active)',
              color: 'var(--text-muted)',
              fontSize: 12,
            }}
          >
            {entry.projects.length}
          </span>
        </button>
        {open && entry.projects.map((p) => link(p, true))}
      </div>
    )
  }

  return (
    <nav aria-label="Demos" style={{ paddingBottom: 12 }}>
      {/* Stays in view while the list scrolls under it. */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1,
          padding: '12px 12px 8px',
          background: 'var(--bg-raised)',
        }}
      >
        <label htmlFor="demo-search" style={hidden}>
          Search demos
        </label>
        <span
          style={{
            position: 'absolute',
            left: 22,
            top: 22,
            display: 'flex',
            color: 'var(--text-muted)',
            pointerEvents: 'none',
          }}
        >
          <SearchIcon />
        </span>
        <input
          ref={searchRef}
          id="demo-search"
          type="search"
          placeholder="Search demos"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            // Enter opens the first hit; Escape clears the search.
            const first = firstProject(shown)
            if (e.key === 'Enter' && searching && first) onSelect(first.id)
            if (e.key === 'Escape') setQuery('')
          }}
          style={{
            width: '100%',
            height: 36,
            padding: '0 30px 0 32px',
            border: '1px solid var(--border)',
            borderRadius: 6,
            background: 'var(--bg)',
            color: 'var(--text)',
            font: 'inherit',
            fontSize: 14,
          }}
        />
        {shortcut && !query && (
          <kbd
            aria-hidden
            style={{
              position: 'absolute',
              right: 22,
              top: 21,
              padding: '0 6px',
              border: '1px solid var(--handle)',
              borderRadius: 4,
              color: 'var(--text-muted)',
              font: 'inherit',
              fontSize: 12,
              lineHeight: '18px',
              pointerEvents: 'none',
            }}
          >
            /
          </kbd>
        )}
      </div>

      {shown.map((entry) => (entry.kind === 'demo' ? link(entry.project, false) : group(entry)))}

      {searching && shown.length === 0 && (
        <p style={{ margin: 0, padding: '12px 16px', color: 'var(--text-muted)', fontSize: 14 }}>
          No demo matches “{query.trim()}”
        </p>
      )}
    </nav>
  )
}
