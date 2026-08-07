---
title: Cursor Handoff — src/index.js — v0.7.1 Hotfix (syntax error)
document_id: HANDOFF-v0.7.1-index-js-hotfix
date: 2026-08-07
project: AAR-TC Aframe Connector
---

Apply the change below surgically to `src/index.js`. Do not modify anything not listed here.

## Change 1

`bulk_search_contacts` crashed the deploy: `??` and `||` cannot be combined in the same expression without parentheses — this is a JavaScript syntax rule, not a style preference, and Node refuses to parse the file at all. Wrap the `||` fallback in parentheses so `??` only ever sees a single right-hand expression.

**Find:**
```js
        label: label ?? Object.values(criteria).filter(Boolean).join(" ") || "(unlabeled entry)",
```

**Replace with:**
```js
        label: label ?? (Object.values(criteria).filter(Boolean).join(" ") || "(unlabeled entry)"),
```

No other changes to `src/index.js`.

```bash
git add -A
git commit -m "Hotfix: parenthesize ?? / || in bulk_search_contacts (fixes crash-looping deploy)"
git push origin main
```
