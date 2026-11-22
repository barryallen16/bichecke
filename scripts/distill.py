"""Teacher VLM Distillation Pipeline for Counterfeit Bike Parts Detection.

Queries an expert Teacher VLM (Qwen2.5-VL-32B or Gemini 2.0 Flash via OpenRouter)
to generate high-precision reasoning and pseudo-labels for bike parts inspection.
Supports automatic API key rotation and batch resumption.
"""

import argparse
import base64
import itertools
import json
import os
import time
from typing import Dict, List, Optional
import openai
from tqdm import tqdm

COUNTERFEIT_DETECTION_PROMPTS = {
    "spark_plug": {
        "inspection_focus": [
            "Electrode alignment (straight vs bent/offset)",
            "Insulator ceramic color (white vs yellowed/discolored)",
            "Threading quality (crisp vs rough/stripped)",
            "Brand marking clarity (NGK/Denso/Champion - sharp vs blurry)",
            "Metal finish consistency (uniform vs scratchy/dull)",
            "Crimping area (smooth vs machine cutting marks)",
            "Hexagon section (LOT number present vs missing)",
            "Center electrode tip (iridium tip vs nickel)",
        ],
        "red_flags": [
            "Rotatable porcelain portion (indicates loose assembly)",
            "Machine cutting marks on crimping or C-groove (remanufacturing)",
            "Blurry or smudged font on brand name",
            "Missing or incorrect LOT number on hexagon",
            "Electrode artificially tapered with lathe marks",
            "Inconsistent paint or ceramic finish",
        ],
    },
    "helmet": {
        "inspection_focus": [
            "Shell finish quality (smooth uniform vs rough/uneven paint)",
            "Certification labels (ISI/DOT/ECE clear vs missing/blurry)",
            "Hologram security features (present vs missing)",
            "Strap stitching quality (tight uniform vs loose/wavy/skipped)",
            "Padding thickness (firm multi-layer vs single thin layer)",
            "Visor clarity (clear transparent vs cloudy/scratched)",
            "Ventilation holes (clean sharp edges vs rough/unfinished)",
            "Logo printing (sharp alignment vs misaligned)",
        ],
        "red_flags": [
            "Missing ISI/DOT/ECE certification labels or hologram marks",
            "Paint overlaps or misaligned seams",
            "Single layer cheap foam padding instead of multi-density EPS",
            "Flimsy chin closure without emergency quick-release",
            "Loose stitching or wavy seams",
            "Rough or unfinished ventilation hole edges",
        ],
    },
    "air_filter": {
        "inspection_focus": [
            "Pleating uniformity (consistent spacing vs irregular/uneven)",
            "Frame rigidity (sturdy vs flimsy/warped)",
            "Seal/gasket integrity (complete coverage vs missing/partial)",
            "Seal material quality (flexible rubber vs hard/brittle)",
            "Filter media density (consistent thickness vs thin spots)",
            "Edge finishing (clean sealed vs frayed/rough edges)",
            "Brand logo clarity (sharp print vs blurry/faded)",
            "Mounting holes alignment (precise vs misaligned)",
        ],
        "red_flags": [
            "Uneven pleat spacing with collapsed sections",
            "Torn or punctured filter media",
            "Frayed or rough unsealed edges",
            "Deformed or warped frame",
            "Missing seal coverage or brittle rubber",
            "Filter media separating from frame edges",
        ],
    },
}


def build_prompt(part_type: str) -> str:
    spec = COUNTERFEIT_DETECTION_PROMPTS.get(part_type, {})
    focus = "\n".join(f"  {i+1}. {pt}" for i, pt in enumerate(spec.get("inspection_focus", [])))
    flags = "\n".join(f"  * {fl}" for fl in spec.get("red_flags", []))

    return f"""COUNTERFEIT DETECTION ANALYSIS: {part_type.upper().replace('_', ' ')}

Inspect the provided image for physical manufacturing quality, authenticity, and defects.

Key Inspection Points:
{focus}

Common Counterfeit Red Flags:
{flags}

Evaluation Criteria:
- Examine physical build quality and manufacturing precision.
- Flag misalignments, rough edges, smudged branding, or material defects.
- Distinguish genuine high-precision fabrication from low-grade counterfeit replicas.

Return valid JSON strictly matching this schema:
{{
  "classification": "GENUINE" | "COUNTERFEIT",
  "confidence": 0.85,
  "primary_reasons": [
    "specific observation 1",
    "specific observation 2"
  ]
}}"""


