"use client";
import { BarChart3, LogOut, Zap, Users, Activity } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

// Enhanced ChatHeader with animated elements
export default function ChatHeader() {
  const dispatch = useDispatch();

  return (
    <div className="relative mb-8">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-indigo-600/10 rounded-3xl blur-3xl animate-pulse"></div>
      
      <div className="relative flex items-center justify-between p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20">
        <div className="flex items-center">
          {/* Enhanced animated icon */}
          <div className="relative mr-6">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300">
              <BarChart3 className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-gradient">
              Cricket Stats AI
            </h1>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1 text-gray-600">
                <Activity className="w-4 h-4 text-green-500" />
                Real-time insights
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Zap className="w-4 h-4 text-yellow-500" />
                AI-powered analysis
              </span>
              <span className="flex items-center gap-1 text-gray-600">
                <Users className="w-4 h-4 text-blue-500" />
                Global stats
              </span>
            </div>
          </div>
        </div>
        
        {/* Enhanced logout button */}
        <button
          onClick={() => dispatch(logout())}
          className="group flex items-center gap-3 cursor-pointer bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
}