import type { Version } from './loadDemos'

/**
 * The bare-preview URL for a demo.
 *
 * Absolute, because it also goes into a snippet that runs off-site — BASE_URL
 * alone is a path. The version is pinned only when the demo has more than one,
 * so single-version demos get a clean URL and stay correct if the other version
 * is added later.
 */
export function embedUrl(projectId: string, version: Version, pinVersion: boolean) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}embed/${projectId}`
  return pinVersion ? `${base}?v=${version}` : base
}

export function embedSnippet(url: string) {
  return `<iframe src="${url}"\n        style="width:100%;height:520px;border:0"></iframe>`
}
