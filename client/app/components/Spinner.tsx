import React from "react";

export default function GradientSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-12 h-12">
        {/* Gradient border ring */}
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin 
          bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 
          [mask-image:radial-gradient(farthest-side,transparent 70%,black)]">
        </div>

        {/* Inner circle (background) */}
        <div className="absolute inset-2 rounded-full bg-white dark:bg-gray-900"></div>
      </div>
    </div>
  );
}
