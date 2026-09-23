#!/usr/bin/env node
/**
 * Enforces the doc rules CONTRIBUTING.md states, so they don't depend on
 * anyone remembering to read it.
 *
 * The line ceiling is a hard failure; the ranges are advice, because a file
 * padded to hit a word count is worse than a short one.
 */
import { readFileSync } from 'node:fs'

const LINE_CEILING = 200
const LINE_RANGE = [80, 120]
const WORD_RANGE = [300, 600]

const text = readFileSync('CLAUDE.md', 'utf8')
const lines = text.trimEnd().split('\n').length
const words = text.split(/\s+/).filter(Boolean).length

console.log(`CLAUDE.md: ${lines} lines, ${words} words`)

const warn = (m) => console.warn(`  note: ${m}`)
if (lines < LINE_RANGE[0] || lines > LINE_RANGE[1]) {
  warn(`${LINE_RANGE[0]}–${LINE_RANGE[1]} lines reads best`)
}
if (words < WORD_RANGE[0] || words > WORD_RANGE[1]) {
  warn(`${WORD_RANGE[0]}–${WORD_RANGE[1]} words keeps it scannable`)
}

if (lines > LINE_CEILING) {
  console.error(
    `\n✗ CLAUDE.md is ${lines} lines, ceiling is ${LINE_CEILING}.` +
      ` Reference belongs in README.md or a comment beside the code.\n`,
  )
  process.exit(1)
}
