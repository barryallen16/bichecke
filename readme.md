# Loupe: Edge VLM Counterfeit Detection

Distilling frontier Vision-Language Models into compact, edge-deployable VLMs for automated motorcycle parts warranty verification.

---

## Overview

Counterfeit motorcycle components (spark plugs, helmets, air filters) cause catastrophic failures and fraudulent warranty claims.
Detecting counterfeits requires inspecting subtle physical indicators such as electrode alignment, pleat consistency, and certification markings.
Frontier VLMs excel at this visual reasoning, but are too heavy for low-latency field deployment on mobile or edge devices.

Loupe distills visual reasoning from large teacher models into a compact on-device vision-language model.
The student model generates structured inspections with defect rationales, confidence ratings, and genuine vs counterfeit classifications.

```
+-------------------------------------------------------------+
|                        Teacher VLM                          |
|             (Qwen2.5-VL-32B / Gemini 2.0 Flash)             |
+-------------------------------------------------------------+
                              |
                              | 1. High-precision inspection prompts
                              | 2. Structured reasoning & defect tagging
                              v
+-------------------------------------------------------------+
|                    Distillation Dataset                     |
|         414 samples with visual defect justifications       |
|    Hugging Face: barryallen16/bike_parts_counterfeit_...    |
+-------------------------------------------------------------+
                              |
                              | 3. Parameter-efficient fine-tuning (LoRA / SFT)
                              v
+-------------------------------------------------------------+
|                      Student Model                          |
|            Qwen3-VL-4B-Instruct (Unsloth 4-bit)             |
|                Loss: 2.018 -> 0.203 (200 steps)             |
+-------------------------------------------------------------+
                              |
                              | 4. GGUF quantization
                              v
+-------------------------------------------------------------+
|                      Edge Inference                         |
|           LM Studio (Local Server) + React UI Client        |
|            GGUF: sarav7s/qwen3vl-4b-bichecke-gguf           |
+-------------------------------------------------------------+
```

---

## Artifacts

- **Model Weights (GGUF)**: [sarav7s/qwen3vl-4b-bichecke-gguf](https://huggingface.co/sarav7s/qwen3vl-4b-bichecke-gguf)
- **Merged Model (LoRA)**: [barryallen16/counterfeit-detector-qwen3vl](https://huggingface.co/barryallen16/counterfeit-detector-qwen3vl)
- **Dataset**: [barryallen16/bike_parts_counterfeit_detection](https://huggingface.co/datasets/barryallen16/bike_parts_counterfeit_detection)

---

## Project Structure

```
.
|-- data/                  # Validation logs, prioritized review lists, error traces
|-- dataset1/              # Raw sample dataset across categories
|-- notebooks/
|   |-- finetune-qwen3vl.ipynb      # Unsloth Qwen3-VL-4B fine-tuning on Kaggle GPU
|   |-- model_inference.ipynb       # Interactive inference walkthrough
|   `-- model-training-notebook.ipynb # Edge baseline training
|-- scripts/
|   |-- distill.py         # Multi-key OpenRouter teacher distillation pipeline
|   |-- index_dataset.py   # Dataset ingestion and category indexing
|   `-- clean_dataset.py   # Dataset cleaning and split preparation
|-- ui/                    # Gradio desktop demo interface
|-- website/               # React 19 + Vite web client for local VLM inference
`-- pyproject.toml         # Python environment configuration (uv)
```

---

## Quickstart

### Prerequisites

- [uv](https://docs.astral.sh/uv/) for Python package management.
- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/) for the web interface.

### 1. Environment Setup

```bash
git clone https://github.com/barryallen16/loupe.git
cd loupe
uv sync
```

### 2. Run Teacher Distillation Pipeline

To generate new pseudo-labels from the teacher VLM using OpenRouter:

```bash
export OPENROUTER_API_KEY="your-key-here"
uv run python scripts/distill.py --input data/data_list.json --output data/validation_results.jsonl
```

Key rotation is supported by setting `OPENROUTER_API_KEYS="key1,key2,key3"`.

### 3. Local Model Inference (Web UI)

1. Download the quantized model from Hugging Face:
   [sarav7s/qwen3vl-4b-bichecke-gguf](https://huggingface.co/sarav7s/qwen3vl-4b-bichecke-gguf).
2. Load the GGUF model in [LM Studio](https://lmstudio.ai/) and start the local server with CORS:
   ```bash
   lms server start --cors
   ```
3. Start the web frontend:
   ```bash
   cd website
   bun install
   bun run dev
   ```
4. Upload a part photo in the web UI to inspect genuine vs counterfeit status with step-by-step reasoning.

---

## Inspection Criteria

The model evaluates physical manufacturing indicators rather than surface branding:

- **Spark Plugs**: Electrode alignment, ceramic insulator color, crimping seam precision, and thread finishing.
- **Helmets**: EPS foam thickness, visor transparency, strap rivet construction, and certification labels.
- **Air Filters**: Pleat symmetry, media density, perimeter rubber gasket flexibility, and frame rigidity.
