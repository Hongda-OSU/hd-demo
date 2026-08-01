/**
 * Inline 16px icons, stroked with currentColor so they follow button state.
 *
 * Drawn rather than pulled from a library: four icons is not worth a dependency
 * that ships hundreds, and these are all a handful of paths.
 */

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
}

// HTML5's shield, the mark people already read as "markup".
export function HtmlIcon() {
  return (
    <svg {...base} fill="currentColor" stroke="none">
      <path d="M2.5 1.5h11l-1 11.2L8 14.5l-4.5-1.8L2.5 1.5Zm2.2 2.3.25 2.4h5.9l-.16 1.7-2.19.6-2.2-.6-.13-1.3H4.02l.26 2.9L8 10.5l3.7-1v-.03l.5-5.67H4.7Z" />
    </svg>
  )
}

// React's atom.
export function ReactIcon() {
  return (
    <svg {...base}>
      <circle cx="8" cy="8" r="1.4" fill="currentColor" stroke="none" />
      <ellipse cx="8" cy="8" rx="6.6" ry="2.6" />
      <ellipse cx="8" cy="8" rx="6.6" ry="2.6" transform="rotate(60 8 8)" />
      <ellipse cx="8" cy="8" rx="6.6" ry="2.6" transform="rotate(120 8 8)" />
    </svg>
  )
}

// A crate — what the demo pulls in.
export function PackageIcon() {
  return (
    <svg {...base}>
      <path d="M8 1.5 14 4.75v6.5L8 14.5l-6-3.25v-6.5L8 1.5Z" />
      <path d="M2 4.75 8 8l6-3.25M8 8v6.5" />
    </svg>
  )
}

// Angle brackets: the near-universal mark for "embed this".
export function EmbedIcon() {
  return (
    <svg {...base}>
      <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" />
    </svg>
  )
}

export function CheckIcon() {
  return (
    <svg {...base}>
      <path d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  )
}
