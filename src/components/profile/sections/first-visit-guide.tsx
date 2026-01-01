"use client";

import { CalendarCheck } from "lucide-react";

interface FirstVisitGuideProps {
  content: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function FirstVisitGuide({ content, themeColors }: FirstVisitGuideProps) {
  if (!content) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <CalendarCheck className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">First Visit Guide</h3>
      </div>
      <div
        className="p-4 rounded-xl border"
        style={{
          backgroundColor: `${themeColors.accent}10`,
          borderColor: `${themeColors.accent}30`,
        }}
      >
        <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-sm">
          {content}
        </p>
      </div>
    </div>
  );
}
