'use client';

import React, { useState } from 'react';
import { Send, FileText, AlertCircle, Trash2, Sparkles } from 'lucide-react';

export interface EssayInputViewProps {
  onAnalyze?: (text: string) => void;
  onSubmit?: (text: string) => void;
  error?: string | null;
}

const SAMPLE_ESSAY = `Technology has fundamentally transformed how human beings communicate, learn, and operate in modern society. While digital connectivity offers unprecedented access to information and fosters global collaboration, it also introduces significant challenges regarding attention spans, privacy, and authentic human interaction. As we move further into the digital age, striking a balance between leveraging technological advancements and maintaining core human values becomes increasingly critical.`;

export const EssayInputView: React.FC<EssayInputViewProps> = ({
  onAnalyze,
  onSubmit,
  error,
}) => {
  const [essayText, setEssayText] = useState('');

  const wordCount = essayText.trim() ? essayText.trim().split(/\s+/).length : 0;
  const charCount = essayText.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essayText.trim()) return;

    if (onAnalyze) {
      onAnalyze(essayText);
    } else if (onSubmit) {
      onSubmit(essayText);
    }
  };

  const handleLoadSample = () => {
    setEssayText(SAMPLE_ESSAY);
  };

  const handleClear = () => {
    setEssayText('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          VeritasAI Essay Analyzer
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto">
          Paste your essay below to generate instant evaluations on coherence, argument strength, grammar, and vocabulary complexity.
        </p>
      </div>

      {/* Error Alert Box */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-start space-x-3 text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Analysis Error:</span> {error}
          </div>
        </div>
      )}

      {/* Main Input Card */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md space-y-4">

        {/* Toolbar */}
        <div className="flex flex-wrap justify-between items-center gap-3 pb-3 border-b border-slate-800 text-xs">
          <div className="flex items-center space-x-2 text-slate-400">
            <FileText className="w-4 h-4 text-indigo-400" />
            <span>Paste or type your essay text</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handleLoadSample}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium transition-colors flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Load Sample</span>
            </button>

            {essayText && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-red-500/20 text-slate-400 hover:text-red-400 font-medium transition-colors flex items-center space-x-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={essayText}
          onChange={(e) => setEssayText(e.target.value)}
          placeholder="Paste your essay here... (Minimum 50 words recommended for accurate scoring)"
          rows={12}
          className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm leading-relaxed resize-y transition-all"
        />

        {/* Footer / Stats & Action */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          {/* Stats Counters */}
          <div className="flex space-x-4 text-xs text-slate-400 font-mono">
            <div>
              Words: <span className="text-slate-200 font-semibold">{wordCount}</span>
            </div>
            <div>
              Characters: <span className="text-slate-200 font-semibold">{charCount}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!essayText.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/25 active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-indigo-600 disabled:hover:to-purple-600"
          >
            <span>Analyze Essay</span>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default EssayInputView;
