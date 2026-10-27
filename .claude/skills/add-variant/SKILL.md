---
name: add-variant
description: Add a variant of an existing demo topic, such as another take on the holo card, filed under the topic's sidebar group. Use when the user types /add-variant, or asks for a variant, another version or another style of a demo that already exists.
---

# Add a variant

A variant is a demo of its own, with its own id and URL, that shares a `group`
with the other takes on its topic, so the sidebar lists them under one heading.
See [docs/writing-a-demo.md](../../../docs/writing-a-demo.md#configjson).

Not to be confused with the HTML and React versions of one demo: those share an
`<id>`, and the header switches between them. A variant is a different effect.

**One prompt per turn. Stop and wait for each reply**, as in
[add-demo](../add-demo/SKILL.md), whose shared rules all apply here.

## Step 1 — topic

> 给哪个 demo 加变体?

List the existing groups and demos from `src/demos/*/*/config.json` with
AskUserQuestion, or skip if the user already named one.

## Step 2 — id

> 变体叫什么?(会变成 URL,例如 `holo-card-rainbow`)

Propose `<topic-id>-<what differs>`, so variants sort beside their topic in
listings and URLs. Check the folder doesn't exist under either version.

## Step 3 — version and files

Ask HTML or React, unless the pasted code already says. Then run the matching
skill's intake — [html](../html/SKILL.md) or [react](../react/SKILL.md) — from
its step 2, since the id is settled. Its fixes, file layout and image rules
apply unchanged.

## Step 4 — group, title and description

The group is the topic's existing `group`. If the topic has none yet, propose
its title as the group name, and add the same `group` to the topic's
`config.json` in every version it has — a group of one shows as a plain demo,
so the heading appears only once both carry it.

Propose a title naming what differs (`Rainbow Holo Card`), since the group
heading already names the topic. When the group is new, retitle the topic the
same way (`Classic Holo Card`), or the heading and its first entry read alike;
its id stays, for the URLs and embeds already shared. Then write.

## Step 5 — verify, review and commit

As in add-demo, and also check the sidebar: the group heading appears, opens
by itself on the new variant, and lists every member.

Commit as `feat(<id>): add <what differs> variant of <topic-id>`. When the
topic's own `config.json` gained the `group`, that change goes in the same
commit — it is what files the variant under the heading.
