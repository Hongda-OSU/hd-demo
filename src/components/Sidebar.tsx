import { useState } from 'react'
import { projectTitle, type Project, type SidebarEntry } from '../lib/loadDemos'
import { ChevronIcon } from './icons'

interface Props {
  entries: SidebarEntry[]
  activeId: string | undefined
  onSelect: (id: string) => void
}

/**
 * The demo list. A group opens on its own when it holds the demo being shown,
 * so a deep link never lands on a hidden entry; a click on its heading then
 * overrides that either way.
 */
export default function Sidebar({ entries, activeId, onSelect }: Props) {
  const [toggled, setToggled] = useState<Record<string, boolean>>({})

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
        padding: indent ? '10px 16px 10px 40px' : '12px 16px',
        background: project.id === activeId ? 'var(--bg-active)' : 'transparent',
        color: 'var(--text)',
        textDecoration: 'none',
      }}
    >
      {projectTitle(project)}
    </a>
  )

  return (
    <nav>
      {entries.map((entry) => {
        if (entry.kind === 'demo') return link(entry.project, false)

        const holdsActive = entry.projects.some((p) => p.id === activeId)
        const open = toggled[entry.name] ?? holdsActive
        return (
          <div key={entry.name}>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setToggled((t) => ({ ...t, [entry.name]: !open }))}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                background: 'transparent',
                color: holdsActive && !open ? 'var(--text)' : 'var(--text-muted)',
                font: 'inherit',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  transform: open ? 'rotate(90deg)' : 'none',
                  transition: 'transform 0.15s ease',
                }}
              >
                <ChevronIcon />
              </span>
              {entry.name}
              <span style={{ marginLeft: 'auto', fontSize: 12 }}>{entry.projects.length}</span>
            </button>
            {open && entry.projects.map((p) => link(p, true))}
          </div>
        )
      })}
    </nav>
  )
}
