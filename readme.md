Bichecke
- A VLM based system for assessing warrantly claims of bike parts such as helmets, spark plugs, airfilter on the edge devices such as mobile phone. 
- A large vlm (teacher model) is distilled for knowledge transfer to a Small Vlm (<=2b model).
- i chose only to focus only three categories such as helmets , sparkplugs , airfilters to show the proof of concept.
- i use openrouter to get the distallation dataset from teacher model. i use multi-key routing such that i can use another key after one key's daily limit is exceeded.
---
check for uv 
```
uv --version
```
install uv from [link](https://docs.astral.sh/uv/getting-started/installation/) if not available

Quickstart
```
git clone https://github.com/barryallen16/bichecke.git
cd bichecke
uv venv --python 3.11
.venv/Scripts/activate
uv sync
cd ui
uv run app.py #runs the ui interface
```

Finetuned model
- https://huggingface.co/sarav7s/qwen3vl-4b-bichecke-gguf
- training: `notebooks/finetune-qwen3vl.ipynb`, metrics in `archive/`
- inference: `notebooks/model_inference.ipynb` (colab/kaggle)

Distillation pipeline
- pipeline: `archive/saravana_groq_reclassify.ipynb`, results in `archive/`

Website (lm studio)
```
lms server start --cors
cd website
bun run dev
```
