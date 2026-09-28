---
title: Local Real Estate Photo Sorter — macOS Vision Framework
document_id: AAR-TC-TOOLS-PHOTO-SORTER-001
version: 1.0
version_date: 2026-09-28
status: Active — Living Document
author: Andrew Rich, AAR-TC Transaction Services
contributor: Gemini (initial build), Claude (Anthropic) — AI-assisted authoring
contact: agentandrewrich@gmail.com | www.aar-tc.com
project: AAR-TC Local Tools
---

# Local Real Estate Photo Sorter

A zero-token, on-device automation tool that sequences listing photography into standard MLS presentation order using Apple's Vision framework and the Neural Engine on the operator's Mac.

---

## What This Is

A local Swift script that categorizes real estate listing photos by room type and outputs a renamed, sequentially numbered folder ready for upload to Google Drive and Matrix. Builder photo drops (Lennar in particular) notoriously arrive out of MLS presentation order — often leading with bathroom photos. The sorter reorders them exterior-first, bathrooms to the back, and produces a Markdown manifest alongside the sorted output.

- **Engine:** Apple Vision Framework (`VNClassifyImageRequest`)
- **Runtime:** Local Swift script triggered via a native macOS Automator droplet
- **Privacy & cost:** 100% on-device, offline, zero cloud API tokens or external dependencies
- **Throughput:** ~2–4 seconds per 50 high-resolution listing images

---

## Status & Refinement Path

This is a working POC. It gets the job done for the general case — MLS-standard presentation order across any listing type — but is not tuned to any one builder's photo drop shape. Named refinement candidates for future iterations:

- **Lennar-tuned variant.** Weighted for what actually arrives from builder marketing: heavy on interior room-by-room, no drone/aerial category needed, model-home staging cues (staged vs. empty rooms), sub-categorization within bedroom and bath. Would sit alongside the general variant, not replace it.
- **Tighter category groupings.** Current categories map one-to-one to Vision label keywords; a mapping layer would let a single "outdoor living" bucket collapse patio, deck, and backyard when that reads better.
- **Confidence threshold tuning.** Current cutoff is 0.25. Higher thresholds send more edge cases to Uncategorized (safer for review); lower thresholds classify more aggressively.
- **`--dry-run` flag.** The original design doc called for a preview manifest before renaming. The current POC just runs and produces the sorted folder — safe because it copies rather than renames in place, but a preview mode would be more explicit.

---

## Where It Lives in the Workflow

Preprocessing step that happens before Google Drive upload:

```
Photo source (builder drop / seller / photographer)
        ↓
Download photos to local folder
        ↓
Run photo sorter (this tool)
        ↓
Sorted, numbered folder
        ↓
Upload to Google Drive property folder
        ↓
Upload to Matrix (in correct order)
```

Matrix photo upload order: **exterior first, bathrooms to the back.**

For Lennar listings, this step sits between Step 4a (Resolve Photo Source) and Step 10 (Handoff) in `Lennar_New_Listing_Protocol.md` (`LENNAR-OPS-PROTOCOL-002`).

---

## Why Local / Apple Vision

- **No token cost.** Image classification does not need an LLM.
- **No API cost.** Apple's Vision framework is built into macOS, no third-party service.
- **Fast.** The M3 Neural Engine processes a full photo drop in seconds.
- **Private.** Photos never leave the machine.
- **No install.** Vision framework is available natively via Swift — no `pip install`, no venv, no dependency drift.

Swift was chosen over Python (`pyobjc`) at build time: same Neural Engine path at the model layer, no bridging shim between languages, single-file script that runs via `/usr/bin/swift` with zero setup. Claude handles parsing, judgment, and workflow — a dedicated classifier handles repetitive visual categorization.

---

## Category Order (as implemented)

Photos are sorted by priority score — lower scores appear first. The classifier scans each image's Vision labels (in confidence order), filters to observations above the confidence threshold, and returns the first observation whose identifier contains any of the category keywords below (case-insensitive substring match).

| Priority | Category Keys (matched in Vision labels) | Position |
|---|---|---|
| 10 | `exterior`, `facade`, `front_yard` | Opening shot / curb appeal |
| 15 | `porch` | Entry transition |
| 20 | `foyer`, `entryway` | Interior arrival |
| 30 | `living_room` | Primary living spaces |
| 40 | `dining_room` | Formal / entertaining |
| 50 | `kitchen` | High-value interior feature |
| 60 | `bedroom` | Sleeping quarters |
| 70 | `bathroom`, `powder_room` | Secondary utilities |
| 80 | `basement` | Lower levels |
| 85 | `patio`, `backyard`, `deck` | Outdoor living |
| 90 | `shed` | Ancillary structures |
| 95 | `garage` | Utility / storage |
| 500 | (no keyword match above threshold) | Uncategorized — top label retained, sorted to back |
| 999 | (unreadable image or no observations) | Error — sorted to end |

