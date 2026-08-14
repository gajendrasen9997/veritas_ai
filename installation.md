# VeritasAI Installation Guide

This guide covers installing and running the Python backend dependencies from `requirements.txt` on **macOS** and **Windows**. It assumes you are running commands inside the `type2/backend` directory.

> **Prerequisite:** Python 3.11 is strongly recommended.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Navigate to the Backend Directory](#2-navigate-to-the-backend-directory)
3. [Create a Virtual Environment](#3-create-a-virtual-environment)
4. [Verify the Virtual Environment](#4-verify-the-virtual-environment)
5. [Upgrade pip](#5-upgrade-pip)
6. [Install Requirements](#6-install-requirements)
7. [Verify PyTorch & Transformers](#7-verify-pytorch--transformers)
8. [Verify Backend Compilation](#8-verify-backend-compilation)
9. [Start the FastAPI Server](#9-start-the-fastapi-server)
10. [Test the Health Endpoint](#10-test-the-health-endpoint)
11. [Test the Analysis API](#11-test-the-analysis-api)
12. [Resolve Python Alias Issues (macOS)](#12-resolve-python-alias-issues-macos)
13. [Do Not Confuse `.venv` and `venv`](#13-do-not-confuse-venv-and-venv)
14. [Port 8000 Already in Use](#14-port-8000-already-in-use)
15. [Recreate the Virtual Environment](#15-recreate-the-virtual-environment)
16. [Normal Startup Reference](#16-normal-startup-reference)
17. [Quick Installation Checklist](#17-quick-installation-checklist)
18. [Troubleshoot `ModuleNotFoundError: torch`](#18-troubleshoot-modulenotfounderror-torch)

---

## 1. Prerequisites

- **Python 3.11** (recommended)
- `pip`
- **Git** (only if cloning the project)
- A terminal

Check your Python version:

### macOS
```bash
python3 --version
```

### Windows
```cmd
python --version
```

> **Note:** If `python3.11` is not available, fall back to `python3` (macOS) or `py -3.11` (Windows).

---

## 2. Navigate to the Backend Directory

### macOS
```bash
cd "/path/to/project/type2/backend"
# Example:
# cd "/Users/yourname/Desktop/callus_hackathon/type2/backend"
```

### Windows
```cmd
cd "C:\path\to\project\type2\backend"
# Example:
# cd "C:\Users\YourName\Desktop\callus_hackathon\type2\backend"
```

Confirm `requirements.txt` exists:

### macOS
```bash
ls
```

### Windows
```cmd
dir
```

You should see:
```
requirements.txt
app/
```

---

## 3. Create a Virtual Environment

The project uses `.venv` (not `venv`).

### macOS
```bash
python3.11 -m venv .venv
# Fallback if python3.11 is unavailable:
# python3 -m venv .venv

source .venv/bin/activate
```

### Windows (PowerShell)
```powershell
py -3.11 -m venv .venv
# If script execution is blocked:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

.\.venv\Scripts\Activate.ps1
```

### Windows (Command Prompt)
```cmd
py -3.11 -m venv .venv
.venv\Scripts\activate.bat
```

---

## 4. Verify the Virtual Environment

**Do this before installing packages.**

### macOS
```bash
which python
python -c "import sys; print(sys.executable)"
```

Expected result contains:
```
.../backend/.venv/bin/python
```

### Windows (PowerShell)
```powershell
where.exe python
python -c "import sys; print(sys.executable)"
```

Expected result contains:
```
backend\.venv\Scripts\python.exe
```

> ⚠️ **Warning:** If the path points to a system installation instead of `.venv`, deactivate and reactivate the environment.

---

## 5. Upgrade pip

Always use `python -m pip` to ensure the command targets the active environment.

```bash
python -m pip install --upgrade pip
```

---

## 6. Install Requirements

With `.venv` activated:

```bash
python -m pip install -r requirements.txt
```

The current backend requirements include:
- `fastapi==0.116.1`
- `uvicorn==0.35.0`
- `pydantic==2.11.7`
- `torch==2.8.0`
- `transformers==4.55.4`
- `tokenizers==0.21.4`

> **Do not** manually change package versions unless you are intentionally updating project requirements.

---

## 7. Verify PyTorch & Transformers

### PyTorch
```bash
python -c "import torch; print('Torch:', torch.__version__)"
```

Expected output:
```
Torch: 2.8.0
```

### Transformers
```bash
python -c "import transformers; print('Transformers:', transformers.__version__)"
```

Expected output:
```
Transformers: 4.55.4
```

### Combined check
```bash
python -c "import torch, transformers; print('Torch:', torch.__version__); print('Transformers:', transformers.__version__)"
```

---

## 8. Verify Backend Compilation

From the `backend` directory:

```bash
python -m py_compile app/analysis/pipeline.py
```

- **No output** = compilation succeeded.

Then run:
```bash
python test_pipeline.py
```

This should **not** produce:
```
ModuleNotFoundError: No module named 'torch'
```

---

## 9. Start the FastAPI Server

Keep this terminal open.

```bash
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

Expected startup logs:
```
INFO:     Started server process [...]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000
```

---

## 10. Test the Health Endpoint

Open a **new terminal** and activate `.venv` again if necessary.

### macOS
```bash
source .venv/bin/activate
```

### Windows (PowerShell)
```powershell
.\.venv\Scripts\Activate.ps1
```

Run:
```bash
curl http://127.0.0.1:8000/health
```

Expected response:
```json
{"status":"ok","service":"veritasai"}
```

---

## 11. Test the Analysis API

Create `request.json` in the `backend` directory:

```json
{
  "essay": "I have always been fascinated by technology. When I was younger, I built small projects with whatever materials I could find. One experiment failed repeatedly, but the failure taught me to approach problems differently. Eventually, I learned that understanding why something breaks can be more valuable than simply making it work.",
  "model_id": "custom"
}
```

### macOS
```bash
curl -s -X POST http://127.0.0.1:8000/api/analyze \
-H "Content-Type: application/json" \
--data-binary @request.json
```

### Windows (PowerShell)
```powershell
Invoke-RestMethod `
  -Uri "http://127.0.0.1:8000/api/analyze" `
  -Method Post `
  -ContentType "application/json" `
  -InFile "request.json"
```

The response should contain:
- `id`
- `title`
- `processedAt`
- `rawText`
- `wordCount`
- `sentenceCount`
- `reviewPriority`
- `distribution`
- `sentences`
- `summaryMessage`

---

## 12. Resolve Python Alias Issues (macOS)

Sometimes `.venv` is activated but `python` remains aliased to the system interpreter.

Check:
```bash
which python
python -c "import sys; print(sys.executable)"
```

Both should point to `.venv`.

If an alias is overriding the environment:
```bash
unalias python
hash -r
```

Verify again:
```bash
which python
python -c "import sys; print(sys.executable)"
```

If necessary, bypass aliases entirely:
```bash
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

On Windows, use the full executable path:
```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

---

## 13. Do Not Confuse `.venv` and `venv`

The project uses `.venv/`, **not** `venv/`.

Incorrect (if `.venv` does not exist):
```bash
source venv/bin/activate
```

Correct:
```bash
# macOS
source .venv/bin/activate

# Windows PowerShell
.\.venv\Scripts\Activate.ps1
```

---

## 14. Port 8000 Already in Use

If Uvicorn reports:
```
ERROR: [Errno 48] ... address already in use
```

### macOS
Find the process:
```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
```
Example output:
```
python3    12345    ... TCP 127.0.0.1:8000
```

Kill by the **actual numeric PID**:
```bash
kill -9 12345
```

Verify:
```bash
lsof -nP -iTCP:8000 -sTCP:LISTEN
```

> ⚠️ **Warning:** Do not use placeholder values like `kill -9 PID1 PID2`. Always use the real numeric process ID from `lsof`.

### Windows
Find the process:
```cmd
netstat -ano | findstr :8000
```

Terminate by PID:
```cmd
taskkill /PID 12345 /F
```

---

## 15. Recreate the Virtual Environment

If `.venv` becomes corrupted:

### macOS
```bash
deactivate
rm -rf .venv
python3.11 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

### Windows (PowerShell)
```powershell
deactivate
Remove-Item -Recurse -Force .venv
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
```

---

## 16. Normal Startup Reference

### macOS
```bash
cd "/path/to/project/type2/backend"
source .venv/bin/activate
python -c "import sys; print(sys.executable)"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Windows (PowerShell)
```powershell
cd "C:\path\to\project\type2\backend"
.\.venv\Scripts\Activate.ps1
python -c "import sys; print(sys.executable)"
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

> **Critical:** The Python executable must point to the project's `.venv`, not the system Python.

---

## 17. Quick Installation Checklist

- [ ] Python 3.11 installed
- [ ] Project downloaded / cloned
- [ ] Terminal opened in `backend/`
- [ ] `.venv` created
- [ ] `.venv` activated
- [ ] `python` points to `.venv`
- [ ] `pip` upgraded
- [ ] `requirements.txt` installed
- [ ] PyTorch imports successfully
- [ ] Transformers imports successfully
- [ ] `pipeline.py` compiles
- [ ] `test_pipeline.py` passes
- [ ] FastAPI server starts
- [ ] `/health` returns `{"status":"ok","service":"veritasai"}`
- [ ] `/api/analyze` returns an analysis
- [ ] (Optional) Frontend communicates with port `8000`

---

## 18. Troubleshoot `ModuleNotFoundError: torch`

If you see:
```
ModuleNotFoundError: No module named 'torch'
```

**Do not immediately reinstall PyTorch.** First verify the active environment.

```bash
which python
python -c "import sys; print(sys.executable)"
```

Then:
```bash
python -m pip show torch
```

Requirements:
- The Python executable and `pip` must belong to the **same `.venv`**.
- On macOS, PyTorch should be installed under:
  ```
  .../backend/.venv/lib/python3.11/site-packages/
  ```

This prevents the common issue where PyTorch is installed correctly, but the shell runs a different system Python.
```

---

### How to Apply This in Your Repo
1. Open `installation.md` in your editor (VS Code / GitHub web editor).
2. Delete the old raw content.
3. Paste the markdown above.
4. Commit and push. The GitHub preview will render the professional formatting automatically.
