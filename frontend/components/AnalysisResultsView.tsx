"use client";

import React, { useState } from "react";
import { AnalysisResult, SentenceAnalysis, FlagLevel } from "@/lib/types";

interface AnalysisResultsViewProps {
  result: AnalysisResult;
  onReset: () => void;
}

export function AnalysisResultsView({ result, onReset }: AnalysisResultsViewProps) {
  // Default selected sentence is the red or highest flag sentence, or sentence 3
  const defaultSelected =
    result.sentences.find((s) => s.flagLevel === "red")?.id ||
    result.sentences.find((s) => s.flagLevel === "orange")?.id ||
    result.sentences[0]?.id ||
    "s0";

  const [selectedSentenceId, setSelectedSentenceId] = useState<string>(defaultSelected);
  const [activeTab, setActiveTab] = useState<"overview" | "evidence" | "metrics" | "ethics">("evidence");

  const selectedSentence: SentenceAnalysis | undefined =
    result.sentences.find((s) => s.id === selectedSentenceId) || result.sentences[0];

  const getSignalBadge = (level: FlagLevel) => {
    switch (level) {
      case "red":
        return {
          label: "Strong Signal",
          bg: "bg-error-container text-on-error-container border border-error/30",
        };
      case "orange":
        return {
          label: "Moderate Signal",
          bg: "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/30",
        };
      case "yellow":
        return {
          label: "Minor Signal",
          bg: "bg-secondary-container text-on-secondary-container border border-secondary/30",
        };
      default:
        return {
          label: "No Signal",
          bg: "bg-surface-container text-on-surface-variant border border-outline-variant",
        };
    }
  };

  const currentBadge = selectedSentence ? getSignalBadge(selectedSentence.flagLevel) : getSignalBadge("none");

  return (
    <div className="flex flex-1 w-full bg-surface min-h-[calc(100vh-64px)]">
      {/* SideNavBar - Diagnostic Navigation */}
      <aside className="hidden lg:flex flex-col bg-surface-container-lowest border-r border-outline-variant w-64 shrink-0 p-0 z-40">
        <div className="p-6 border-b border-outline-variant">
          <h2 className="font-ui-body text-ui-body font-bold text-primary">Analysis Tools</h2>
          <p className="font-label-caps text-label-caps text-on-surface-variant mt-1">Diagnostic Framework</p>
        </div>

        <nav className="flex-1 py-4 flex flex-col font-ui-body text-ui-body">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === "overview"
                ? "text-primary border-l-4 border-primary bg-surface-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Overview
          </button>

          <button
            onClick={() => setActiveTab("evidence")}
            className={`flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === "evidence"
                ? "text-primary border-l-4 border-primary bg-surface-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">policy</span>
            Evidence Panel
          </button>

          <button
            onClick={() => setActiveTab("metrics")}
            className={`flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === "metrics"
                ? "text-primary border-l-4 border-primary bg-surface-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">analytics</span>
            Metrics
          </button>

          <button
            onClick={() => setActiveTab("ethics")}
            className={`flex items-center gap-3 px-6 py-3 text-left transition-all duration-200 ${
              activeTab === "ethics"
                ? "text-primary border-l-4 border-primary bg-surface-container font-bold"
                : "text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">gavel</span>
            Ethics Charter
          </button>
        </nav>

        <div className="p-4 border-t border-outline-variant bg-surface-container-low">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-surface-container-lowest border border-outline-variant rounded font-ui-body text-xs text-primary font-bold hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span>
            Analyze New Essay
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 p-4 md:p-8 bg-surface flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
        {/* Overall Summary Bar (Requirement #8: Not a giant "73% AI" score) */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shrink-0 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h3 className="font-ui-body text-ui-body font-bold text-primary flex items-center gap-2">
                <span className="material-symbols-outlined text-outline text-[20px]">tune</span>
                Overall Signal Distribution
              </h3>
              <p className="font-ui-body text-xs text-on-surface-variant mt-0.5">
                Passage-level structural signals across {result.sentenceCount} analyzed sentences.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="font-label-caps text-xs text-on-surface-variant">Review Priority:</span>
              <span
                className={`px-3 py-1 font-data-mono text-xs font-bold rounded ${
                  result.reviewPriority === "HIGH_ATTENTION"
                    ? "bg-error-container text-on-error-container border border-error/30"
                    : result.reviewPriority === "MODERATE"
                    ? "bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/30"
                    : "bg-surface-container text-primary border border-outline-variant"
                }`}
              >
                {result.reviewPriority.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Distribution Bar */}
          <div className="w-full h-4 rounded-full flex overflow-hidden border border-outline-variant/60 bg-surface-container-low">
            <div
              className="h-full bg-secondary-fixed-dim transition-all duration-500"
              style={{ width: `${result.distribution.lowPct}%` }}
              title={`Low Signal (${result.distribution.lowPct}%)`}
            />
            <div
              className="h-full bg-tertiary-fixed-dim transition-all duration-500"
              style={{ width: `${result.distribution.mediumPct}%` }}
              title={`Medium Signal (${result.distribution.mediumPct}%)`}
            />
            <div
              className="h-full bg-error transition-all duration-500"
              style={{ width: `${result.distribution.highPct}%` }}
              title={`High Signal (${result.distribution.highPct}%)`}
            />
            <div
              className="h-full bg-surface-container-high transition-all duration-500"
              style={{ width: `${result.distribution.normalPct}%` }}
              title={`Unflagged (${result.distribution.normalPct}%)`}
            />
          </div>

          <div className="flex flex-wrap justify-between mt-2 font-label-caps text-xs text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed-dim inline-block"></span>
              {result.distribution.lowPct}% Low Signal (Yellow)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim inline-block"></span>
              {result.distribution.mediumPct}% Medium Signal (Orange)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-error inline-block"></span>
              {result.distribution.highPct}% High Signal (Red)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-container-high inline-block"></span>
              {result.distribution.normalPct}% Natural / Unflagged
            </span>
          </div>

          {/* Mandatory Disclaimer Callout */}
          <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center gap-2 text-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-primary text-[16px] shrink-0">shield</span>
            <span>
              <strong>Note:</strong> Statistical signals are diagnostic indicators, not a definitive probability or proof of AI authorship. Human writing can exhibit similar low perplexity patterns.
            </span>
          </div>
        </div>

        {/* Split Analytical View (7 cols Document View, 5 cols Diagnostic Evidence Panel) */}
        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-[600px]">
          {/* Left Column: Document View (7 cols) */}
          <div className="lg:w-[58%] bg-surface-container-lowest border border-outline-variant rounded-lg p-6 md:p-8 shadow-sm flex flex-col overflow-y-auto max-h-[750px]">
            <div className="max-w-reading-column mx-auto w-full">
              <div className="flex justify-between items-start mb-2">
                <h1 className="font-display-lg text-display-lg text-primary">{result.title}</h1>
                <button
                  onClick={onReset}
                  className="md:hidden text-xs font-label-caps bg-surface-container px-2.5 py-1 rounded text-primary border border-outline-variant"
                >
                  Edit Essay
                </button>
              </div>

              <p className="font-ui-body text-xs text-on-surface-variant mb-6 pb-4 border-b border-outline-variant font-data-mono">
                Document ID: {result.id} • Processed: {result.processedAt} • {result.wordCount} words
              </p>

              <div className="font-ui-body text-xs text-on-surface-variant mb-4 bg-surface-container-low p-3 rounded flex items-center justify-between">
                <span>Click any highlighted sentence to inspect specific evidence signals:</span>
                <span className="font-label-caps text-[10px] text-primary uppercase font-bold">Interactive View</span>
              </div>

              {/* Essay Passage Reading Body */}
              <div className="font-reading-body text-reading-body text-on-surface space-y-6 leading-relaxed">
                {result.sentences.map((sentence) => {
                  const isSelected = sentence.id === selectedSentenceId;

                  let signalClass = "signal-none";
                  if (sentence.flagLevel === "red") signalClass = "signal-red";
                  else if (sentence.flagLevel === "orange") signalClass = "signal-orange";
                  else if (sentence.flagLevel === "yellow") signalClass = "signal-yellow";

                  return (
                    <span
                      key={sentence.id}
                      onClick={() => setSelectedSentenceId(sentence.id)}
                      className={`inline px-1 py-0.5 rounded-sm transition-all cursor-pointer ${signalClass} ${
                        isSelected ? "signal-active" : ""
                      }`}
                      title={`Sentence ID: ${sentence.id} | Signal: ${sentence.flagLevel}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setSelectedSentenceId(sentence.id);
                        }
                      }}
                    >
                      {sentence.text}{" "}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Diagnostic Evidence Panel (5 cols) */}
          <div className="lg:w-[42%] flex flex-col gap-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-lg flex-1 shadow-sm flex flex-col overflow-hidden max-h-[750px]">
              {/* Evidence Header */}
              <div className="p-6 border-b border-outline-variant bg-surface-container-low shrink-0 flex items-center justify-between">
                <h2 className="font-ui-body text-ui-body font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                  Evidence Panel
                </h2>
                <span className={`px-3 py-1 font-label-caps text-xs rounded font-bold ${currentBadge.bg}`}>
                  {currentBadge.label}
                </span>
              </div>

              {/* Evidence Body */}
              <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
                {selectedSentence ? (
                  <>
                    {/* Selected Passage Box */}
                    <div>
                      <h4 className="font-label-caps text-xs text-on-surface-variant mb-2 uppercase tracking-wider">
                        Selected Passage (Sentence ID: {selectedSentence.id})
                      </h4>
                      <div className="bg-surface p-4 rounded border-l-4 border-primary font-reading-body text-sm leading-relaxed text-on-surface italic shadow-inner">
                        "{selectedSentence.text}"
                      </div>
                    </div>

                    {/* Diagnostic Summary */}
                    <div className="bg-surface-container-low p-4 rounded border border-outline-variant/60">
                      <h4 className="font-label-caps text-xs text-primary mb-1 uppercase tracking-wider font-bold">
                        Diagnostic Verdict Summary
                      </h4>
                      <p className="font-ui-body text-xs text-on-surface-variant leading-relaxed">
                        {selectedSentence.summaryExplanation}
                      </p>
                    </div>

                    {/* Diagnostic Signals Breakdown */}
                    <div className="flex-1">
                      <h4 className="font-label-caps text-xs text-on-surface-variant mb-3 uppercase tracking-wider">
                        Statistical Signals & Evidence
                      </h4>
                      <div className="space-y-3">
                        {selectedSentence.signals.map((sig) => (
                          <div
                            key={sig.id}
                            className="p-4 border border-outline-variant rounded bg-surface-bright flex flex-col gap-1.5 shadow-sm"
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-ui-body text-sm font-bold text-primary">{sig.title}</span>
                              <span
                                className={`font-data-mono text-xs font-bold ${
                                  sig.flagLevel === "red"
                                    ? "text-error"
                                    : sig.flagLevel === "orange"
                                    ? "text-tertiary-container"
                                    : sig.flagLevel === "yellow"
                                    ? "text-secondary"
                                    : "text-on-surface-variant"
                                }`}
                              >
                                {sig.metricValue}
                              </span>
                            </div>
                            <p className="font-ui-body text-xs leading-relaxed text-on-surface-variant">
                              {sig.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12 text-on-surface-variant font-ui-body">
                    Select any sentence from the document view on the left to inspect its evidence breakdown.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