Confidence threshold for a keyword match: **0.25**. Below that, an observation is skipped. If no above-threshold observation contains any category keyword, the image lands in the Uncategorized bucket (rank 500) with its top raw Vision label preserved for the manifest.

Output filenames follow the pattern `<NN>_<label>_<original>.ext` — e.g. `01_exterior_IMG_4231.jpg`, `02_exterior_IMG_4232.jpg`, `07_kitchen_IMG_4238.jpg`. The zero-padded numeric prefix drives upload order in Matrix.

Each sorted run also produces `listing_manifest.md` in the output folder, containing the full photo sequence table, confidence scores, and a room breakdown summary.

---

## Swift Implementation (`sort_listing.swift`)

Full source below. Currently deployed at `~/Desktop/Listing Folder/Photo Sorter/sort_listing.swift` on the operator's Mac.

```swift
import Foundation
import Vision
import AppKit

// MLS sequencing priority (lower number = earlier in listing order)
let categoryRank: [String: Int] = [
    "exterior": 10,
    "facade": 10,
    "front_yard": 10,
    "porch": 15,
    "foyer": 20,
    "entryway": 20,
    "living_room": 30,
    "dining_room": 40,
    "kitchen": 50,
    "bedroom": 60,
    "bathroom": 70,
    "powder_room": 70,
    "basement": 80,
    "patio": 85,
    "backyard": 85,
    "deck": 85,
    "shed": 90,
    "garage": 95
]

func classify(imageURL: URL) -> (label: String, rank: Int, confidence: Float) {
    guard let nsImage = NSImage(contentsOf: imageURL),
          let cgImage = nsImage.cgImage(forProposedRect: nil, context: nil, hints: nil) else {
        return ("unreadable", 999, 0.0)
    }

    let request = VNClassifyImageRequest()
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])

    do {
        try handler.perform([request])
        guard let observations = request.results else { return ("unknown", 999, 0.0) }

        for obs in observations where obs.confidence > 0.25 {
            let identifier = obs.identifier.lowercased()
            for (key, rank) in categoryRank {
                if identifier.contains(key) {
                    return (key, rank, obs.confidence)
                }
            }
        }

        if let top = observations.first {
            return (top.identifier, 500, top.confidence)
        }
    } catch {
        print("Error analyzing \(imageURL.lastPathComponent): \(error)")
    }

    return ("unclassified", 500, 0.0)
}

// 1. Resolve folder path from command line arguments
let targetPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "."
let sourceURL = URL(fileURLWithPath: targetPath)
let fileManager = FileManager.default

let validExtensions = ["jpg", "jpeg", "png", "heic", "tiff", "tif", "webp"]

guard let rawFiles = try? fileManager.contentsOfDirectory(at: sourceURL, includingPropertiesForKeys: nil) else {
    print("Error: Could not read directory at \(sourceURL.path)")
    exit(1)
}

let files = rawFiles.filter { url in
    validExtensions.contains(url.pathExtension.lowercased()) && !url.lastPathComponent.hasPrefix(".")
}

guard !files.isEmpty else {
    print("No valid images found in \(sourceURL.path)")
    exit(0)
}

print("Found \(files.count) photos. Analyzing on Neural Engine...")

// 2. Classify
var scored: [(url: URL, label: String, rank: Int, confidence: Float)] = []
for file in files {
    let result = classify(imageURL: file)
    scored.append((url: file, label: result.label, rank: result.rank, confidence: result.confidence))
}

// 3. Sort by priority rank
scored.sort { $0.rank < $1.rank }

// 4. Output directory setup
let outputDir = sourceURL.appendingPathComponent("sorted_output")
try? fileManager.createDirectory(at: outputDir, withIntermediateDirectories: true)

// 5. Copy files & generate Markdown manifest
var mdLines: [String] = []
let folderName = sourceURL.lastPathComponent

mdLines.append("# Listing Photo Manifest: \(folderName)")
mdLines.append("")
mdLines.append("- **Total Images:** \(scored.count)")
mdLines.append("- **Generated:** \(Date().formatted(date: .abbreviated, time: .shortened))")
mdLines.append("- **Engine:** Apple Neural Engine (`VNClassifyImageRequest`)")
mdLines.append("")
mdLines.append("## Photo Sequence")
mdLines.append("")
mdLines.append("| # | Room / Scene | Confidence | Sorted Filename | Original Filename |")
mdLines.append("|---|---|---|---|---|")

for (index, item) in scored.enumerated() {
    let prefix = String(format: "%02d", index + 1)
    let newFilename = "\(prefix)_\(item.label)_\(item.url.lastPathComponent)"
    let destURL = outputDir.appendingPathComponent(newFilename)

    if fileManager.fileExists(atPath: destURL.path) {
        try? fileManager.removeItem(at: destURL)
    }
    try? fileManager.copyItem(at: item.url, to: destURL)

    let confPercent = "\(Int(item.confidence * 100))%"
    let cleanLabel = item.label.replacingOccurrences(of: "_", with: " ").capitalized
    mdLines.append("| \(prefix) | **\(cleanLabel)** | \(confPercent) | `\(newFilename)` | `\(item.url.lastPathComponent)` |")
}

mdLines.append("")
mdLines.append("## Room Breakdown")
mdLines.append("")

let grouped = Dictionary(grouping: scored, by: { $0.label })
for (label, items) in grouped.sorted(by: { $0.value.count > $1.value.count }) {
    let cleanLabel = label.replacingOccurrences(of: "_", with: " ").capitalized
    mdLines.append("* **\(cleanLabel):** \(items.count) photo(s)")
}

// Write the markdown file
let mdContent = mdLines.joined(separator: "\n")
let mdURL = outputDir.appendingPathComponent("listing_manifest.md")

do {
    try mdContent.write(to: mdURL, atomically: true, encoding: .utf8)
    print("Markdown manifest saved to: \(mdURL.path)")
} catch {
    print("Failed to write Markdown manifest: \(error)")
}

print("Finished! Files and manifest ready in: \(outputDir.path)")
```

