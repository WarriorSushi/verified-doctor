"use client";

import { GraduationCap } from "lucide-react";

interface EducationItem {
  institution: string;
  degree: string;
  year: string;
}

interface EducationTimelineProps {
  items: EducationItem[];
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function EducationTimeline({ items, themeColors }: EducationTimelineProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <GraduationCap className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Education & Training</h3>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-3 top-2 bottom-2 w-0.5"
          style={{ backgroundColor: `${themeColors.primary}20` }}
        />

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="relative pl-8">
              {/* Timeline dot */}
              <div
                className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full border-2 bg-white"
                style={{ borderColor: themeColors.primary }}
              />

              <div>
                <p className="font-medium text-slate-900">{item.degree}</p>
                <p className="text-sm text-slate-600">{item.institution}</p>
                {item.year && (
                  <p className="text-xs text-slate-400 mt-0.5">{item.year}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
