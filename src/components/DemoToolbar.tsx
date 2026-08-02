import { useEffect, useState } from 'react'
import type { DemoConfig, Version } from '../lib/loadDemos'
import { embedSnippet } from '../lib/embed'
import {
  CheckIcon,
  EmbedIcon,
  ExternalIcon,
  HtmlIcon,
  MenuIcon,
  PackageIcon,
  ReactIcon,
} from './icons'

// Square, so an icon sits centred with no label to balance against.
const iconButton = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  padding: 0,
  borderRadius: 6,
  border: '1px solid var(--border)',
} as const

interface DemoToolbarProps {
  config: DemoConfig
  fallbackTitle: string
  versions: Version[]
  active: Version
  onVersionChange: (version: Version) => void
  previewUrl: string
  narrow: boolean
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function DemoToolbar({
  config,
  fallbackTitle,
  versions,
  active,
  onVersionChange,
  previewUrl,
  narrow,
  sidebarCollapsed,
  onToggleSidebar,
}: DemoToolbarProps) {
  const [copied, setCopied] = useState(false)
  const [showDeps, setShowDeps] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(timer)
  }, [copied])

  // Close the dependency panel on Escape or a click anywhere outside it.
  useEffect(() => {
    if (!showDeps) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowDeps(false)
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-deps]')) setShowDeps(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('click', onClick)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('click', onClick)
    }
  }, [showDeps])

  // Switching demo or version should not leave a stale panel open.
  useEffect(() => setShowDeps(false), [previewUrl])

  const dependencies = Object.entries(config.dependencies || {})
  const externals = config.externalResources || []
  const depCount = dependencies.length + externals.length

  async function copySnippet() {
    const snippet = embedSnippet(previewUrl)
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
    } catch {
      // Clipboard needs a secure context and permission; fall back to a prompt
      // so the snippet is still reachable either way.
      window.prompt('Copy the embed snippet:', snippet)
    }
  }

  return (
    /* Narrow: this row is the whole toolbar — burger on the left, controls on
       the right. The title and description drop out; the drawer names the demo,
       and the row has to fit five controls on a 390px screen. */
    <header
      style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: narrow ? 'center' : 'baseline',
        gap: narrow ? 8 : 12,
        padding: narrow ? '8px 10px' : 0,
        marginBottom: narrow ? 0 : 12,
        borderBottom: narrow ? '1px solid var(--border)' : 'none',
        background: narrow ? 'var(--bg-raised)' : 'transparent',
      }}
    >
      {/* The only sidebar toggle, on both layouts — on narrow it opens the
          drawer, on desktop it collapses the column. */}
      <button
        onClick={onToggleSidebar}
        aria-expanded={!sidebarCollapsed}
        aria-label={sidebarCollapsed ? 'Show demo list' : 'Hide demo list'}
        title={sidebarCollapsed ? 'Show demo list' : 'Hide demo list'}
        style={{ ...iconButton, background: 'transparent', color: 'var(--text-muted)' }}
      >
        <MenuIcon />
      </button>

      {!narrow && (
        <h1 style={{ margin: 0, fontSize: 16, flexShrink: 0 }}>{config.title || fallbackTitle}</h1>
      )}
      {!narrow && config.description && (
        // Truncates instead of pushing the controls off the row.
        <p
          style={{
            margin: 0,
            fontSize: 13,
            color: 'var(--text-muted)',
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={config.description}
        >
          {config.description}
        </p>
      )}

      {/* flexShrink:0 so the controls keep their size whatever the description
          does. The version buttons switch what you are looking at; the rest are
          actions, so a rule separates them. */}
      <div style={{ display: 'flex', gap: 6, marginLeft: 'auto', flexShrink: 0, paddingLeft: 12 }}>
        {versions.length > 1 && (
          <>
            <div role="group" aria-label="Version" style={{ display: 'flex', gap: 6 }}>
              {versions.map((v) => {
                const label = v === 'html' ? 'HTML version' : 'React version'
                return (
                  <button
                    key={v}
                    onClick={() => onVersionChange(v)}
                    aria-pressed={v === active}
                    aria-label={label}
                    title={label}
                    style={{
                      ...iconButton,
                      background: v === active ? 'var(--bg-active)' : 'transparent',
                      color: v === active ? 'var(--text)' : 'var(--text-muted)',
                      cursor: v === active ? 'default' : 'pointer',
                    }}
                  >
                    {v === 'html' ? <HtmlIcon /> : <ReactIcon />}
                  </button>
                )
              })}
            </div>
            <span aria-hidden style={{ width: 1, background: 'var(--border)', margin: '0 4px' }} />
          </>
        )}

        {/* Always rendered, even at zero: "depends on nothing" is worth saying
            about a plain three-file demo, and a button that came and went with
            the version would shift the others out from under the cursor. */}
        <div data-deps style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDeps((s) => !s)}
            disabled={depCount === 0}
            aria-expanded={showDeps}
            aria-label={`Libraries (${depCount})`}
            title={
              depCount === 0 ? 'No libraries — plain HTML, CSS and JS' : 'What this demo pulls in'
            }
            style={{
              ...iconButton,
              // The count stays: it is the one thing the icon cannot say, and it
              // is what tells you whether opening the panel is worthwhile.
              width: 'auto',
              gap: 5,
              padding: '0 9px',
              background: showDeps ? 'var(--bg-active)' : 'transparent',
              color: showDeps ? 'var(--text)' : 'var(--text-muted)',
              cursor: depCount === 0 ? 'default' : 'pointer',
              opacity: depCount === 0 ? 0.5 : 1,
            }}
          >
            <PackageIcon />
            <span style={{ fontSize: 12 }}>{depCount}</span>
          </button>

          {showDeps && <DependencyPanel dependencies={dependencies} externals={externals} />}
        </div>

        {/* An <a>, not window.open — cmd-click, middle-click and "open in new
            window" all keep working, and no popup blocker gets involved. */}
        <a
          href={previewUrl}
          target="_blank"
          rel="noreferrer"
          aria-label="Open preview in a new tab"
          title="Open preview in a new tab"
          style={{ ...iconButton, color: 'var(--text-muted)' }}
        >
          <ExternalIcon />
        </a>

        <button
          onClick={copySnippet}
          aria-label="Copy embed snippet"
          title={copied ? 'Copied' : 'Copy an <iframe> snippet for this demo'}
          style={{
            ...iconButton,
            background: 'transparent',
            color: copied ? '#62aeef' : 'var(--text-muted)',
            cursor: 'pointer',
          }}
        >
          {copied ? <CheckIcon /> : <EmbedIcon />}
        </button>
      </div>
    </header>
  )
}

interface DependencyPanelProps {
  dependencies: [string, string][]
  externals: string[]
}

// Overlaid rather than inline: an inline panel would shrink the measured box
// and resize the editor every time it opened.
function DependencyPanel({ dependencies, externals }: DependencyPanelProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'calc(100% + 6px)',
        right: 0,
        zIndex: 10,
        minWidth: 260,
        maxWidth: 420,
        padding: 12,
        borderRadius: 8,
        border: '1px solid var(--border)',
        background: 'var(--bg-raised)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
        fontSize: 12,
        textAlign: 'left',
      }}
    >
      {dependencies.length > 0 && (
        <>
          <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>npm dependencies</div>
          <ul style={{ margin: '0 0 10px', paddingLeft: 16 }}>
            {dependencies.map(([name, range]) => (
              <li key={name} style={{ marginBottom: 2 }}>
                <code>
                  {name}@{range}
                </code>
              </li>
            ))}
          </ul>
        </>
      )}

      {externals.length > 0 && (
        <>
          <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>External resources</div>
          <ul style={{ margin: 0, paddingLeft: 16 }}>
            {externals.map((url) => (
              <li key={url} style={{ marginBottom: 2, wordBreak: 'break-all' }}>
                <a href={url} target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }}>
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
