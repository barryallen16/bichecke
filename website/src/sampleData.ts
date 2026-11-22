import { DetectionResult } from "./types";

export interface SamplePart {
  id: string;
  name: string;
  category: string;
  expectedStatus: "genuine" | "counterfeit";
  thumbnailUrl: string;
  fileName: string;
  mockResult: DetectionResult;
}

export const SAMPLE_PARTS: SamplePart[] = [
  {
    id: "sample-spark-plug-fake",
    name: "Spark Plug (Counterfeit)",
    category: "Spark Plug",
    expectedStatus: "counterfeit",
    thumbnailUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='%231e293b'><rect width='120' height='120' rx='12'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%23ef4444'>⚠️</text><text x='50%' y='75%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' font-weight='600' fill='%2394a3b8'>Fake Plug</text></svg>",
    fileName: "sample_spark_plug_fake.jpg",
    mockResult: {
      part_type: "SPARK_PLUG",
      view_type: "CLOSE_UP",
      brand_detected: "NGK (Smudged)",
      assessed_features: ["Electrode Alignment", "Ceramic Insulator", "Crimping Area", "Branding Markings"],
      not_in_frame: ["Hexagon LOT Stamp"],
      indicators: {
        primary_visible_quality: "LOW",
        branding: "SUSPICIOUS",
        certifications_found: [],
      },
      visible_defects: [
        "Electrode visibly offset by ~0.8mm from central axis",
        "Discolored ceramic insulator with yellowish uneven tint",
        "Machine cutting and tool chatter marks on crimping collar",
        "Smudged lettering on brand marking indicating low-grade pad printing",
      ],
      visual_quality: "LOW",
      confidence: 0.88,
      reasoning: "Close-up inspection reveals multiple manufacturing anomalies. The ground electrode shows artificial tapering and offset alignment. The ceramic insulator has inconsistent coloring and lacks the clean glaze of genuine fabrication.",
    },
  },
  {
    id: "sample-helmet-fake",
    name: "Helmet (Counterfeit)",
    category: "Helmet",
    expectedStatus: "counterfeit",
    thumbnailUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='%231e293b'><rect width='120' height='120' rx='12'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%23ef4444'>🪖</text><text x='50%' y='75%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' font-weight='600' fill='%2394a3b8'>Fake Helmet</text></svg>",
    fileName: "sample_helmet_fake.jpg",
    mockResult: {
      part_type: "HELMET",
      view_type: "EXTERIOR",
      brand_detected: "Generic Replica",
      assessed_features: ["Shell Finish", "Visor Clarity", "Chin Strap Stitching", "Padding Thickness"],
      not_in_frame: ["EPS Foam Core Internal"],
      indicators: {
        primary_visible_quality: "LOW",
        branding: "SUSPICIOUS",
        certifications_found: [],
      },
      visible_defects: [
        "Missing mandatory ISI/DOT certification stamps or hologram",
        "Loose and wavy single-line stitching on chin strap webbing",
        "Visible paint run and uneven seam gap around base trim",
        "Flimsy plastic buckle without emergency quick-release mechanism",
      ],
      visual_quality: "LOW",
      confidence: 0.82,
      reasoning: "Exterior inspection shows poor finishing on paint edge seams and non-compliant strap construction. No valid safety certification labels were found on shell or strap webbing.",
    },
  },
  {
    id: "sample-spark-plug-genuine",
    name: "Spark Plug (Genuine)",
    category: "Spark Plug",
    expectedStatus: "genuine",
    thumbnailUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120' fill='%231e293b'><rect width='120' height='120' rx='12'/><text x='50%' y='45%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='28' fill='%2310b981'>✅</text><text x='50%' y='75%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='11' font-weight='600' fill='%2394a3b8'>Real Plug</text></svg>",
    fileName: "sample_spark_plug_genuine.jpg",
    mockResult: {
      part_type: "SPARK_PLUG",
      view_type: "CLOSE_UP",
      brand_detected: "NGK",
      assessed_features: ["Electrode Alignment", "Insulator Ceramic", "Shell Finish", "Thread Quality"],
      not_in_frame: [],
      indicators: {
        primary_visible_quality: "HIGH",
        branding: "PROFESSIONAL",
        certifications_found: ["ISO/TS 16949 compliant marking"],
      },
      visible_defects: [],
      visual_quality: "HIGH",
      confidence: 0.94,
      reasoning: "Electrode exhibits precise axial alignment with zero noticeable tilt. High-density white ceramic insulator with crisp laser-etched lettering. Smooth cold-rolled threads and clean machine crimping indicate factory-genuine quality.",
    },
  },
];
