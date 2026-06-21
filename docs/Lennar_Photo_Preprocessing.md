# Lennar Photo Preprocessing — Local AI Sorter
**Document ID:** AAR-TC-LENNAR-PHOTO-001
**Version:** 1.0 | *Last Updated: June 21, 2026*
*Living document — update as exploration and build work progresses*

---

## What This Is

A local script that automatically sorts and renumbers Lennar listing photos before they go to Google Drive or Matrix. Lennar photo drops notoriously lead with bathroom photos — this script runs the images through Apple's on-device Vision framework, categorizes each photo by room type, and outputs a renamed, correctly ordered folder ready for upload.

Zero token cost. No internet required. Runs on the M3 MacBook Air's Neural Engine.

---

## Where It Lives in the Workflow

This is a preprocessing step that happens before Google Drive:

```
Lennar photo drop (Box link / Stefanie email)
        ↓
Download photos to local folder
        ↓
Run photo sorter script  ← THIS TOOL
        ↓
Sorted, numbered folder
        ↓
Upload to Google Drive property folder
        ↓
Upload to Matrix (in correct order)
```

Matrix photo upload order: **exterior first, bathrooms to the back.**

---

## Why Local / Apple Vision

- **No token cost** — image classification does not need an LLM
- **No API cost** — Apple's Vision framework is built into macOS, no third-party service
- **Fast** — M3 Neural Engine processes a full photo drop in seconds
- **Private** — photos never leave the machine
- **No install** — Vision framework is available natively via Python (`pyobjc`) or Swift

This is the right tool for the job. Claude handles parsing, judgment, and workflow — a dedicated classifier handles repetitive visual categorization.

---

## Proposed Category Order

Photos are sorted and renumbered in this priority order:

| Priority | Category | Notes |
|---|---|---|
| 1 | Exterior | Always first — front of home, street view |
| 2 | Aerial / Community | Drone shots, community amenities, pool |
| 3 | Living / Family Room | Main living areas |
| 4 | Kitchen | |
| 5 | Dining | |
| 6 | Primary Bedroom | |
| 7 | Primary Bath | |
| 8 | Additional Bedrooms | |
| 9 | Office / Loft | |
| 10 | Garage | |
| 11 | Bathrooms | Always last — Lennar drops put these first; script moves them to back |
| 12 | Other / Uncategorized | Anything the classifier isn't confident about |

Output filenames: `01_exterior.jpg`, `02_exterior.jpg`, `03_living.jpg`, etc. — numeric prefix drives upload order.

---

## Technical Approach

**Language:** Python with `pyobjc` bindings to Apple's Vision framework
**Framework:** `Vision.VNClassifyImageRequest` — Apple's built-in image classifier
**Runtime:** Local only, M3 Neural Engine
**Input:** Folder of downloaded Lennar photos (any common image format)
**Output:** Same folder with files renamed using numeric sort prefix

### Script Flow

1. Accept input folder path as argument
2. Loop through all image files in the folder
3. Run each image through `VNClassifyImageRequest`
4. Map Vision framework labels to the category order table above
5. Assign sort priority based on category
6. Rename files with zero-padded numeric prefix reflecting sort order
7. Print summary: category assigned per file, any low-confidence classifications flagged for manual review

### Label Mapping

Apple Vision's classifier returns confidence-scored labels. The script maps those to the category list:

| Vision Labels (examples) | Mapped Category |
|---|---|
| `house`, `building`, `facade`, `yard`, `driveway` | Exterior |
| `swimming pool`, `playground`, `park` | Aerial / Community |
| `living room`, `family room`, `fireplace` | Living / Family Room |
| `kitchen`, `countertop`, `stove` | Kitchen |
| `dining room`, `dining table` | Dining |
| `bedroom` (primary — largest room heuristic) | Primary Bedroom |
| `bathroom`, `bathtub`, `shower`, `toilet` | Bathroom |
| `garage`, `car` | Garage |
| `office`, `desk` | Office / Loft |

Low-confidence classifications (below threshold) go to Uncategorized and are flagged for manual review.

---

## Open Questions

- [ ] Does `VNClassifyImageRequest` reliably distinguish bathroom from bedroom at Lennar photo quality and resolution? — **Test first POC item**
- [ ] Can it distinguish primary bedroom from secondary bedrooms? (Nice to have — not blocking)
- [ ] What confidence threshold should trigger an Uncategorized flag vs a best-guess assignment?
- [ ] Should the script move files or rename in place? (Rename in place is safer)
- [ ] Should it produce a preview manifest (text list of proposed order) before renaming, so Andrew can review before committing? — Probably yes for first version
- [ ] Does `pyobjc` expose `VNClassifyImageRequest` cleanly on macOS Sequoia / M3? — Confirm in POC

---

## Build Roadmap

### Phase 1 — POC (Cursor)
- Install `pyobjc` and confirm `Vision` framework is accessible
- Run a single Lennar photo through `VNClassifyImageRequest` and print raw label output
- Confirm bathroom and exterior labels are reliably returned
- Determine confidence scores on typical Lennar photo quality

### Phase 2 — Category Mapper
- Build label-to-category mapping table
- Set confidence threshold
- Output category assignment per photo to console

### Phase 3 — Sorter + Renamer
- Apply priority sort order
- Rename files with numeric prefix
- Output summary log

### Phase 4 — Preview Manifest
- Before renaming, output a proposed order list for Andrew to review
- Add `--dry-run` flag that shows proposed order without renaming
- Add `--confirm` flag to execute after review

### Phase 5 — Integration
- Script callable from command line with a single folder path argument
- Consider a simple drag-and-drop launcher (Automator or a minimal macOS app wrapper) so no terminal needed

---

## Relationship to Other Docs

| Doc | Relationship |
|---|---|
| `Lennar_MLS_Bookmarklet_Build.md` (AAR-TC-LENNAR-BM-001) | Downstream — photos go to Matrix after sorting; bookmarklets handle field data entry |
| `New_Lennar_Listing_Session_Protocol.md` | Photo preprocessing step sits before Step 8 (Create Google Drive Property Folder) |

---

## Protocol Note

Once this tool exists, the session protocol photo step updates to:

> **Photos:** Download from Box link or Stefanie email to local folder. Run photo sorter script (`AAR-TC-LENNAR-PHOTO-001`). Upload sorted folder to Google Drive property folder. Upload to Matrix — order is already correct.

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Claude-facing document. Update version history and date with each revision.*
