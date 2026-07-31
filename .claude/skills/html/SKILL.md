---
name: html
description: Add an HTML demo (plain HTML/CSS/JS) to the showcase, prompting for each file in turn. Use when the user types /html, picks HTML from /add-demo, or asks to add an HTML version of a demo.
---

# Add an HTML demo

Creates `src/demos/html/<id>/`. Shared rules live in
[add-demo](../add-demo/SKILL.md) — read it first.

**One prompt per turn. Stop and wait for each reply.** Write nothing to disk
until step 5.

## Step 1 — id

> 这个 demo 叫什么?(kebab-case,会变成 URL,例如 `typing-text-effect`)

Skip if given as an argument (`/html typing-text-effect`). Check
`src/demos/html/<id>/` doesn't already exist.

## Step 2 — HTML

> 贴 HTML。

Accept either a full document or just the body markup — you'll normalise it in
step 5.

## Step 3 — CSS

> 贴 CSS,没有就说 skip。

## Step 4 — JS

> 贴 JS,没有就说 skip。

## Step 5 — title and description

> 标题和一句话描述?(显示在左侧列表和顶部)

Propose a sensible default from the id and what the code does, so the user can
just confirm. Then write the files.

## What to write

```
src/demos/html/<id>/
├── index.html      # complete document
├── styles.css      # omit if skipped
├── script.js       # omit if skipped
└── config.json
```

Sandpack uses `template: "static"` and serves `/index.html` directly — nothing
is injected, so the document must be complete and link its own assets:

```html
<link rel="stylesheet" href="styles.css" />
<script src="script.js" defer></script>
```

If the user gave only body markup, wrap it in a document. If they gave a full
one, keep their `<head>` as-is — CDN `<link>` tags work normally, as the Google
Fonts import in `typing-text-effect` shows. Only link the files that exist.

```json
{
  "title": "Typing Text Effect",
  "description": "一句话说明效果",
  "entry": "index.html"
}
```

`entry` is always `index.html` here. No `dependencies` — there's no bundler;
third-party code arrives via `<script>` tags. Use `externalResources` only to
inject into a page you don't control.

## Step 6 — verify and commit

Per add-demo: typecheck, build, load `/hd-demo/<id>` in a browser, confirm the
effect actually runs. Then `feat(<id>): add <description> demo`.
