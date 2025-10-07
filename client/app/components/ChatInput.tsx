"use client";
import { Send, Sparkles, Loader } from "lucide-react";

interface ChatInputProps {
  question: string;
  setQuestion: (q: string) => void;
  send: () => void;
  isLoading: boolean;
}

export default function ChatInput({ question, setQuestion, send, isLoading }: ChatInputProps) {
  const charCount = question.length;
  const maxChars = 500;
  const isNearLimit = charCount > maxChars * 0.8;

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-xl opacity-50"></div>
      
      <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Enhanced input */}
          <div className="flex-1 relative">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) send();
              }}
              className="w-full border-2 border-gray-200 focus:border-transparent px-6 py-4 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 text-sm placeholder-gray-500 bg-gray-50/50 focus:bg-white transition-all duration-300 pr-12"
              placeholder="Ask about cricket stats, records, or live matches..."
              disabled={isLoading}
              maxLength={maxChars}
            />
            
            {/* Character indicator */}
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-xs font-medium ${
              isNearLimit ? 'text-red-500' : 'text-gray-400'
            }`}>
              {charCount}/{maxChars}
            </div>
            
            {/* Input glow effect when focused */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

          {/* Enhanced send button */}
          <button
            onClick={send}
            disabled={isLoading || !question.trim()}
            className="relative overflow-hidden cursor-pointer bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white px-8 py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 font-bold shadow-lg hover:shadow-2xl transform hover:scale-105 group"
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center gap-3">
              {isLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  <span>Ask AI</span>
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </>
              )}
            </div>
          </button>
        </div>

        {/* Enhanced footer with better styling */}
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">Enter</kbd>
              to send
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              Real cricket data from official sources
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${isNearLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount > 0 && `${charCount} characters`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
