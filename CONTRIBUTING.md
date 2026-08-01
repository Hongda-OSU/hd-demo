# Contributing

## Commit messages

[Conventional Commits](https://www.conventionalcommits.org/). Format:

```
<type>(<scope>): <subject>

<body>
```

### Types

| Type | Use for |
| --- | --- |
| `feat` | A new demo, or a new capability in the showcase itself |
| `fix` | Something was broken and now isn't |
| `docs` | README, CLAUDE.md, this file |
| `refactor` | Restructuring with no behaviour change |
| `chore` | Deps, config, CI, tooling |
| `style` | Formatting only — no logic touched |

### Scopes

Use the demo id for demo work (`ripple-image-effect`, `typing-text-effect`),
otherwise the area: `sandpack`, `router`, `loader`, `ci`, `deps`.

### Subject line

- Imperative mood — "add", not "added" or "adds"
- No capital first letter, no trailing period
- Under ~70 characters
- Describe the change, not the file that changed

```
feat(ripple-image-effect): add WebGL hover gallery demo
fix(sandpack): import entry with extension so App.jsx wins over template
chore(deps): pin three to 0.185.1
```

### Body

Optional, but include one whenever the change isn't self-evident. Explain *why*,
not *what* — the diff already says what. Wrap at 72 characters.

The Sandpack bugs in this repo are a good example of changes that need a body:
the fix is one line, but the reason is not guessable from reading it.

```
fix(sandpack): import entry with extension so App.jsx wins over template

Sandpack's react template ships its own /App.js. An extensionless
`import App from "./App"` resolves to the template's copy instead of the
demo's App.jsx, so every React demo silently rendered "Hello world".
```

## Before committing

```sh
npm run lint       # oxlint — react/rules-of-hooks is an error and fails CI
npx tsc --noEmit   # must pass — CI runs this and will fail the deploy
npm run build      # must pass
```

Then check the demo actually renders in the browser. Sandpack failures are
runtime-only: a demo can typecheck, build, and still render nothing, because
the bundling happens in the browser at view time.

## Scope of a commit

One logical change per commit. A new demo and a fix to the loader are two
commits, even when you wrote them in the same sitting.
