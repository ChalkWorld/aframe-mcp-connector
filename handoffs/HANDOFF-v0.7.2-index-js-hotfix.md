---
title: Cursor Handoff — src/index.js — v0.7.2 Hotfix (missing formatResult payload)
document_id: HANDOFF-v0.7.2-index-js-hotfix
date: 2026-08-07
project: AAR-TC Aframe Connector
---

Apply the changes below surgically to `src/index.js`. Do not modify anything not listed here.

## Change 1

`formatResult(header, { payload, warnings })` expects its second argument to carry a `payload` key. `bulk_update_custom_fields` calls it with `{ results }` instead of `{ payload: results }`, so `payload` is `undefined` and the entire per-field results array is silently dropped from the tool's output — only the summary line survives.

**Find:**
```js
    const summary = `Transaction ${xactionId}: ${succeeded} of ${results.length} fields updated${failed ? `, ${failed} failed` : ""}.`;
    return formatResult(summary, { results });
```

**Replace with:**
```js
    const summary = `Transaction ${xactionId}: ${succeeded} of ${results.length} fields updated${failed ? `, ${failed} failed` : ""}.`;
    return formatResult(summary, { payload: results });
```

## Change 2

Same bug in `bulk_add_transaction_participants`.

**Find:**
```js
    const summary = `Transaction ${xactionId}: ${succeeded} of ${results.length} participants added${failed ? `, ${failed} failed` : ""}.`;
    return formatResult(summary, { results });
```

**Replace with:**
```js
    const summary = `Transaction ${xactionId}: ${succeeded} of ${results.length} participants added${failed ? `, ${failed} failed` : ""}.`;
    return formatResult(summary, { payload: results });
```

## Change 3

Same bug in `bulk_search_contacts`.

**Find:**
```js
    const summary = `${searches.length} search${searches.length === 1 ? "" : "es"} run — ${results.filter((r) => r.matchCount > 0).length} returned at least one match.`;
    return formatResult(summary, { results });
```

**Replace with:**
```js
    const summary = `${searches.length} search${searches.length === 1 ? "" : "es"} run — ${results.filter((r) => r.matchCount > 0).length} returned at least one match.`;
    return formatResult(summary, { payload: results });
```

No other changes to `src/index.js`.

```bash
git add -A
git commit -m "Hotfix: bulk tools now pass results as formatResult's payload key (detail array was being silently dropped)"
git push origin main
```
