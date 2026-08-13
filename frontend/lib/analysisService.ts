/**
 * VeritasAI Analysis Service Abstraction
 *
 * DESIGN PRINCIPLE (REQUIREMENT #6):
 * This module isolates detection analysis logic from UI presentation.
 * In a production setup, these functions will call a backend FastAPI / PyTorch microservice
 * that computes token perplexity, n-gram probability matrices, and transformer token distributions.
 *
 * Currently, it provides a deterministic heuristic analysis pipeline for frontend integration and demonstration.
 */

import { AnalysisResult, SentenceAnalysis, FlagLevel, PassageSignal } from './types';
import { DEMO_RESULT_STITCH } from './mockData';

// High-frequency formulaic transition phrases characteristic of synthetic LLM writing
const LLM_TROPES = [
  'furthermore, it is imperative',
  'paradigm shift',
  'tapestry of',
  'testament to',
  'delve into',
  'it is important to consider',
  'multifaceted dimensions',
  'traditional pedagogical frameworks',
  'in conclusion, it can be seen',
  'plays a pivotal role',
  'beacon of hope',
  'in order to foster',
  'rich environment for exploration',
  'co-creators of',
  'thematic coherence'
];

/**
 * Simulates the backend essay analysis pipeline.
 * @param rawText The essay content entered by the user.
 * @returns Promise resolving to the complete AnalysisResult object.
 */
