"use client";

import React from "react";

interface SocialProps {
  className?: string;
  iconSize?: number;
  position?: "fixed" | "absolute" | "relative" | "static";
}

export function Social({ className = "", iconSize = 20, position = "absolute" }: SocialProps) {
  return (
    <div className={`${position === "absolute" ? "absolute bottom-8" : ""} flex items-center justify-center space-x-8 ${className}`}>
      {/* GitHub */}
      <a href="https://github.com/HFStudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5AA1E3] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <title>GitHub</title>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
        </svg>
      </a>

      {/* Discord */}
      <a href="https://discord.gg/hfstudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5AA1E3] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <title>Discord</title>
          <path d="M9 12a1 1 0 1 0 2 0 1 1 0 0 0-2 0zm6 0a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" />
          <path d="M7.5 3h9l.5 1.5L18.5 9c0 6-3 7.5-6.5 7.5S5.5 15 5.5 9L7 4.5 7.5 3z" />
          <path d="M8 17.5c-2 2-2 4.5-2 4.5h12s0-2.5-2-4.5" />
        </svg>
      </a>

      {/* Twitter / X */}
      <a href="https://x.com/hfstudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5AA1E3] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <title>Twitter</title>
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
        </svg>
      </a>

      {/* LinkedIn */}
      <a href="https://linkedin.com/company/hfstudio" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#5AA1E3] transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <title>LinkedIn</title>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      </a>
    </div>
  );
} 