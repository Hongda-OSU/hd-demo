import { useEffect, useMemo, useRef, useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import './sandpack-fill.css'
import { availableVersions, type DemoVariant, type Project, type Version } from '../lib/loadDemos'

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

export function templateFor(version: Version) {
  return version === 'react' ? 'react' : 'static'
}

// Sandpack's react template ships its own /App.js plus an /index.js that does
// `import App from "./App"`. A demo entry named App.jsx loses that resolution —
// the extensionless specifier finds the template's App.js first. So we write the
// mount file ourselves and import the entry *with* its extension.
function reactEntryFile(entry: string) {
  return `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./${entry}";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
`
}

export function sandpackSetup(variant: DemoVariant, version: Version) {
  const { entry, dependencies, externalResources } = variant.config
  const files: Record<string, string | { code: string; hidden: boolean }> = { ...variant.files }
  const isReact = version === 'react'

  if (isReact && entry) {
    files['/index.js'] = { code: reactEntryFile(entry), hidden: true }
  }

  return {
    files,
    customSetup: {
      dependencies: dependencies || {},
      // Passing customSetup at all drops the template's entry (it has no fallback),
      // so restate it here.
      entry: isReact ? '/index.js' : '/index.html',
    },
    options: {
      externalResources: externalResources || [],
      activeFile: entry ? '/' + entry : undefined,
    },
  }
}

interface DemoViewProps {
  project: Project
  version: Version | null
  onVersionChange: (version: Version) => void
}

export default function DemoView({ project, version, onVersionChange }: DemoViewProps) {
  const { ref: boxRef, height } = useMeasuredHeight()
  const theme = useMemo(
    () => ({ ...atomDark, layout: { height: `${height}px`, headerHeight: '40px' } }),
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
          <p style={{ margin: 0, fontSize: 13, color: '#8b8b9e' }}>{variant.config.description}</p>
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
                  border: '1px solid #2a2a3e',
                  background: v === active ? '#2a2a3e' : 'transparent',
                  color: '#eee',
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
