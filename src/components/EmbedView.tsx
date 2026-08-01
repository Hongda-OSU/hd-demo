import { Sandpack } from '@codesandbox/sandpack-react'
import './sandpack-fill.css'
import { availableVersions, type Project, type Version } from '../lib/loadDemos'
import { sandpackSetup, sandpackTheme, templateFor } from '../lib/sandpack'

interface EmbedViewProps {
  project?: Project
  version?: Version | null
}

/**
 * Result-only view for other sites to <iframe>. No sidebar, no code panel.
 *
 * Deliberately the same <Sandpack> preset DemoView uses, with the editor
 * squeezed to zero width, rather than SandpackProvider + SandpackPreview
 * composed by hand. Composing it looks tidier but puts this view on a second
 * code path that has to be kept working separately — and didn't stay working.
 */
export default function EmbedView({ project, version }: EmbedViewProps) {
  const available = project ? availableVersions(project) : []
  const active = version && available.includes(version) ? version : available[0]

  if (!project || !active) {
    return <p style={{ color: 'var(--text)', padding: 16 }}>Demo not found.</p>
  }

  const setup = sandpackSetup(project[active]!, active)
  const theme = { ...sandpackTheme, layout: { height: '100vh', headerHeight: '0px' } }

  return (
    <div className="embed-only">
      <Sandpack
        template={templateFor(active)}
        theme={theme}
        files={setup.files}
        customSetup={setup.customSetup}
        options={{
          ...setup.options,
          readOnly: true,
          showReadOnly: false,
          showTabs: false,
          // The preset turns this into flexGrow on the editor column: at 0 it
          // takes no space and the preview gets the window.
          editorWidthPercentage: 0,
          resizablePanels: false,
          editorHeight: '100vh',
        }}
      />
    </div>
  )
}
