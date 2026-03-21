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
uv pip install -r requirements.txt
cd ui
uv run app.py #runs the ui interface
```
