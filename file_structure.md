# VeritasAI — Project Architecture & Directory Structure

This document provides a comprehensive technical mapping of the actual **VeritasAI** codebase structure, covering backend analysis modules, Next.js frontend pages, API contracts, shared service layers, and data flow architecture.

---

## 📋 Table of Contents

- [1. Directory Tree](#1-directory-tree)
- [2. Key Architectural Highlights](#2-key-architectural-highlights)
- [3. Backend Architecture (`backend/`)](#3-backend-architecture-backend)
  - [3.1 Application Core (`app/`)](#31-application-core-app)
  - [3.2 Data Schemas (`models.py`)](#32-data-schemas-modelspy)
  - [3.3 Analysis Package (`app/analysis/`)](#33-analysis-package-appanalysis)
  - [3.4 Backend Testing & Tooling](#34-backend-testing--tooling)
- [4. Frontend Architecture (`frontend/`)](#4-frontend-architecture-frontend)
  - [4.1 App Router & Pages (`app/`)](#41-app-router--pages-app)
  - [4.2 UI Component Library (`components/`)](#42-ui-component-library-components)
  - [4.3 Service Layer & Logic (`lib/`)](#43-service-layer--logic-lib)
- [5. End-to-End Data Flow](#5-end-to-end-data-flow)
- [6. Separation of Responsibilities](#6-separation-of-responsibilities)
- [7. Technology Stack & Runtime Configuration](#7-technology-stack--runtime-configuration)
- [8. Local Development & Startup Commands](#8-local-development--startup-commands)
- [9. Version Control & Documentation Index](#9-version-control--documentation-index)

---

## 1. Directory Tree

```text
type2/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI application, CORS, and health route
│   │   ├── models.py               # Pydantic schemas for requests and responses
│   │   ├── api/
│   │   │   ├── __init__.py
│   │   │   └── routes.py           # HTTP endpoints (POST /api/analyze)
│   │   └── analysis/
│   │       ├── __init__.py
│   │       ├── text.py             # Character-slice sentence boundary detection
│   │       ├── pipeline.py         # Complete analysis pipeline orchestrator
│   │       ├── perplexity.py       # Language-model token predictability engine
│   │       ├── burstiness.py       # Rhythm and sentence length variation
│   │       ├── tropes.py           # Formulaic phrase pattern matching
│   │       ├── features.py         # Lexical statistics (TTR, n-grams, repetition)
│   │       ├── evidence.py         # Human-readable explanation builder
│   │       └── scoring.py          # Combined score normalization & flag mapper
│   ├── tests/
│   │   └── test_pipeline.py        # Automated test suite
│   ├── requirements.txt            # Python dependencies
│   ├── Dockerfile                  # Containerization image definition
│   ├── .env.example                # Template for environment variables
│   ├── README.md                   # Backend reference guide
│   ├── request.json                # Sample API request payload
│   ├── response.json               # Sample API response output
│   ├── test_pipeline.py            # Local manual verification script
│   └── .venv/                      # Python virtual environment (ignored in git)
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root HTML wrapper and global providers
│   │   ├── globals.css             # Tailwind CSS & custom styles
│   │   ├── page.tsx                # Primary essay diagnostic UI
│   │   ├── dataset/
│   │   │   └── page.tsx            # Dataset overview page
│   │   ├── evaluation/
│   │   │   └── page.tsx            # Performance evaluation benchmarks
│   │   ├── limitations/
│   │   │   └── page.tsx            # Ethical usage & system limitations
│   │   └── methodology/
│   │       └── page.tsx            # Statistical engine methodology
│   ├── components/
│   │   ├── Navbar.tsx              # Top navigation bar
│   │   ├── Footer.tsx              # Application footer & policies
│   │   ├── EssayInputView.tsx      # Essay text entry & submission interface
│   │   ├── LoadingStateView.tsx    # Processing progress indicator
│   │   ├── AnalysisResultsView.tsx # Interactive diagnostic dashboard
│   │   ├── DatasetView.tsx         # Dataset page view wrapper
│   │   ├── EvaluationView.tsx      # Evaluation page view wrapper
│   │   ├── LimitationsView.tsx     # Limitations page view wrapper
│   │   └── MethodologyView.tsx    # Methodology page view wrapper
│   ├── lib/
│   │   ├── analysisService.ts      # Backend API HTTP integration layer
│   │   ├── analyzer.ts             # Client-side helper utilities
│   │   ├── mockData.ts             # Fallback demo datasets for preview UI
│   │   ├── samples.ts              # Preset sample essay fixtures
│   │   ├── scoring.ts              # Frontend UI color/badge helpers
│   │   └── types.ts                # TypeScript interface definitions
│   ├── public/                     # Static assets (images, icons, favicons)
│   ├── package.json                # Node.js dependencies and scripts
│   ├── package-lock.json           # Locked dependency versions
│   ├── tsconfig.json               # TypeScript compiler config
│   ├── postcss.config.js           # PostCSS plugin settings
│   └── next.config.*               # Next.js framework configuration
│
├── README.md                       # Project landing page documentation
├── INSTALLATION.md                 # Detailed setup & dependency guide
├── START_VERITASAI.md              # Quick start launch guide
├── FILE_STRUCTURE.md               # This architectural reference guide
└── .gitignore                      # Version control exclusion rules
```

---

## 2. Key Architectural Highlights

This repository structure reflects a custom, multi-signal NLP implementation tailored specifically for VeritasAI:

1. **Decoupled Backend Modules:** The backend separates text parsing (`text.py`), individual signal extraction (`perplexity.py`, `burstiness.py`, `tropes.py`, `features.py`), scoring normalization (`scoring.py`), and evidence generation (`evidence.py`).
2. **Dedicated Documentation Frontend Routes:** The frontend features standalone routes (`/dataset`, `/evaluation`, `/limitations`, `/methodology`) to ensure transparent user communication regarding statistical limitations.
3. **Structured Frontend Service Layer:** The Next.js client uses `lib/analysisService.ts` for clean API communication, strictly keeping UI components (`components/`) isolated from API handling logic.

---

## 3. Backend Architecture (`backend/`)

The backend is built as a statistical analysis microservice using Python 3.11 and FastAPI.

### 3.1 Application Core (`app/`)

- **`app/main.py`**: Initializes the FastAPI instance, configures CORS middleware for local frontend origins (`http://localhost:3000`), mounts API routers, and exposes `GET /health`.
- **`app/api/routes.py`**: Defines HTTP API route handlers, routing `POST /api/analyze` payloads into `app.analysis.pipeline.analyze_essay()`.

### 3.2 Data Schemas (`app/models.py`)

Pydantic schemas enforce type safety across request payloads and API outputs:

```text
AnalyzeRequest
├── essay: str
└── model_id: str

AnalysisResult
├── id: str
├── title: str
├── processedAt: str
├── rawText: str
├── wordCount: int
├── sentenceCount: int
├── readingTimeMinutes: int
├── analysisComplexity: str
├── reviewPriority: "LOW" | "MEDIUM" | "HIGH"
├── distribution: SignalDistribution
├── sentences: List[SentenceAnalysis]
└── summaryMessage: str
```

### 3.3 Analysis Package (`app/analysis/`)

This package houses the core statistical NLP engine:

| Module | Technical Function |
| :--- | :--- |
| **`text.py`** | Performs text normalization, paragraph indexing, and character-span sentence extraction without joining tokens. |
| **`pipeline.py`** | Coordinates the full analysis workflow from input validation to final object assembly. |
| **`perplexity.py`** | Computes language-model token predictability using local PyTorch/Transformers models. |
| **`burstiness.py`** | Measures length variation ($CV$) across sentence distributions to detect rhythmic uniformity. |
| **`tropes.py`** | Scans text for configured formulaic phrases and academic transition patterns. |
| **`features.py`** | Extracts lexical diversity metrics including Type-Token Ratio (TTR), function-word ratios, and n-gram repetitions. |
| **`evidence.py`** | Generates human-readable diagnostic explanations for flagged passages. |
| **`scoring.py`** | Maps raw metric calculations into normalized $0.0 - 1.0$ diagnostic scores and severity flag levels. |

```text
Raw Essay
    │
    ▼
text.py ──► [Normalizes text & extracts character-sliced sentence spans]
    │
    ├───────────────┬────────────────┬────────────────┐
    ▼               ▼                ▼                ▼
perplexity.py  burstiness.py     tropes.py       features.py
    │               │                │                │
    └───────────────┴────────┬───────┴────────────────┘
                             ▼
                         scoring.py ──► [Maps scores to flag levels]
                             │
                             ▼
                         evidence.py ──► [Generates explanatory text]
                             │
                             ▼
                         AnalysisResult Output
```

### 3.4 Backend Testing & Tooling

- **`tests/test_pipeline.py`**: Formal automated test suite verifying pipeline integrity.
- **`test_pipeline.py`**: Local root execution script for quick manual debugging of sentence boundary detection and scoring outputs.
- **`request.json` / `response.json`**: Reference mock files representing sample API payloads.

---

## 4. Frontend Architecture (`frontend/`)

The client is a Next.js 14 application built with React 18, TypeScript, and Tailwind CSS.

### 4.1 App Router & Pages (`app/`)

Using Next.js App Router conventions:

- **`app/page.tsx`**: Main application view managing state transitions (`input` ➔ `loading` ➔ `results`).
- **`app/dataset/page.tsx`**: Displays dataset benchmarks and corpus information.
- **`app/evaluation/page.tsx`**: Displays detector evaluation performance metrics.
- **`app/limitations/page.tsx`**: Documents system limitations and ethical usage guidelines.
- **`app/methodology/page.tsx`**: Explains the statistical diagnostic methodology.

### 4.2 UI Component Library (`components/`)

- **`Navbar.tsx` & `Footer.tsx`**: Persistent global layout navigation and resource links.
- **`EssayInputView.tsx`**: Text entry area with word counters and submission handlers.
- **`LoadingStateView.tsx`**: Animated progress view displayed during backend API processing.
- **`AnalysisResultsView.tsx`**: Primary diagnostic dashboard presenting sentence scores, flag levels, and signal cards.
- **View Wrappers**: `DatasetView`, `EvaluationView`, `LimitationsView`, `MethodologyView`.

### 4.3 Service Layer & Logic (`lib/`)

- **`analysisService.ts`**: Encapsulates `fetch` calls sending requests to `POST http://127.0.0.1:8000/api/analyze`.
- **`types.ts`**: TypeScript definitions matching backend Pydantic models.
- **`mockData.ts`**: Fallback dataset used for UI development and offline demonstration.
- **`samples.ts`**: Pre-configured sample essay inputs for instant user testing.
- **`scoring.ts`**: Frontend UI helper functions for color coding and severity badges.
- **`analyzer.ts`**: Client-side helper functions separated from API networking.

---

## 5. End-to-End Data Flow

```text
┌─────────────────────────────┐
│          User               │
│     Submits Essay           │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       EssayInputView        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│         page.tsx            │
│  State: Input ➔ Loading     │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│     analysisService.ts      │
└──────────────┬──────────────┘
               │
               │ POST /api/analyze (JSON)
               ▼
┌─────────────────────────────┐
│     FastAPI routes.py       │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       pipeline.py           │
└──────────────┬──────────────┘
               │
       ┌───────┼────────┐
       │       │        │
       ▼       ▼        ▼
    text.py  features  scoring
       │       │        │
       └───────┼────────┘
               │
       ┌───────┼──────────────┐
       ▼       ▼       ▼      ▼
 perplexity burstiness tropes evidence
       │       │       │      │
       └───────┴───────┴──────┘
               │
               ▼
        AnalysisResult
               │
               ▼
        JSON Response
               │
               ▼
       AnalysisResultsView
               │
               ▼
    Rendered Diagnostics UI
```

---

## 6. Separation of Responsibilities

To maintain modularity and maintainability:

| Responsibility Domain | Backend (`backend/`) | Frontend (`frontend/`) |
| :--- | :---: | :---: |
| Text Normalization & Slicing | ✅ | ❌ |
| Tokenization & LM Inferences | ✅ | ❌ |
| Statistical Scoring & Thresholds | ✅ | ❌ |
| Diagnostic Evidence Generation | ✅ | ❌ |
| Input Text Interface | ❌ | ✅ |
| State Management (`input`/`loading`/`results`) | ❌ | ✅ |
| API Communication (`analysisService.ts`) | ❌ | ✅ |
| Interactive Results Visualizations | ❌ | ✅ |

---

## 7. Technology Stack & Runtime Configuration

### Backend Runtime
- **Language:** Python 3.11
- **API Framework:** FastAPI (`0.116.1`), Uvicorn (`0.35.0`)
- **Validation:** Pydantic (`2.11.7`)
- **ML / NLP Libraries:** PyTorch (`2.8.0`), Hugging Face Transformers (`4.55.4`), Tokenizers (`0.21.4`)

### Frontend Runtime
- **Framework:** Next.js `14.x` (App Router)
- **UI Library:** React `18.x`
- **Language:** TypeScript `5.x`
- **Styling:** Tailwind CSS `3.x`
- **Icons:** Lucide React

---

## 8. Local Development & Startup Commands

### Backend Service
```bash
cd backend
source .venv/bin/activate
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
- **API Base:** `http://127.0.0.1:8000`
- **Swagger Docs:** `http://127.0.0.1:8000/docs`

### Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- **Web App:** `http://localhost:3000`

---

## 9. Version Control & Documentation Index

### Git Exclusion Rules (`.gitignore`)
The repository explicitly ignores local virtual environments (`.venv/`), Node dependencies (`node_modules/`), build outputs (`.next/`), PyTorch caches (`__pycache__/`), OS metadata (`.DS_Store`), and generated result payloads (`response.json`).

### Documentation Index
- [`README.md`](README.md): High-level system overview and architectural summary.
- [`INSTALLATION.md`](INSTALLATION.md): Complete setup guide for macOS and Windows.
- [`START_VERITASAI.md`](START_VERITASAI.md): Quick start guide for local development.
- [`FILE_STRUCTURE.md`](FILE_STRUCTURE.md): This directory structure and architectural reference.
