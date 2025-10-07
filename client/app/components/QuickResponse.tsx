"use client";
import { MessageCircle, Zap, TrendingUp, Target } from "lucide-react";

interface QuickQuestionsProps {
  onSelect: (q: string) => void;
}

export default function QuickQuestions({ onSelect }: QuickQuestionsProps) {
  const quickQuestions = [
    {
      text: "Show top 10 ODI Teams by average",
      icon: Target,
      color: "from-blue-500 to-cyan-500"
    },
    {
      text: "Latest Test match results",
      icon: TrendingUp,
      color: "from-purple-500 to-violet-500"
    },
  ];

  return (
    <div className="mb-8">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200 shadow-sm">
          <MessageCircle className="w-4 h-4 text-indigo-600" />
          <p className="text-sm font-semibold text-slate-700">
            Try these popular queries
          </p>
          <Zap className="w-4 h-4 text-yellow-500" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {quickQuestions.map((q, index) => {
          const IconComponent = q.icon;
          return (
            <button
              key={index}
              onClick={() => onSelect(q.text)}
              className={`group relative overflow-hidden bg-white/80 backdrop-blur-sm hover:bg-white text-slate-700 p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-left cursor-pointer`}
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${q.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative flex items-center gap-4">
                <div className={`p-2 rounded-full bg-slate-100 group-hover:bg-gradient-to-r group-hover:${q.color} transition-all duration-300`}>
                  <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-sm text-slate-800 group-hover:text-indigo-800 transition-colors duration-300">
                    {q.text}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Click to explore
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}