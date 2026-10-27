---
name: add-demo
description: Add a demo to the showcase, step by step. Use when the user types /add-demo, or asks to add a demo without saying whether it is HTML or React. Routes to the html or react skill, which collect the files one prompt at a time.
---

# Add a demo

Entry point. Ask which version, then hand off. Everything below the handoff is
shared reference for both — read it, but don't recite it at the user.

## Step 1 — which version

Ask with AskUserQuestion, two options:

- **HTML** — plain HTML/CSS/JS → continue with [html](../html/SKILL.md)
- **React** — components, npm deps → continue with [react](../react/SKILL.md)

If the user already said (`/add-demo react`, or they pasted JSX), skip the
question and go straight to that skill.

## Step 2 — hand off

Follow the chosen skill's intake. It prompts for the id and then each file in
turn. Do not shortcut it by asking for everything at once.

---

# Shared rules

## Intake conduct

**One prompt per turn. Stop and wait for the reply.** Do not ask for the name
and the code in the same message, and never invent placeholder content to keep
moving — an empty demo is worse than an unfinished one.

Accept "skip", "none", or an empty reply for any optional file, and move on
without arguing.

## Where files go

`src/demos/<html|react>/<id>/`. The `<id>` is the URL slug — kebab-case, and
stable, since it appears in `/hd-demo/<id>` and in embed URLs other sites may
already point at.

Don't derive the id from a component name. `WebGLGallery.jsx` became
`ripple-image-effect`: the id names the effect, not the implementation.

If the folder already exists, stop and ask rather than overwriting. If the
_other_ version of the same id exists, this is a second version — reuse its
`title`, and the version icons appear automatically. A different take on a
demo that exists is a variant instead: hand off to
[add-variant](../add-variant/SKILL.md).

## Keep the user's code verbatim

Paste it in as written. Preserve their structure; subfolders work
(`components/Foo.jsx` → `/components/Foo.jsx` in Sandpack). Fix only what
Sandpack forces, and say what you changed and why.

## Images

Pictures the user gives go in the demo's own folder; the build publishes them
at `https://hongdalin.blog/hd-demo/demos/<version>/<id>/<path>`, and the code
loads them by that URL — see
[docs/writing-a-demo.md](../../../docs/writing-a-demo.md#images-of-its-own).
Write each URL whole, as one literal: `npm run dev` inlines those as data URIs,
so the pictures show before the user pushes, but leaves alone a URL assembled
from a base and a name.

If the demo needs pictures and the user gave none, use the sample images
listed there, by full URL. Don't hotlink stock photos or anime and game art:
the repo is public, and that art belongs to someone else. When the user's own
pictures are such art, draw a replacement, with its script in `design/<id>/`,
and show it before writing the demo.

## Verify

```sh
npx tsc --noEmit && npm run build
```

Then **load it in a browser** — `npm run dev`, open `/hd-demo/<id>`. Not
optional, not substitutable. Sandpack bundles in the browser at view time, so a
demo can typecheck, build, and still render nothing. With no browser tool,
start the dev server and ask the user to confirm.

Check the result, not just the absence of errors. A React demo showing
**"Hello world"** means Sandpack fell back to its own template files.

## Review

Visitors read this code, so review it once it runs: use the react-review skill
on `src/demos/<html|react>/<id>/`.

Scope it to that folder. The app shell — `App.tsx`, `components/`, `lib/` — is
not reviewed; react-review is for the sandbox code visitors see.

Show the report, then ask which 必改 and 应改 findings to fix. The code stays
the user's, as above: change nothing they have not agreed to, and leave
personal-layer 建议 as a list. If they reject a finding for good, offer to log
it in react-review's `prefs.md`.

## Commit

One demo per commit, per [CLAUDE.md](../../../CLAUDE.md):

```
feat(<id>): add <short description> demo
```
