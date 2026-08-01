import { useEffect, useMemo, useRef, useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { atomDark, sandpackDark } from '@codesandbox/sandpack-themes'
import './sandpack-fill.css'
import { availableVersions, type Project, type Version } from '../lib/loadDemos'
import { sandpackSetup, templateFor } from '../lib/sandpack'

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

interface DemoViewProps {
  project: Project
  version: Version | null
  onVersionChange: (version: Version) => void
}

export default function DemoView({ project, version, onVersionChange }: DemoViewProps) {
  const { ref: boxRef, height } = useMeasuredHeight()

  // sandpackDark has the neutral greys we want, but its syntax palette is all
  // one hue — keyword, string and property are each a shade of lime, so nothing
  // reads apart. Surfaces from sandpackDark, syntax from atomDark's One Dark.
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

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <header
        style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'baseline',
          gap: 12,
          marginBottom: 12,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 16 }}>{variant.config.title || project.id}</h1>
        {variant.config.description && (
          <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>{variant.config.description}</p>
        )}

        {available.length > 1 && (
          <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
            {available.map((v) => (
              <button
                key={v}
                onClick={() => onVersionChange(v)}
                style={{
                  padding: '4px 12px',
                  borderRadius: 6,
                  border: '1px solid var(--border)',
                  background: v === active ? 'var(--bg-active)' : 'transparent',
                  color: 'var(--text)',
                  fontSize: 12,
                  cursor: v === active ? 'default' : 'pointer',
                }}
              >
                {v.toUpperCase()}
              </button>
            ))}
          </div>
        )}
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
              readOnly: true,
              showReadOnly: false,
              showTabs: true,
              showLineNumbers: true,
              resizablePanels: true,
              editorHeight: height,
            }}
          />
        )}
      </div>
    </div>
  )
}
