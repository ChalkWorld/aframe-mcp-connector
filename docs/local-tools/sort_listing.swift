import Foundation
import Vision
import AppKit

// MLS sequencing priority (lower number = appears earlier in listing order)
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

        // Find the top confidence match that aligns with real estate categories
        for obs in observations where obs.confidence > 0.3 {
            let identifier = obs.identifier.lowercased()
            for (key, rank) in categoryRank {
                if identifier.contains(key) {
                    return (key, rank, obs.confidence)
                }
            }
        }

        // Fallback: Return top raw label if no priority keyword matched
        if let top = observations.first {
            return (top.identifier, 500, top.confidence)
        }
    } catch {
        print("Error on \(imageURL.lastPathComponent): \(error)")
    }

    return ("unclassified", 500, 0.0)
}

// 1. Resolve folder path from command line argument
let targetPath = CommandLine.arguments.count > 1 ? CommandLine.arguments[1] : "."
let sourceURL = URL(fileURLWithPath: targetPath)
let fileManager = FileManager.default

let validExtensions = ["jpg", "jpeg", "png", "heic"]
guard let files = try? fileManager.contentsOfDirectory(at: sourceURL, includingPropertiesForKeys: nil)
    .filter({ validExtensions.contains($0.pathExtension.lowercased()) }) else {
    print("No valid image files found in \(targetPath)")
    exit(1)
}

print("🔍 Found \(files.count) listing photos. Analyzing on Neural Engine...")

// 2. Classify each photo
var scored: [(url: URL, label: String, rank: Int, confidence: Float)] = []
for file in files {
    let result = classify(imageURL: file)
    scored.append((url: file, label: result.label, rank: result.rank, confidence: result.confidence))
}

// 3. Sort by listing sequence rank
scored.sort { $0.rank < $1.rank }

// 4. Safe output: Copy into a 'sorted_output' subfolder (keeps originals safe)
let outputDir = sourceURL.appendingPathComponent("sorted_output")
try? fileManager.createDirectory(at: outputDir, withIntermediateDirectories: true)

print("\n--- Sorting Results ---")
for (index, item) in scored.enumerated() {
    let prefix = String(format: "%02d", index + 1)
    let newFilename = "\(prefix)_\(item.label)_\(item.url.lastPathComponent)"
    let destURL = outputDir.appendingPathComponent(newFilename)

    // Copying instead of renaming so the originals are untouched
    try? fileManager.copyItem(at: item.url, to: destURL)
    let confPercent = Int(item.confidence * 100)
    print("[\(prefix)] \(item.label.uppercased()) (\(confPercent)% conf) -> \(newFilename)")
}

print("\n Finished! Sorted photos copied to: \(outputDir.path)")

