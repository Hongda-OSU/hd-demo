import { useEffect, useMemo, useRef, useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { atomDark, sandpackDark } from '@codesandbox/sandpack-themes'
import './sandpack-fill.css'
import { availableVersions, type Project, type Version } from '../lib/loadDemos'
import { sandpackSetup, templateFor } from '../lib/sandpack'
import { CheckIcon, EmbedIcon, HtmlIcon, PackageIcon, ReactIcon } from './icons'

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

/**
 * Measures its own box so Sandpack can be given an explicit pixel height.
 *
 * Percentage heights don't survive Sandpack's internals: pane height comes from
 * the Stitches token `$layout$height` (default 300px), injected at runtime and
 * outranking any stylesheet rule, and the surrounding chain is deep enough that
 * a single unset link makes the whole thing size to content instead. Measuring
 * sidesteps all of it.
 */
function useMeasuredHeight() {
  const ref = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => setHeight(entry.contentRect.height))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, height }
}

/**
 * The <iframe> snippet another site would paste to embed this demo.
 *
 * Absolute, because the point is to run it off-site — BASE_URL alone is a path.
 * The version is pinned only when the demo has more than one, so single-version
 * demos get a clean URL and stay correct if the other version is added later.
 */
function embedSnippet(projectId: string, version: Version, pinVersion: boolean) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}embed/${projectId}`
  const url = pinVersion ? `${base}?v=${version}` : base
  return `<iframe src="${url}"\n        style="width:100%;height:520px;border:0"></iframe>`
}

interface DemoViewProps {
  project: Project
  version: Version | null
  onVersionChange: (version: Version) => void
}

export default function DemoView({ project, version, onVersionChange }: DemoViewProps) {
  const { ref: boxRef, height } = useMeasuredHeight()
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
  useEffect(() => setShowDeps(false), [project.id, version])

  // sandpackDark has the neutral greys we want, but its syntax palette is all
  // one hue — keyword, string and property are each a shade of lime, so nothing
  // reads apart. Surfaces and accent from sandpackDark, syntax from atomDark.
  const theme = useMemo(
    () => ({
      ...sandpackDark,
      syntax: atomDark.syntax,
      layout: { height: `${height}px`, headerHeight: '40px' },
    }),
    [height],
  )

  const available = availableVersions(project)
  const active = version && available.includes(version) ? version : available[0]
  const variant = project[active]

  if (!variant) return <p>This demo has no versions.</p>

  const setup = sandpackSetup(variant, active)
  const dependencies = Object.entries(variant.config.dependencies || {})
  const externals = variant.config.externalResources || []
  const depCount = dependencies.length + externals.length

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <header
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 16, flexShrink: 0 }}>
          {variant.config.title || project.id}
        </h1>
        {variant.config.description && (
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
            title={variant.config.description}
          >
            {variant.config.description}
          </p>
        )}

        {/* flexShrink:0 so the controls keep their size whatever the description
            does. The version tabs switch what you are looking at; Embed is an
            action, so it sits apart rather than reading as a third version. */}
        <div
          style={{
            display: 'flex',
            gap: 6,
            marginLeft: 'auto',
            flexShrink: 0,
            paddingLeft: 12,
          }}
        >
          {available.length > 1 && (
            <>
              <div role="group" aria-label="Version" style={{ display: 'flex', gap: 6 }}>
                {available.map((v) => (
                  <button
                    key={v}
                    onClick={() => onVersionChange(v)}
                    aria-pressed={v === active}
                    aria-label={v === 'html' ? 'HTML version' : 'React version'}
                    title={v === 'html' ? 'HTML version' : 'React version'}
                    style={{
                      ...iconButton,
                      background: v === active ? 'var(--bg-active)' : 'transparent',
                      color: v === active ? 'var(--text)' : 'var(--text-muted)',
                      cursor: v === active ? 'default' : 'pointer',
                    }}
                  >
                    {v === 'html' ? <HtmlIcon /> : <ReactIcon />}
                  </button>
                ))}
              </div>
              <span
                aria-hidden
                style={{
                  width: 1,
                  background: 'var(--border)',
                  margin: '0 4px',
                }}
              />
            </>
          )}

          {/* Always rendered, even at zero: "depends on nothing" is worth saying
              about a plain three-file demo, and a button that came and went with
              the version would shift the tabs out from under the cursor. */}
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
                // The count stays: it is the one thing the icon cannot say, and
                // it is what tells you whether opening the panel is worthwhile.
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

            {showDeps && (
              // Overlaid rather than inline: an inline panel would shrink the
              // measured box and resize the editor every time it opens.
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
                    <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
                      npm dependencies
                    </div>
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
                    <div style={{ color: 'var(--text-muted)', marginBottom: 6 }}>
                      External resources
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 16 }}>
                      {externals.map((url) => (
                        <li key={url} style={{ marginBottom: 2, wordBreak: 'break-all' }}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: 'var(--text)' }}
                          >
                            {url}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={async () => {
              const snippet = embedSnippet(project.id, active, available.length > 1)
              try {
                await navigator.clipboard.writeText(snippet)
                setCopied(true)
              } catch {
                // Clipboard needs a secure context and permission; fall back to
                // a prompt so the snippet is still reachable either way.
                window.prompt('Copy the embed snippet:', snippet)
              }
            }}
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

      {/* This div is the measured box. Sandpack renders only once it has a real
          height, and then gets that height in pixels rather than percentages.
          Using the <Sandpack> preset rather than composing the parts: the
          draggable split between editor and preview is preset-only. */}
      <div ref={boxRef} style={{ flex: 1, minHeight: 0 }}>
        {height > 0 && (
          <Sandpack
            key={`${project.id}:${active}`} // force remount on switch
            template={templateFor(active)}
            theme={theme}
            files={setup.files}
            customSetup={setup.customSetup}
            options={{
              ...setup.options,
              // No showLineNumbers: readOnly makes Sandpack skip CodeMirror and
              // render static highlighted markup, and line numbers are a
              // CodeMirror extension. Setting it here would only mislead.
              readOnly: true,
              showReadOnly: false,
              showTabs: true,
              resizablePanels: true,
              editorHeight: height,
            }}
          />
        )}
      </div>
    </div>
  )
}
