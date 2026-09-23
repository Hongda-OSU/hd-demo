#!/usr/bin/env node
/**
 * Enforces the doc rules that CONTRIBUTING.md states, so they don't rely on
 * anyone remembering to read it.
 */
import { readFileSync } from 'node:fs'

const CLAUDE_MD_WORD_LIMIT = 150

const failures = []

// CLAUDE.md loads into every session, so its size is a real cost.
const claude = readFileSync('CLAUDE.md', 'utf8')
const words = claude.split(/\s+/).filter(Boolean).length
if (words > CLAUDE_MD_WORD_LIMIT) {
  failures.push(
    `CLAUDE.md is ${words} words, limit is ${CLAUDE_MD_WORD_LIMIT}. ` +
      `Reference belongs in README.md or a comment beside the code.`,
  )
} else {
  console.log(`CLAUDE.md: ${words}/${CLAUDE_MD_WORD_LIMIT} words`)
}

if (failures.length) {
  console.error('\n' + failures.map((f) => `✗ ${f}`).join('\n') + '\n')
  process.exit(1)
}