def get_api_clients(explicit_keys: Optional[List[str]] = None) -> itertools.cycle:
    keys: List[str] = []
    if explicit_keys:
        keys.extend(explicit_keys)
    elif os.getenv("OPENROUTER_API_KEYS"):
        keys.extend([k.strip() for k in os.getenv("OPENROUTER_API_KEYS", "").split(",") if k.strip()])
    elif os.getenv("OPENROUTER_API_KEY"):
        keys.append(os.getenv("OPENROUTER_API_KEY", "").strip())
    elif os.getenv("OPENAI_API_KEY"):
        keys.append(os.getenv("OPENAI_API_KEY", "").strip())

    if not keys:
        raise ValueError("No API key found. Set OPENROUTER_API_KEY or OPENROUTER_API_KEYS environment variable.")

    clients = [
        openai.OpenAI(base_url="https://openrouter.ai/api/v1", api_key=k)
        for k in keys
    ]
    return itertools.cycle(clients)


def classify_image(
    client_cycle: itertools.cycle,
    image_path: str,
    part_type: str,
    model: str,
) -> Optional[Dict]:
    with open(image_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    ext = os.path.splitext(image_path)[1].lower()
    mime = "image/png" if ext == ".png" else "image/jpeg"
    prompt = build_prompt(part_type)

    for _ in range(3):
        client = next(client_cycle)
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[{
                    "role": "user",
                    "content": [
                        {"type": "image_url", "image_url": {"url": f"data:{mime};base64,{encoded}"}},
                        {"type": "text", "text": prompt},
                    ],
                }],
                temperature=0.2,
                max_tokens=512,
            )
            raw = response.choices[0].message.content or ""
            start = raw.find("{")
            end = raw.rfind("}") + 1
            if start == -1 or end <= 0:
                continue
            data = json.loads(raw[start:end])
            if data.get("classification") in ["GENUINE", "COUNTERFEIT"]:
                data["confidence"] = float(data.get("confidence", 0.5))
                return data
        except Exception as e:
            time.sleep(2.0)
            continue
    return None


def run_distillation(
    input_path: str,
    output_path: str,
    model: str,
    start: int = 0,
    end: Optional[int] = None,
    delay: float = 2.0,
):
    with open(input_path, "r", encoding="utf-8") as f:
        data_list = json.load(f)

    processed = set()
    if os.path.exists(output_path):
        with open(output_path, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    processed.add(json.loads(line.strip())["image_path"])
                except Exception:
                    continue

    items = data_list[start:end] if end is not None else data_list[start:]
    pending = [x for x in items if x["image_path"] not in processed]

    print(f"Total target: {len(items)} | Already completed: {len(items) - len(pending)} | Pending: {len(pending)}")
    if not pending:
        print("Nothing to process.")
        return

    client_cycle = get_api_clients()
    os.makedirs(os.path.dirname(output_path) or ".", exist_ok=True)

    for item in tqdm(pending, desc="Distilling"):
        res = classify_image(client_cycle, item["image_path"], item["part_type"], model)
        if res:
            is_fake = res["classification"] == "COUNTERFEIT"
            claimed_fake = item["claimed_label"] == "fake"
            agrees = is_fake == claimed_fake

            record = {
                "filename": item["filename"],
                "image_path": item["image_path"],
                "part_type": item["part_type"],
                "claimed_label": item["claimed_label"],
                "vlm_classification": res["classification"],
                "vlm_confidence": res["confidence"],
                "vlm_reasons": res.get("primary_reasons", []),
                "agreement": agrees,
            }
            with open(output_path, "a", encoding="utf-8") as f:
                f.write(json.dumps(record) + "\n")
        time.sleep(delay)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Distill Teacher VLM labels for counterfeit detection")
    parser.add_argument("--input", default="data/data_list.json", help="Path to input data_list.json")
    parser.add_argument("--output", default="data/validation_results.jsonl", help="Output jsonl path")
    parser.add_argument("--model", default="qwen/qwen2.5-vl-32b-instruct:free", help="Teacher VLM model")
    parser.add_argument("--start", type=int, default=0, help="Start index")
    parser.add_argument("--end", type=int, default=None, help="End index")
    parser.add_argument("--delay", type=float, default=2.0, help="Delay in seconds between requests")
    args = parser.parse_args()

    run_distillation(args.input, args.output, args.model, args.start, args.end, args.delay)
