"use client";
import { Activity, Trophy, Users, TrendingUp, Sparkles} from "lucide-react";

export default function StatsCards() {
  const cards = [
    { 
      icon: Activity, 
      title: "Live Matches", 
      value: "Real-time",
      color: "from-green-500 to-emerald-600",
      bgColor: "from-green-50 to-emerald-50",
      description: "Active games"
    },
    { 
      icon: Trophy, 
      title: "Records", 
      value: "Historical",
      color: "from-yellow-500 to-amber-600",
      bgColor: "from-yellow-50 to-amber-50",
      description: "All-time stats"
    },
    { 
      icon: Users, 
      title: "Players", 
      value: "Global",
      color: "from-blue-500 to-cyan-600",
      bgColor: "from-blue-50 to-cyan-50",
      description: "Worldwide data"
    },
    { 
      icon: TrendingUp, 
      title: "Analytics", 
      value: "Advanced",
      color: "from-purple-500 to-violet-600",
      bgColor: "from-purple-50 to-violet-50",
      description: "Deep insights"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, i) => {
        const IconComponent = card.icon;
        return (
          <div 
            key={i} 
            className={`group relative overflow-hidden bg-gradient-to-br ${card.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-2xl border border-white/50 transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 cursor-pointer`}
          >
            {/* Animated background effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
            
            {/* Floating sparkle effect */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            </div>
            
            <div className="relative text-center space-y-3">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${card.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}>
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  {card.title}
                </p>
                <p className="text-2xl font-black bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                  {card.value}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                  {card.description}
                </p>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-20 blur-xl transition-all duration-500 -z-10`}></div>
          </div>
        );
      })}
    </div>
  );
}