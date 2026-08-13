"use client";

import React, { useEffect, useState, useRef } from "react";

interface LoadingStateViewProps {
  onComplete: () => void;
}

const STEPS = [
  { label: "Processing essay & sanitizing input text...", detail: "Parsing character arrays and stripping markup" },
  { label: "Splitting sentences & mapping tokens...", detail: "Evaluating syntactic boundaries and N-gram sequences" },
  { label: "Extracting writing patterns (Perplexity & Burstiness)...", detail: "Calculating structural variance and vocabulary complexity" },
  { label: "Comparing statistical signals against reference distributions...", detail: "Benchmarking against 1.2M admissions essay baseline" },
  { label: "Preparing passage-level diagnostic evidence...", detail: "Synthesizing localized signal flags and trope indicators" },
  { label: "Diagnostic analysis complete", detail: "Rendering interactive document view" },
];

export function LoadingStateView({ onComplete }: LoadingStateViewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          if (!cancelled) {
            setTimeout(() => {
              if (!cancelled) {
                onCompleteRef.current();
              }
            }, 500);
          }
          return prev;
        }
      });
    }, 400);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const progressPct = Math.round(((currentStep + 1) / STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
        {/* Spinner icon */}
        <div className="w-16 h-16 relative flex items-center justify-center mb-6">
          <div className="absolute inset-0 rounded-full border-4 border-surface-container-high border-t-primary animate-spin"></div>
          <span className="material-symbols-outlined text-primary text-2xl">science</span>
        </div>

        <h3 className="font-headline-lg text-headline-lg-mobile text-primary mb-2">
          Running Diagnostic Pipeline
        </h3>
        <p className="font-ui-body text-on-surface-variant text-sm mb-6">
          Evaluating structural rhythm, perplexity, and stylistic signals...
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-surface-container-low h-2.5 rounded-full overflow-hidden mb-4 border border-outline-variant">
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPct}%`, backgroundColor: '#1a2b4b' }}
          />
        </div>

        <div className="flex justify-between w-full font-data-mono text-xs text-on-surface-variant mb-6">
          <span>Step {currentStep + 1} of {STEPS.length}</span>
          <span>{progressPct}%</span>
        </div>

        {/* Steps List */}
        <div className="w-full text-left space-y-2.5 bg-surface-container-low p-4 rounded border border-outline-variant/60">
          {STEPS.map((s, idx) => {
            const isDone = idx < currentStep;
            const isCurrent = idx === currentStep;
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 text-xs transition-opacity duration-200 ${
                  isCurrent
                    ? "text-primary font-bold opacity-100"
                    : isDone
                    ? "text-on-surface-variant opacity-70"
                    : "text-outline opacity-40"
                }`}
              >
                <span className="material-symbols-outlined text-[16px] shrink-0">
                  {isDone ? "check_circle" : isCurrent ? "hourglass_top" : "radio_button_unchecked"}
                </span>
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
