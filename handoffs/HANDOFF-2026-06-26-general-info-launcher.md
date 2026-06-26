---
title: Cursor Handoff — lennar_general_info.html — General Info fixes
document_id: HANDOFF-2026-06-26-general-info-launcher
date: 2026-06-26
project: AAR-TC Lennar MLS Bookmarklet
---

Apply the changes below surgically to `bookmarklets/lennar_general_info.html`. Do not modify anything not listed here.

---

## Change 1 — Sync minified bookmarklet JS with source file fixes

**What and why:** The inline bookmarklet JS in the launcher href needs to match the corrected source. Fixes: Input_246/248 label swap corrected, Tax Year moved to New path only, isLennar flag added to gate Assd Improvement write (Input_248). Also updates the static-note and warning divs to reflect correct field IDs and behavior.

**Find:**
```javascript
javascript:(function(){function s(id,v){var e=document.getElementById(id);if(e)e.value=v;}function c(id,v){var e=document.getElementById(id);if(e)e.checked=v;}navigator.clipboard.readText().then(function(t){var payload=JSON.parse(t);var d=payload.general||{};var path=payload.path||'new';s('Input_94','N');s('Input_249','0');s('Input_246','0');c('Input_102_NOTREQ',true);c('Input_103_NOTREQ',true);if(path==='new'){s('Input_95',d.acres||'');s('Input_100','TBD');}}).catch(function(e){alert('General Info error: '+e.message);});})();
```

**Replace with:**
```javascript
javascript:(function(){function s(id,v){var e=document.getElementById(id);if(e)e.value=v;}function c(id,v){var e=document.getElementById(id);if(e)e.checked=v;}navigator.clipboard.readText().then(function(t){var payload=JSON.parse(t);var d=payload.general||{};var path=payload.path||'new';var isLennar=payload.lennar===true;s('Input_94','N');s('Input_249','N');c('Input_102_NOTREQ',true);c('Input_103_NOTREQ',true);if(isLennar){s('Input_248','0');}if(path==='new'){s('Input_246','0');s('Input_95',d.acres||'');s('Input_100','TBD');}}).catch(function(e){alert('General Info error: '+e.message);});})();
```

---

## Change 2 — Update static-note div to reflect correct field behavior

**Find:**
```html
  <div class="static-note">
    <strong>Hardcoded for all Lennar listings:</strong><br>
    Waterfront → No<br>
    Model Available → No<br>
    Assd Improvement → 0<br>
    Disclosures → Not Required<br>
    Lead Disclosure → Not Required<br>
    Legal Description → TBD (New path only)
  </div>
```

**Replace with:**
```html
  <div class="static-note">
    <strong>Hardcoded for all Lennar listings:</strong><br>
    Waterfront → No<br>
    Model Available → No<br>
    Assd Improvement → 0 (Lennar only — Input_248)<br>
    Disclosures → Not Required<br>
    Lead Disclosure → Not Required<br>
    Tax Year → 0 (New path only — Input_246)<br>
    Legal Description → TBD (New path only)
  </div>
```

---

## Change 3 — Update warning div to reflect corrected Tax Year and Assd Improvement behavior

**Find:**
```html
  <div class="warning">
    ⚠️ <strong>Tax ID path:</strong> Acres and Legal Description are pre-populated from the tax record — bookmarklet skips both. Verify the pre-populated Acres value against the email data sheet — new construction lot sizes may not yet match the tax record.<br><br>
    ⚠️ <strong>Assd Improvement:</strong> Does not pre-populate even on Tax ID path — bookmarklet writes 0 on both paths.
  </div>
```

**Replace with:**
```html
  <div class="warning">
    ⚠️ <strong>Tax ID path:</strong> Tax Year, Acres, and Legal Description are pre-populated from the tax record — bookmarklet skips all three. Verify the pre-populated Acres value against the email data sheet — new construction lot sizes may not yet match the tax record.<br><br>
    ⚠️ <strong>Assd Improvement (Input_248):</strong> Lennar only — new construction never has a pre-populated value; bookmarklet writes 0 on both paths. Non-Lennar listings always use Tax ID path and Assd Improvement is pre-populated from the tax record — bookmarklet skips it entirely.<br><br>
    ⚠️ <strong>Field IDs on Tax ID path:</strong> Input_246 = Tax Year, Input_248 = Assd Improvement. Matrix shifts these IDs relative to the New path — confirmed via live extraction June 26, 2026.
  </div>
```

---

No other changes to `lennar_general_info.html`.

Do not commit yet. Changes for additional files follow in separate handoffs.
