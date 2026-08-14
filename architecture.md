# VeritasAI — System Architecture & Diagnostic Pipeline

This document details the software architecture, data processing flow, and statistical diagnostic pipeline of **VeritasAI**. It explains how submitted essays pass through multi-signal NLP extractors, scoring engines, and threshold classifiers to produce evidence-based writing reports.

---

## 📋 Table of Contents

- [1. Architectural Overview](#1-architectural-overview)
- [2. System Layer Diagram](#2-system-layer-diagram)
- [3. Core Diagnostic Pipeline Flow](#3-core-diagnostic-pipeline-flow)
- [4. Deep-Dive: Module Breakdown](#4-deep-dive-module-breakdown)
  - [4.1 Input Validation & Character Slicing (`text.py`)](#41-input-validation--character-slicing-textpy)
  - [4.2 Multi-Signal Extractors](#42-multi-signal-extractors)
  - [4.3 Evidence Construction (`evidence.py`)](#43-evidence-construction-evidencepy)
  - [4.4 Scoring Engine & Severity Mapping (`scoring.py`)](#44-scoring-engine--severity-mapping-scoringpy)
- [5. Score Normalization & Severity Levels](#5-score-normalization--severity-levels)
- [6. Document Classification & Priority Aggregation](#6-document-classification--priority-aggregation)
- [7. Design Principles & Technical Constraints](#7-design-principles--technical-constraints)

---

## 1. Architectural Overview

VeritasAI uses a **layered statistical pipeline architecture** that prioritizes transparency, sentence-level granularity, and non-destructive text processing:

1. **Decoupled Processing:** The frontend web dashboard (Next.js 14) and analysis backend (FastAPI) communicate strictly over asynchronous HTTP/JSON API contracts.
2. **Multi-Signal Extraction:** Essays are analyzed using four independent statistical dimensions: **Perplexity**, **Sentence Rhythm (Burstiness)**, **Formulaic Phrasing (Tropes)**, and **Lexical Predictability (Repetition/Diversity)**.
3. **Evidence-Based Output:** Raw statistical metrics are normalized into diagnostic scores ($0.0 - 1.0$) and mapped to contextual flag levels (`none`, `yellow`, `orange`, `red`) accompanied by human-readable explanations.

---

## 2. System Layer Diagram

```text
┌────────────────────────────────────────────────────────┐
│                   Frontend Dashboard                   │
│               (Next.js 14 / React 18 / UI)             │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ HTTP / JSON Payload
                            ▼
┌────────────────────────────────────────────────────────┐
│                     FastAPI Engine                     │
│                 (CORS & API Router)                    │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                  Pipeline Controller                   │
│             app.analysis.pipeline.analyze_essay        │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│               Text Slicing & Normalization             │
│                  app.analysis.text.py                  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│             Multi-Signal Analysis Engine               │
│    (Perplexity | Burstiness | Tropes | Features)       │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              Scoring & Evidence Engine                 │
│         app.analysis.scoring & evidence.py             │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│                 AnalysisResult Output                  │
│                     (JSON Payload)                     │
└────────────────────────────────────────────────────────┘
```

---

## 3. Core Diagnostic Pipeline Flow

The following diagram illustrates how an input essay flows from raw text, breaks into sentence components, parallel-executes feature extractors, passes into `scoring.py`, and resolves into severity flag levels:

```text
                               RAW ESSAY INPUT
                                      │
                                      ▼
                        ┌───────────────────────────┐
                        │   Text Slicing & Bounds   │
                        │    (app/analysis/text.py) │
                        └─────────────┬─────────────┘
                                      │
                                      ▼
                            INDIVIDUAL SENTENCES
                                      │
             ┌────────────────────────┴────────────────────────┐
             │                                                 │
             ▼                                                 ▼
┌──────────────────────────┐                      ┌──────────────────────────┐
│   Language Model LM      │                      │     Lexical Features     │
│   Token Predictability   │                      │  Diversity & Statistics  │
│(app/analysis/perplexity) │                      │ (app/analysis/features)  │
└────────────┬─────────────┘                      └────────────┬─────────────┘
             │                                                 │
             ├────────────────────────┬────────────────────────┤
             │                        │                        │
             ▼                        ▼                        ▼
┌──────────────────────────┐┌───────────────────┐┌──────────────────────────┐
│   Formulaic Tropes       ││    Burstiness     ││   Lexical Repetition     │
│  Pattern Identification  ││ Sentence Rhythm   ││    (N-Gram & Word)       │
│  (app/analysis/tropes)   ││(app/analysis/burstiness)│(app/analysis/features) │
└────────────┬─────────────┘└─────────┬─────────┘└────────────┬─────────────┘
             │                        │                       │
             └────────────────────────┼───────────────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   Scoring Engine         │
                         │(app/analysis/scoring.py) │
                         └────────────┬─────────────┘
                                      │
                                      ▼
                            COMBINED SIGNAL SCORE
                               (0.0 ──► 1.0)
                                      │
             ┌────────────────────────┼────────────────────────┐
             ▼                        ▼                        ▼
      ┌────────────┐           ┌────────────┐           ┌────────────┐
      │  YELLOW    │           │   ORANGE   │           │    RED     │
      │ Low Signal │           │ Med Signal │           │ High Signal│
      └────────────┘           └────────────┘           └────────────┘
             │                        │                        │
             └────────────────────────┼────────────────────────┘
                                      │
                                      ▼
                         ┌──────────────────────────┐
                         │   Document Aggregation   │
                         │    & Review Priority     │
                         └──────────────────────────┘
```

---

## 4. Deep-Dive: Module Breakdown

### 4.1 Input Validation & Character Slicing (`text.py`)
- **Validation:** Rejects inputs with fewer than **20 words** to ensure sufficient sample size for statistical validity.
- **Character Span Extraction:** Slices sentences directly from normalized character offsets rather than reconstructing sentences by joining tokenized words. This guarantees 100% preservation of original text, internal punctuation, and whitespace.

### 4.2 Multi-Signal Extractors

| Module | Metric Analyzed | Description |
| :--- | :--- | :--- |
| **`perplexity.py`** | Token Perplexity ($PPL$) | Evaluates token probability under a local causal language model. Low perplexity indicates predictable wording under that model. |
| **`burstiness.py`** | Length Variation ($CV$) | Calculates standard deviation relative to mean sentence length ($CV = \sigma / \mu$) across the document. Low variance flags uniform structure. |
| **`tropes.py`** | Pattern Matching | Scans for overused, formulaic academic transitions, clichés, and canned bridge phrases. |
| **`features.py`** | Lexical Density & Repetition | Computes Type-Token Ratio (TTR), function-word ratios, repeated content words, and trigram repetition frequency. |

### 4.3 Evidence Construction (`evidence.py`)
Converts raw numerical values into human-readable diagnostic evidence objects (`PassageSignal`). Each signal contains:
- `id`: Unique signal identifier.
- `category`: Primary diagnostic group (`smoothness`, `burstiness`, `tropes`, `predictability`).
- `metricValue`: Raw score (e.g., $PPL = 44.85$).
- `description`: Plain-language explanation for non-technical admissions reviewers.

### 4.4 Scoring Engine & Severity Mapping (`scoring.py`)
Translates multi-dimensional statistical signals into a single normalized sentence score and maps it to a severity flag level.

---

## 5. Score Normalization & Severity Levels

The sentence score ($\mathcal{S}$) is bounded between $0.0$ and $1.0$:

$$\mathcal{S} \in [0.0, 1.0]$$

Raw feature outputs are normalized and combined using weighted threshold mapping in `scoring.py`:

```text
Score Range         Flag Level    Severity      Diagnostic Interpretation
──────────────────────────────────────────────────────────────────────────────────────────
0.00 ──► 0.35       none          Normal        Natural statistical variability detected.
0.36 ──► 0.60       yellow        Low Signal    Slight statistical baseline deviation.
0.61 ──► 0.80       orange        Medium        Moderate signal concentration detected.
0.81 ──► 1.00       red           High Signal   Significant structural/predictability signal.
```

> ⚠️ **Terminology Rule:** Flag levels represent levels of statistical deviation and **must not** be labeled as "AI" or "Human" percentage probabilities.

---

## 6. Document Classification & Priority Aggregation

Once all individual sentences are analyzed, the pipeline calculates document-level aggregate indicators:

1. **Signal Distribution:** Measures the percentage of sentences falling into each flag tier:
   - `normalPct`: % of unflagged sentences (`none`).
   - `lowPct`: % of `yellow` sentences.
   - `mediumPct`: % of `orange` sentences.
   - `highPct`: % of `red` sentences.

2. **Overall Review Priority:** Aggregates document distribution metrics into a document review priority:
   - **`LOW`**: $\ge 85\%$ normal distribution; minimal statistical flags.
   - **`MEDIUM`**: Accumulated `yellow` or `orange` passages requiring contextual reading.
   - **`HIGH`**: Concentrated `red` flags indicating uniform predictability or structural repetition throughout the document.

---

## 7. Design Principles & Technical Constraints

- **Deterministic Slicing:** Sentence boundary extraction uses character span offsets (`_sentence_spans`) to avoid string reconstruction artifacts.
- **Isolated Feature Processors:** Each signal module (`perplexity.py`, `burstiness.py`, `tropes.py`, `features.py`) operates as a standalone extractor without shared state.
- **Decision Support Design:** The system is explicitly engineered to assist human reviewers in admissions workflows rather than acting as an automated decision maker.