---

## Automator Droplet Setup

1. Open **Automator** (`Cmd + Space` → `Automator`).
2. Select **Application** as the document type.
3. Add the **Run Shell Script** action from the library.
4. Set **Pass input:** to `as arguments`.
5. Enter the shell script:
   ```bash
   for f in "$@"
   do
       /usr/bin/swift "/Users/andrewrich/Desktop/Listing Folder/Photo Sorter/sort_listing.swift" "$f"
   done
   ```
6. Save the application as `Listing Sorter.app` to `/Applications` or the Desktop.
7. Drag `Listing Sorter.app` into the macOS Dock for one-click drag-and-drop processing.

If the script location changes, update the shell script's path and re-save the Automator app.

---

## Downstream Claude Integration

Feed the generated `sorted_output/listing_manifest.md` directly into Claude with prompts such as:

- *"Write an MLS public description highlighting the architectural flow from the foyer through the kitchen based on this photo sequence."*
- *"Identify any critical rooms missing from this listing set based on the room breakdown summary."*
- *"Create an Instagram carousel outline matching the first 10 photos in this manifest."*

---

## Relationship to Other Docs

| Doc | Relationship |
|---|---|
| `Lennar_New_Listing_Protocol.md` (`LENNAR-OPS-PROTOCOL-002`) | Downstream — Step 4a resolves photo source; this tool runs between download and Matrix upload |
| `REPO_STRUCTURE.md` | Categorizes this doc under `docs/local-tools/` |
| `Lennar_Photo_Preprocessing.md` (`AAR-TC-LENNAR-PHOTO-001`) | Predecessor — prior design/plan doc under `docs/lennar/`. Deleted at the same commit that created this doc. |

---

## Protocol Note

The operational protocol's photo step (`Lennar_New_Listing_Protocol.md` Step 4a and downstream) can reference this tool as:

> **Photos:** Download from Box link or Stefanie email to local folder. Drop folder onto `Listing Sorter.app`. Upload the resulting `sorted_output/` folder to the Google Drive property folder. Upload to Matrix — order is already correct.

---

## Version History

| Version | Date | Notes |
|---|---|---|
| 1.0 | 2026-09-28 | Initial authoring under new doc ID `AAR-TC-TOOLS-PHOTO-SORTER-001` after migration from `docs/lennar/Lennar_Photo_Preprocessing.md` (`AAR-TC-LENNAR-PHOTO-001`, v1.0, 2026-06-21). Captures the Gemini-built Swift POC — replaces the prior doc's Python/pyobjc plan and open-questions/roadmap sections with the actual built implementation, Automator droplet setup, and downstream Claude prompt examples. Reconciles category table to what the code actually does. Adds Status & Refinement Path section naming Lennar-tuned variant, tighter category groupings, confidence threshold tuning, and `--dry-run` flag as future work. |

---

*AAR-TC Transaction Services | agentandrewrich@gmail.com | www.aar-tc.com*
*Claude-facing document. Update version history and date with each revision.*
