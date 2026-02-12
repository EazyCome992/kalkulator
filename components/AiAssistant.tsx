
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { CalculationResult } from '../types';

interface AiAssistantProps {
  lastResult: string | null;
  history: CalculationResult[];
}

const AiAssistant: React.FC<AiAssistantProps> = ({ lastResult, history }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const askAi = async (prompt?: string) => {
    const textToProcess = prompt || query;
    if (!textToProcess.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Solve this math problem or explain the logic. Keep it concise but educational. Context: ${textToProcess}`,
        config: {
          systemInstruction: "You are a friendly, expert math tutor. Provide step-by-step explanations for mathematical operations or word problems. Use Markdown for formatting.",
          temperature: 0.7,
        }
      });

      setAiResponse(response.text || "I couldn't generate an answer. Please try again.");
    } catch (error) {
      console.error("AI Error:", error);
      setAiResponse("Sorry, I encountered an error. Please check your connection.");
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  const handleExplainLast = () => {
    if (history.length > 0) {
      const last = history[0];
      askAi(`Explain why ${last.expression} equals ${last.result}. Break down the operation.`);
    }
  };

  return (
    <div className="bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700/50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-300 flex items-center gap-2">
          <i className="fas fa-brain text-cyan-400"></i>
          AI Math Assistant
        </h2>
        {history.length > 0 && (
          <button 
            onClick={handleExplainLast}
            className="text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-full transition-colors border border-cyan-500/30"
          >
            Explain Last Calc
          </button>
        )}
      </div>

      {/* AI Chat-like Area */}
      <div className="flex-grow bg-slate-900/40 rounded-xl p-4 mb-4 border border-slate-800 min-h-[160px] max-h-[300px] overflow-y-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-3">
            <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
            <p className="text-slate-500 text-sm animate-pulse">Gemini is thinking...</p>
          </div>
        ) : aiResponse ? (
          <div className="prose prose-invert prose-sm max-w-none text-slate-300">
            <div className="whitespace-pre-wrap leading-relaxed">{aiResponse}</div>
            <button 
               onClick={() => setAiResponse(null)}
               className="mt-4 text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1 transition-colors"
            >
              <i className="fas fa-trash-alt"></i> Clear Response
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full opacity-40 text-center">
            <i className="fas fa-comment-dots text-3xl mb-2 text-slate-600"></i>
            <p className="text-slate-500 text-sm">Ask me to solve a word problem or explain math concepts!</p>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <div className="relative flex-grow">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && askAi()}
            placeholder="e.g. 'What is 15% of 250?'"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-4 pr-10 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          <i className="fas fa-terminal absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 text-xs"></i>
        </div>
        <button 
          onClick={() => askAi()}
          disabled={isLoading || !query.trim()}
          className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:hover:bg-cyan-600 text-white p-3 rounded-xl transition-all shadow-lg shadow-cyan-900/20 active:scale-95"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
    </div>
  );
};

export default AiAssistant;
