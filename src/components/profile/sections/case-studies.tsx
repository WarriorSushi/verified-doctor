"use client";

import { BookOpen, ChevronDown } from "lucide-react";
import { useState } from "react";

interface CaseStudyItem {
  title: string;
  description: string;
  outcome?: string;
}

interface CaseStudiesProps {
  items: CaseStudyItem[];
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function CaseStudies({ items, themeColors }: CaseStudiesProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <BookOpen className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Case Studies</h3>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="border border-slate-100 rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
              <span className="font-medium text-slate-900">{item.title}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform ${
                  expandedIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {expandedIndex === index && (
              <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                <p className="text-sm text-slate-600 whitespace-pre-wrap">
                  {item.description}
                </p>
                {item.outcome && (
                  <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-100">
                    <p className="text-sm font-medium text-green-800">Outcome</p>
                    <p className="text-sm text-green-700 mt-1">{item.outcome}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
