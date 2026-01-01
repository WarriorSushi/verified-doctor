"use client";

import { Heart } from "lucide-react";

interface ApproachToCareProps {
  content: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function ApproachToCare({ content, themeColors }: ApproachToCareProps) {
  if (!content) return null;

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
      <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
