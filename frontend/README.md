- Framer Motion for interface animations
- Lucide React icons

## Prerequisites

- Node.js 18 or later
- npm
- A running VeritasAI backend (default: `http://127.0.0.1:8000`)

## Installation

From this `frontend` directory:

```bash
npm install
```

On Windows PowerShell, if script execution blocks `npm`, use:

```powershell
npm.cmd install
```

## Run Locally

Start the frontend development server:

```bash
npm run dev
```

For Windows PowerShell:

```powershell
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Open <http://127.0.0.1:3000>.

## Backend Connection

The frontend calls:

```text
POST {NEXT_PUBLIC_API_BASE_URL}/api/analyze
```

When `NEXT_PUBLIC_API_BASE_URL` is not set, the application uses:

```text
http://127.0.0.1:8000
```

The backend must allow the frontend origin through CORS. The included FastAPI backend permits both `http://localhost:3000` and `http://127.0.0.1:3000`.

To use a different backend URL, create `.env.local` in this directory:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

Restart the Next.js server after changing environment variables.

## Application Views

### Analyzer

The main view accepts essay text and sends it to the backend. Results display:

- Document ID, title, word count, and reading metadata.
- Review priority and signal distribution.
- Highlighted sentences based on `none`, `yellow`, `orange`, and `red` signal levels.
- Per-sentence diagnostic evidence and explanatory text.

### Methodology, Dataset, Evaluation, and Limitations

These pages explain the product's methodology, intended use, examples, and limitations. Their visual metrics and corpus descriptions are illustrative static content, not live backend data.

## Theme and Accessibility

The theme toggle is shared by the login and dashboard views. The selected `light` or `dark` preference is stored in browser local storage under `veritas-theme`. Shared color tokens adapt to both themes to preserve text contrast, and visible keyboard focus styles are provided.

## Development Commands

```bash
npm run dev
npm run build
npm run start
```

To type-check the frontend:

```bash
npx tsc --noEmit
```

On Windows PowerShell, use `npm.cmd` and `npx.cmd` if the corresponding PowerShell scripts are blocked.

## Architecture

The frontend contains:

```text
app/                    Next.js routes and global styles
components/             Login, navigation, input, results, and information views
lib/analysisService.ts  API client for essay analysis
lib/types.ts            Frontend types for the backend response
```

The complete frontend/backend pipeline is documented in [../architecture.md](../architecture.md).

## Ethical Use

VeritasAI provides statistical diagnostics, not proof of AI authorship. Human writing—including academic, highly polished, technical, or non-native English writing—can exhibit similar statistical patterns. Use all flags as prompts for contextual human review, never as an automatic basis for rejection, punishment, or accusation.
