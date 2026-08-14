<div align="center">

# VeritasAI

**Statistical Admissions Essay Diagnostics Engine**

[![Python 3.11](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.116.1-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.8.0-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Hugging Face](https://img.shields.io/badge/Transformers-4.55.4-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)](https://huggingface.co/)

<p align="center">
  An evidence-based diagnostic platform providing sentence-level statistical writing diagnostics for university admissions essays.
</p>

</div>

---

> [!IMPORTANT]
> **Diagnostic System Disclaimer**  
> VeritasAI evaluates measurable linguistic signals (e.g., perplexity, sentence rhythm, lexical predictability, formulaic phrasing). It provides **evidence-based writing diagnostics** for human reviewers and **does not deterministically prove human or AI authorship**.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Repository Structure](#-repository-structure)
- [How Analysis Works](#-how-analysis-works)
- [Quick Start](#-quick-start)
  - [macOS Installation](#macos)
  - [Windows Installation](#windows)
- [API Reference](#-api-reference)
  - [Health Check](#1-health-check)
  - [Analyze Essay](#2-analyze-essay)
- [Diagnostic Signal Framework](#-diagnostic-signal-framework)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Responsible AI & Ethics](#-responsible-ai--ethics)
- [Limitations](#-limitations)
- [Roadmap](#-roadmap)
- [License & Legal](#-license--legal)

---

## 🔍 Overview

VeritasAI addresses the challenge of evaluating academic writing integrity by shifting focus away from binary "AI vs. Human" categorization. Instead, it provides admissions committees with granular, interpretable statistical metrics:

- **Sentence-Level Granularity:** Analyzes each sentence independently while preserving original document layout and context.
- **Multi-Signal Fusion:** Combines language model perplexity, sentence rhythm (burstiness), formulaic phrase detection, and lexical repetition metrics.
- **Evidence-Oriented Reporting:** Outputs structured signal indicators, sentence scores, review priorities, and document-level distribution percentages.

---

## ✨ Key Features

| Feature | Description |
| :--- | :--- |
| **Sentence Preservation Slicing** | Extracts exact sentence spans via character offsets, preventing text corruption caused by token re-joining. |
| **Vocabulary Smoothness Engine** | Leverages local causal language models to calculate token-level perplexity across custom baselines. |
| **Burstiness & Rhythm Analysis** | Measures length variation ($CV$) across sentence distributions to flag unnatural structural uniformity. |
| **Formulaic Phrase Detection** | Identifies overused academic transitions, cliché bridges, and canned structural phrasing patterns. |
| **Lexical Predictability Matrix** | Computes Type-Token Ratio (TTR), repeated content-word ratios, and trigram repetition frequency. |
| **Document Review Priority** | Aggregates sentence-level flags into an overall document priority (`LOW`, `MEDIUM`, `HIGH`). |

---

## 🏗 System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend Dashboard                   │
│                   (Next.js / React)                    │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                     FastAPI Engine                     │
│                    (CORS & Routing)                    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Analysis Pipeline                    │
│                  app.analysis.pipeline                 │
└───────────────────────────┬────────────────────────────┘
                            │
       ┌────────────────────┼────────────────────┐
       ▼                    ▼                    ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Perplexity  │     │  Burstiness  │     │  Tropes /    │
│  (Local LM)  │     │   (Rhythm)   │     │  Phrasing    │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Lexical Feature Integration                │
│             & Combined Statistical Scoring             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 AnalysisResult Payload                 │
└────────────────────────────────────────────────────────┘
```

---

## 📂 Repository Structure

```text
backend/
├── app/
│   ├── main.py              # Application entrypoint, CORS & middleware
│   ├── models.py            # Pydantic data schemas (Request/Response)
│   ├── api/
│   │   └── routes.py        # REST API endpoint handlers
│   └── analysis/
│       ├── text.py          # Normalization & character-span sentence extraction
│       ├── pipeline.py      # Core diagnostic pipeline orchestration
│       ├── perplexity.py    # Causal LM perplexity scoring engine
│       ├── features.py      # Lexical statistics (TTR, n-grams, word frequency)
│       ├── tropes.py        # Pattern matching for formulaic transitions
│       └── evidence.py      # Structured diagnostic evidence generator
├── requirements.txt         # Pinned production dependencies
├── test_pipeline.py         # End-to-end integration test suite
├── request.json             # Sample API request payload
├── response.json            # Sample API response output
└── .venv/                   # Virtual environment directory
```

---

## ⚙️ How Analysis Works

```text
Raw Essay Input
  ├─► 1. Input Validation (Ensures text length >= 20 words)
  ├─► 2. Text Normalization (Standardizes CRLF line endings & space alignment)
  ├─► 3. Character-Span Extraction (Slices sentence strings directly without reconstruction)
  ├─► 4. Signal Scoring Engine (Computes Perplexity, Burstiness, Tropes & Lexical density)
  ├─► 5. Score Normalization (Maps signals into a bounded 0.0 – 1.0 confidence score)
  └─► 6. Document Classification (Computes document priority & signal distribution)
```

---

## 🚀 Quick Start

### Prerequisites
- **Python:** `3.11.x` (Recommended)
- **PackageManager:** `pip`
- **Git**

### macOS

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python3.11 -m venv .venv

# 3. Activate virtual environment
source .venv/bin/activate

# 4. Verify environment path
which python  # Expected output: .../backend/.venv/bin/python

# 5. Upgrade pip & install dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Windows

```powershell
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
py -3.11 -m venv .venv

# 3. Activate virtual environment (PowerShell)
.\.venv\Scripts\Activate.ps1

# If script execution is blocked, run:
# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 4. Verify environment path
where.exe python  # Expected output: ...\backend\.venv\Scripts\python.exe

# 5. Upgrade pip & install dependencies
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

> [!NOTE]
> For extended setup guides, troubleshooting steps, and alias resolutions, consult [`installation.md`](installation.md).

---

## 🖥 Running the Backend

Start the Uvicorn ASGI server with the environment activated:

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

- **Base URL:** `http://127.0.0.1:8000`
- **Interactive OpenAPI Documentation:** `http://127.0.0.1:8000/docs`

---

## 📡 API Reference

### 1. Health Check
Retrieves system operational status.

- **Endpoint:** `GET /health`
- **Response:**
  ```json
  {
    "status": "ok",
    "service": "veritasai"
  }
  ```

---

### 2. Analyze Essay
Runs full statistical diagnostic analysis on submitted essay text.

- **Endpoint:** `POST /api/analyze`
- **Content-Type:** `application/json`

#### Request Body
```json
{
  "essay": "I have always been fascinated by technology. When I was younger, I built small projects with whatever materials I could find. One experiment failed repeatedly, but the failure taught me to approach problems differently. Eventually, I learned that understanding why something breaks can be more valuable than simply making it work.",
  "model_id": "custom"
}
```

#### Curl Command
```bash
curl -s -X POST http://127.0.0.1:8000/api/analyze \
  -H "Content-Type: application/json" \
  --data-binary @request.json
```

#### Response Structure
```json
{
  "id": "VER-1234567890AB",
  "title": "Admissions Essay Analysis",
  "processedAt": "2026-08-12 16:45 UTC",
  "rawText": "I have always been fascinated by technology...",
  "wordCount": 51,
  "sentenceCount": 4,
  "readingTimeMinutes": 1,
  "analysisComplexity": "Low",
  "reviewPriority": "LOW",
  "distribution": {
    "lowPct": 0,
    "mediumPct": 0,
    "highPct": 0,
    "normalPct": 100
  },
  "sentences": [
    {
      "id": "s0",
      "index": 0,
      "paragraphIndex": 0,
      "text": "I have always been fascinated by technology.",
      "flagLevel": "none",
      "signalScore": 0.0,
      "passageCategory": "smoothness",
      "signals": [],
      "summaryExplanation": "Wording pattern shows natural variability."
    }
  ],
  "summaryMessage": "No significant statistical flags detected."
}
```

---

## 📊 Diagnostic Signal Framework

### Indicator Matrix

| Category | Primary Metric | Description |
| :--- | :--- | :--- |
| **Smoothness** | Language Model Perplexity | Evaluates predictability of word transitions given the model. |
| **Burstiness** | Coefficient of Variation ($CV$) | Evaluates standard deviation relative to mean sentence length. |
| **Tropes** | Pattern Matching | Scans for overused, formulaic transitional academic expressions. |
| **Predictability** | TTR & Trigram Repetition | Measures vocabulary richness and structural phrase repetition. |

### Severity Flag Levels

| Flag Level | Classification | Meaning |
| :---: | :---: | :--- |
| `none` | Normal | Typical human writing metrics; no noticeable anomaly. |
| `yellow` | Low Anomaly | Slight statistical deviation; low review priority. |
| `orange` | Medium Anomaly | Moderate accumulation of statistical indicators. |
| `red` | High Anomaly | High statistical uniformity/predictability; requires review. |

---

## 🧪 Testing & Quality Assurance

### 1. Syntax Compilation Verification
```bash
python -m py_compile app/analysis/pipeline.py
python -m py_compile app/analysis/text.py
```

### 2. End-to-End Pipeline Execution
```bash
python test_pipeline.py
```

### 3. Exact Text Preservation Test
Ensures punctuation, whitespace, and internal character spans are preserved:
```python
from app.analysis.text import extract_sentences

essay = "Eventually, I learned that understanding why something breaks."
sentences = extract_sentences(essay)

assert "understanding why" in sentences[0].text
assert "understandingwhy" not in sentences[0].text
print("Sentence preservation verified.")
```

---

## ⚖️ Responsible AI & Ethics

VeritasAI is engineered as a **decision-support tool** for academic evaluators, not an automated gatekeeper.

```text
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│ Statistical      │ ──► │ Human Reviewer   │ ──► │ Contextual       │ ──► │ Informed         │
│ Diagnostic Flag  │     │ Evaluation       │     │ Evidence Check   │     │ Admission Decision│
└──────────────────┘     └──────────────────┘     └──────────────────┘     └──────────────────┘
```

- **Avoid False Positives:** High polish, academic phrasing, technical terms, or non-native English structural style can trigger statistical flags.
- **No Automatic Penalties:** Flags should serve as indicators for manual reading rather than grounds for rejection.

---

## ⚠️ Limitations

1. **Inconclusive Proof:** Statistical metrics cannot conclusively attribute document authorship.
2. **Minimum Length Requirement:** Short texts (< 20 words) do not yield statistically significant metric distributions.
3. **Model Dependence:** Perplexity scores are relative to the selected language model baseline.

---

## 🗺 Roadmap

- [x] Fast, decoupled FastAPI backend.
- [x] Character-span extraction for exact sentence fidelity.
- [x] Multi-signal fusion engine (Perplexity, Burstiness, Tropes, Lexical).
- [x] Complete REST API response schema with sentence-level metadata.
- [ ] Multi-model perplexity ensemble benchmarking.
- [ ] Stylometric character-level analysis additions.
- [ ] Exportable PDF diagnostic report generation.

---

## 📄 License & Legal

### License
This project is currently unlicensed. Please consult maintainers prior to commercial distribution.

### Legal Disclaimer
VeritasAI provides statistical diagnostics regarding text characteristics. It does not provide definitive authorship attribution and must not be represented as a system capable of proving whether an essay was written by a human or generated by an AI.