export async function analyzeEssay(rawText: string): Promise<AnalysisResult> {
  const trimmed = rawText.trim();
  if (!trimmed) {
    throw new Error('Essay content cannot be empty.');
  }

  // If user pasted exact or similar demo essay text, return deterministic Stitch result
  if (trimmed.includes('The evolution of modern storytelling') || trimmed.includes('The Intersection of Narrative')) {
    return {
      ...DEMO_RESULT_STITCH,
      rawText: trimmed,
    };
  }

  // Otherwise, run our deterministic client-side heuristic engine
  const sentencesRaw = splitIntoSentences(trimmed);
  const words = trimmed.split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const sentenceCount = sentencesRaw.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  let lowCount = 0;
  let mediumCount = 0;
  let highCount = 0;
  let normalCount = 0;

  // Calculate average sentence length for burstiness variance
  const sentenceLengths = sentencesRaw.map(s => s.split(/\s+/).length);
  const avgLen = sentenceLengths.reduce((a, b) => a + b, 0) / Math.max(1, sentenceCount);

const analyzedSentences: SentenceAnalysis[] = sentencesRaw.map((text, idx) => {
    const lower = text.toLowerCase();
    const len = text.split(/\s+/).length;
    let score = 0.1; // baseline
    const signals: PassageSignal[] = [];

    // 1. Trope Check
    const matchedTropes = LLM_TROPES.filter(t => lower.includes(t));
    if (matchedTropes.length > 0) {
      score += 0.45 * matchedTropes.length;
      signals.push({
        id: `sig-${idx}-trope`,
        category: 'tropes',
        title: 'Transitional Tropes',
        metricValue: 'Detected Formulaic Phrasing',
        flagLevel: matchedTropes.length > 1 ? 'red' : 'orange',
        description: `Contains high-frequency synthetic writing pattern: "${matchedTropes.join('", "')}".`,
      });
    }

    // 2. Burstiness Check (variance from average length)
    const lenDiff = Math.abs(len - avgLen);
    if (len > 22 && lenDiff < 3) {
      score += 0.25;
      signals.push({
        id: `sig-${idx}-burst`,
        category: 'burstiness',
        title: 'Sentence Rhythm (Burstiness)',
        metricValue: 'Static Length Variance',
        flagLevel: 'orange',
        description: `Sentence length (${len} words) matches surrounding sentence length closely, reducing natural structural burstiness.`,
      });
    } else if (lenDiff > 10) {
      score -= 0.15; // Natural spiky rhythm
    }

    // 3. Perplexity / Predictability Check
    const rareWords = text.match(/\b[A-Za-z]{9,}\b/g) || [];
    if (rareWords.length > 3 && len > 15) {
      score += 0.2;
      signals.push({
        id: `sig-${idx}-perp`,
        category: 'smoothness',
        title: 'Vocabulary Complexity (Perplexity)',
        metricValue: 'Unusually Uniform / Low',
        flagLevel: 'yellow',
        description: 'Sequence of multisyllabic academic terms is highly predictable within reference language models.',
      });
    }

    // Normalize score 0 to 1
    score = Math.min(0.98, Math.max(0.05, score));

    // Determine flag level
    let flagLevel: FlagLevel = 'none';
    if (score >= 0.75) {
      flagLevel = 'red';
      highCount++;
    } else if (score >= 0.55) {
      flagLevel = 'orange';
      mediumCount++;
    } else if (score >= 0.35) {
      flagLevel = 'yellow';
      lowCount++;
    } else {
      normalCount++;
    }

    // Default signal if empty
    if (signals.length === 0) {
      signals.push({
        id: `sig-${idx}-normal`,
        category: 'smoothness',
        title: 'Vocabulary Complexity (Perplexity)',
        metricValue: 'Natural / Human Variance',
        flagLevel: 'none',
        description: 'Word transitions display natural stylistic variance consistent with authentic human writing.',
      });
    }

    return {
      id: `s${idx}`,
      index: idx,
      paragraphIndex: 0,
      text,
      flagLevel,
      signalScore: score,
      signals,
      summaryExplanation: flagLevel === 'red'
        ? 'Strong signal detected. Unusually uniform sentence cadence combined with formulaic transitions.'
        : flagLevel === 'orange'
        ? 'Moderate signal. Structural predictability elevated compared to baseline human distribution.'
        : flagLevel === 'yellow'
        ? 'Minor signal noted. Phrase construction displays low vocabulary perplexity.'
        : 'No significant diagnostic signals detected. Natural sentence rhythm.',
    };
  });

  const total = Math.max(1, sentenceCount);
  const lowPct = Math.round((lowCount / total) * 100);
  const mediumPct = Math.round((mediumCount / total) * 100);
  const highPct = Math.round((highCount / total) * 100);
  const normalPct = Math.max(0, 100 - (lowPct + mediumPct + highPct));

  let reviewPriority: 'LOW' | 'MODERATE' | 'HIGH_ATTENTION' = 'LOW';
  if (highPct > 25 || (highPct + mediumPct) > 50) {
    reviewPriority = 'HIGH_ATTENTION';
  } else if (mediumPct > 20 || lowPct > 40) {
    reviewPriority = 'MODERATE';
  }

  return {
    id: `ADM-${Date.now().toString().slice(-6)}`,
    title: extractTitle(trimmed),
    processedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    rawText: trimmed,
    wordCount,
    sentenceCount,
    readingTimeMinutes,
    analysisComplexity: wordCount > 500 ? 'High' : wordCount > 250 ? 'Standard' : 'Low',
    reviewPriority,
    distribution: {
      lowPct,
      mediumPct,
      highPct,
      normalPct,
    },
    summaryMessage: reviewPriority === 'HIGH_ATTENTION'
      ? 'Significant structural uniformity and transitional tropes detected across multiple passages.'
      : reviewPriority === 'MODERATE'
      ? 'Localized pattern signals detected in specific sentences.'
      : 'Overall document displays high natural burstiness and perplexity variation.',
    sentences: analyzedSentences,
  };
}

/**
 * Retrieves a single sentence's evidence details from an AnalysisResult.
 */
export function getPassageEvidence(result: AnalysisResult, sentenceId: string): SentenceAnalysis | null {
  return result.sentences.find(s => s.id === sentenceId) || null;
}

// Helper: Split text into clean sentences
function splitIntoSentences(text: string): string[] {
  const regex = /[^.!?]+[.!?]+["']?|[^.!?]+$/g;
  const matches = text.match(regex);
  if (!matches) return [text];
  return matches.map(s => s.trim()).filter(s => s.length > 0);
}

// Helper: Extract a title from the first sentence or heading
function extractTitle(text: string): string {
  const firstLine = text.split('\n')[0].trim();
  if (firstLine.length > 5 && firstLine.length < 70) {
    return firstLine.replace(/^[#\s]+/, '');
  }
  const firstSentence = text.split(/[.!?]/)[0].trim();
  if (firstSentence.length > 50) {
    return firstSentence.substring(0, 47) + '...';
  }
  return firstSentence || 'Untitled Essay Analysis';
}
