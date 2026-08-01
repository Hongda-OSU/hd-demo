import type { DemoVariant, Version } from './loadDemos'

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
