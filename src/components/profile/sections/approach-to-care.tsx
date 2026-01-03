"use client";

import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";

interface ApproachToCareProps {
  content: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

const MAX_LENGTH = 200;

export function ApproachToCare({ content, themeColors }: ApproachToCareProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content) return null;

  const isLong = content.length > MAX_LENGTH;
  const displayContent = isExpanded || !isLong
    ? content
    : content.slice(0, MAX_LENGTH).trim() + "...";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <Heart className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Approach to Care</h3>
      </div>
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{displayContent}</p>
      {isLong && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-sm font-medium inline-flex items-center gap-1 transition-colors"
          style={{ color: themeColors.primary }}
        >
          {isExpanded ? (
            <>Show less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Read more <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </div>
  );
}
