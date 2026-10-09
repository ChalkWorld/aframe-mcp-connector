---
title: Cursor Handoff — Clear button also resets per-tab status
document_id: HANDOFF-2026-10-09-clear-also-resets-tab-status
date: 2026-10-09
project: AAR-TC Lennar Operational Project
---

# Cursor Handoff — Clear button also resets per-tab status

Apply the change below surgically to `extension/sidepanel.js`. Do not modify anything not listed here.

## Change 1: Expand the Clear button handler to also reset the per-tab status dots

Clear should wipe the slate for a new listing: textarea empty, persisted payload gone, **and** the per-tab status row (unvisited / pending / filled / error) back to all-unvisited. The currently-detected tab goes back to 'pending' to match the normal detection behavior in `setCurrentStatus`.

**Find:**

```javascript
clearBtn.addEventListener('click', function() {
  payloadEl.value = '';
  // Also clear the persisted value so a panel reopen does not resurrect it.
  chrome.storage.local.remove('matrixFillerPayload');
});
```

**Replace with:**

```javascript
clearBtn.addEventListener('click', function() {
  payloadEl.value = '';
  // Also clear the persisted value so a panel reopen does not resurrect it.
  chrome.storage.local.remove('matrixFillerPayload');
  // Reset the per-tab status dots back to all-unvisited, since Clear means
  // we're starting fresh on a new listing. The currently-detected tab goes
  // back to 'pending' to match setCurrentStatus's first-detection behavior.
  TAB_ORDER.forEach(function(t) { tabStatus[t] = 'unvisited'; });
  if (currentDetectedTab) { tabStatus[currentDetectedTab] = 'pending'; }
  renderTabList();
});
```

No other changes to `extension/sidepanel.js`.

---

## Commit block

```bash
git rm handoffs/incoming/HANDOFF-2026-10-09-clear-also-resets-tab-status.md
git add -A
git commit -m "extension: Clear button also resets per-tab status dots"
git push origin main
```
