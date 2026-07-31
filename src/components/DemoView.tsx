import { Sandpack } from '@codesandbox/sandpack-react'
import { atomDark } from '@codesandbox/sandpack-themes'
import { availableVersions, type DemoVariant, type Project, type Version } from '../lib/loadDemos'

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
  const available = availableVersions(project)
  const active = version && available.includes(version) ? version : available[0]
  const variant = project[active]

  if (!variant) return <p>This demo has no versions.</p>

  const setup = sandpackSetup(variant, active)

  return (
    <div>
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0, fontSize: 20 }}>{variant.config.title || project.id}</h1>
        {variant.config.description && (
          <p style={{ margin: '4px 0 0', color: '#8b8b9e' }}>{variant.config.description}</p>
        )}
      </header>

      {available.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {available.map((v) => (
            <button
              key={v}
              onClick={() => onVersionChange(v)}
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                border: '1px solid #2a2a3e',
                background: v === active ? '#2a2a3e' : 'transparent',
                color: '#eee',
                cursor: v === active ? 'default' : 'pointer',
              }}
            >
              {v.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      <Sandpack
        key={`${project.id}:${active}`} // force remount on switch
        template={templateFor(active)}
        theme={atomDark}
        files={setup.files}
        customSetup={setup.customSetup}
        options={{
          ...setup.options,
          readOnly: true,
          showReadOnly: false,
          showTabs: true,
          showLineNumbers: true,
          editorHeight: 480,
        }}
      />
    </div>
  )
}
