#!/usr/bin/env node
/**
 * Enforces the CLAUDE.md size limits, so they don't depend on anyone
 * remembering them. Both are hard ceilings, not advice.
 *
 * Counted after expanding @import, since that is what actually reaches the
 * model — a file that imports its way past the limit has still spent it.
 */
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'

const MAX_LINES = 120
const MAX_WORDS = 600

function expand(file, seen = new Set()) {
  const path = resolve(file)
  if (seen.has(path)) return '' // a cycle contributes nothing twice
  seen.add(path)

  return readFileSync(path, 'utf8')
    .split('\n')
    .map((line) => {
      const match = line.match(/^\s*@import\s+(\S+)\s*$/)
      if (!match) return line
      try {
        return expand(resolve(dirname(path), match[1]), seen)
      } catch {
        return line // a broken import is the linter's problem, not ours
      }
    })
    .join('\n')
}

const text = expand('CLAUDE.md')
const lines = text.trimEnd().split('\n').length
const words = text.split(/\s+/).filter(Boolean).length

console.log(`CLAUDE.md: ${lines}/${MAX_LINES} lines, ${words}/${MAX_WORDS} words`)

const over = []
if (lines > MAX_LINES) over.push(`${lines} lines, max ${MAX_LINES}`)
if (words > MAX_WORDS) over.push(`${words} words, max ${MAX_WORDS}`)

if (over.length) {
  console.error(
    `\n✗ CLAUDE.md is over budget: ${over.join('; ')}.` +
      ` It loads every session. Reference belongs in README.md or a comment` +
      ` beside the code it explains.\n`,
  )
  process.exit(1)
}
