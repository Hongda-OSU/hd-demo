import { SandpackProvider, SandpackPreview } from '@codesandbox/sandpack-react'
import { availableVersions, type Project, type Version } from '../lib/loadDemos'
import { sandpackSetup, templateFor } from '../lib/sandpack'

interface EmbedViewProps {
  project?: Project
  version?: Version | null
}

// Result-only view for other sites to <iframe>. No sidebar, no code panel.
export default function EmbedView({ project, version }: EmbedViewProps) {
  const available = project ? availableVersions(project) : []
  const active = version && available.includes(version) ? version : available[0]

  if (!project || !active) {
    return <p style={{ color: 'var(--text)', padding: 16 }}>Demo not found.</p>
  }

  const setup = sandpackSetup(project[active]!, active)

  return (
    <SandpackProvider
      template={templateFor(active)}
      files={setup.files}
      customSetup={setup.customSetup}
      options={setup.options}
    >
      <SandpackPreview
        showOpenInCodeSandbox={false}
        showRefreshButton={false}
        style={{ height: '100vh' }}
      />
    </SandpackProvider>
  )
}
