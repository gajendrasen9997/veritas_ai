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
