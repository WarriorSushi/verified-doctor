"use client";

import { Stethoscope, Scissors } from "lucide-react";

interface ConditionsProceduresProps {
  conditions?: string;
  procedures?: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

function parseTags(value: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

export function ConditionsProcedures({
  conditions,
  procedures,
  themeColors,
}: ConditionsProceduresProps) {
  const conditionTags = parseTags(conditions || "");
  const procedureTags = parseTags(procedures || "");

  if (conditionTags.length === 0 && procedureTags.length === 0) return null;

  return (
    <div className="space-y-4">
      {conditionTags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${themeColors.primary}15` }}
            >
              <Stethoscope className="w-4 h-4" style={{ color: themeColors.primary }} />
            </div>
            <h3 className="font-semibold text-slate-900">Conditions Treated</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {conditionTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${themeColors.primary}10`,
                  color: themeColors.primary,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {procedureTags.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${themeColors.primary}15` }}
            >
              <Scissors className="w-4 h-4" style={{ color: themeColors.primary }} />
            </div>
            <h3 className="font-semibold text-slate-900">Procedures & Treatments</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {procedureTags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: `${themeColors.accent}30`,
                  color: themeColors.primary,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
