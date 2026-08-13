import { AnalysisResult } from './types';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8000';

interface ApiErrorResponse {
  detail?: string;
}

export async function analyzeEssay(rawText: string): Promise<AnalysisResult> {
  const essay = rawText.trim();

  if (!essay) {
    throw new Error('Essay content cannot be empty.');
  }

  const response = await fetch(`${apiBaseUrl}/api/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      essay,
      model_id: 'custom',
    }),
  });

  if (!response.ok) {
    const error: ApiErrorResponse = await response.json().catch(() => ({}));
    throw new Error(error.detail ?? 'Unable to analyze the essay.');
  }

  return response.json() as Promise<AnalysisResult>;
}
