---
name: react
description: Add a React demo to the showcase, prompting for each file in turn. Use when the user types /react, picks React from /add-demo, or asks to add a React version of a demo.
---

# Add a React demo

Creates `src/demos/react/<id>/`. Shared rules live in
[add-demo](../add-demo/SKILL.md) — read it first.

**One prompt per turn. Stop and wait for each reply.** Write nothing to disk
until step 6.

## Step 1 — id

> 这个 demo 叫什么?(kebab-case,会变成 URL,例如 `ripple-image-effect`)

Skip if given as an argument (`/react ripple-image-effect`). Check
`src/demos/react/<id>/` doesn't already exist.

## Step 2 — entry component

> 贴 App.jsx(入口,要有 default export)。

## Step 3 — extra components

> 还有别的组件吗?有就贴,并说清放在哪个路径(例如 `components/Foo.jsx`);没有就说 skip。

Repeat until the user says no more. Subfolders are fine.

## Step 4 — CSS

> 贴 CSS,没有就说 skip。

Ask for the filename if it isn't obvious. If a component imports its own
stylesheet (`import './Foo.css'`), that file goes beside it.

## Step 5 — dependencies

> 用到哪些 npm 包?(three / gsap / framer-motion…,没有就说 skip)

Infer from the imports and propose the list, so the user only confirms. Then
resolve exact versions with `npm view <pkg> version` — never write `latest`.
Check `peerDependencies` and add them explicitly: `kokomi.js` declares
`three: >=0.160` but does not install it.

Also ask for title and description here, proposing defaults. Then write.

## What to write

```
src/demos/react/<id>/
├── App.jsx                     # entry, default export
├── index.css                   # if given
├── components/Whatever.jsx     # subfolders work
└── config.json
```

Demo files stay `.jsx`, never `.tsx` — the app shell is TypeScript, the demos
are not. Sandpack's `react` template is JS-based.

Three fixes to apply, all forced by Sandpack. Tell the user you made them:

- **Drop any `main.jsx` / `index.js`.** `DemoView.tsx` generates the mount file
  from `config.entry`; a hand-written one collides with it.
- **Make `App.jsx` import its own CSS** (`import './index.css'`) — there's no
  `main.jsx` left to do it.
- **Inline GLSL as JS template strings.** The bundler can't resolve `.glsl`
  imports. Tag them `/* glsl */` for highlighting, as `ripple-image-effect`
  does.

```json
{
  "title": "Ripple Image Effect",
  "description": "一句话说明效果",
  "entry": "App.jsx",
  "dependencies": { "three": "0.185.1", "gsap": "3.15.0" }
}
```

## Step 7 — verify and commit

Per add-demo: typecheck, build, load `/hd-demo/<id>` in a browser. A demo
showing **"Hello world"** means Sandpack fell back to its own template — check
the entry resolved. Heavy deps (three, r3f) take seconds to bundle on first
view; blank after ~30s is a real failure. Then
`feat(<id>): add <description> demo`.
