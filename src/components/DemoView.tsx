import { useEffect, useMemo, useRef, useState } from 'react'
import { Sandpack } from '@codesandbox/sandpack-react'
import './sandpack-fill.css'
import { availableVersions, type Project, type Version } from '../lib/loadDemos'
import { sandpackSetup, sandpackTheme, templateFor } from '../lib/sandpack'
import { embedUrl } from '../lib/embed'
import DemoToolbar from './DemoToolbar'

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
  narrow: boolean
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function DemoView({
  project,
  version,
  onVersionChange,
  narrow,
  sidebarCollapsed,
  onToggleSidebar,
}: DemoViewProps) {
  const { ref: boxRef, height } = useMeasuredHeight()

  /*
   * Below 768px Sandpack stacks the panes (minWidth: 100% forces the wrap) and
   * halves their height — but the halving rule excludes .sp-editor and
   * .sp-preset-column, which is exactly what the preset renders. Both panes take
   * the full height, the column runs to twice the box, and the preview ends up
   * below a container that doesn't scroll. So halve it here instead.
   */
  const paneHeight = narrow ? Math.floor(height / 2) : height

  const theme = useMemo(
    () => ({ ...sandpackTheme, layout: { height: `${paneHeight}px`, headerHeight: '40px' } }),
    [paneHeight],
  )

  const available = availableVersions(project)
  const active = version && available.includes(version) ? version : available[0]
  const variant = project[active]

  if (!variant) return <p>This demo has no versions.</p>

  const setup = sandpackSetup(variant, active)

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <DemoToolbar
        config={variant.config}
        fallbackTitle={project.id}
        versions={available}
        active={active}
        onVersionChange={onVersionChange}
        previewUrl={embedUrl(project.id, active, available.length > 1)}
        narrow={narrow}
        sidebarCollapsed={sidebarCollapsed}
        onToggleSidebar={onToggleSidebar}
      />

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
              // Written inline onto both columns by the preset, so it outranks
              // the theme token and has to carry the same halving.
              editorHeight: paneHeight,
            }}
          />
        )}
      </div>
    </div>
  )
}
