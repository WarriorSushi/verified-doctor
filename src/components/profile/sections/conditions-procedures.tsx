"use client";

import { useState } from "react";
import { Stethoscope, Scissors, ChevronDown, ChevronUp } from "lucide-react";

interface ConditionsProceduresProps {
  conditions?: string;
  procedures?: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

const MAX_VISIBLE_TAGS = 6;

function parseTags(value: string): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

interface TagListProps {
  tags: string[];
  themeColors: { primary: string; accent: string };
  variant: "primary" | "accent";
}

function TagList({ tags, themeColors, variant }: TagListProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMore = tags.length > MAX_VISIBLE_TAGS;
  const displayTags = isExpanded ? tags : tags.slice(0, MAX_VISIBLE_TAGS);
  const hiddenCount = tags.length - MAX_VISIBLE_TAGS;

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {displayTags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1.5 rounded-full text-sm font-medium"
            style={{
              backgroundColor: variant === "primary"
                ? `${themeColors.primary}10`
                : `${themeColors.accent}30`,
              color: themeColors.primary,
            }}
          >
            {tag}
          </span>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-3 text-sm font-medium inline-flex items-center gap-1 transition-colors"
          style={{ color: themeColors.primary }}
        >
          {isExpanded ? (
            <>Show less <ChevronUp className="w-4 h-4" /></>
          ) : (
            <>Show {hiddenCount} more <ChevronDown className="w-4 h-4" /></>
          )}
        </button>
      )}
    </>
  );
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
          <TagList tags={conditionTags} themeColors={themeColors} variant="primary" />
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
          <TagList tags={procedureTags} themeColors={themeColors} variant="accent" />
        </div>
      )}
    </div>
  );
}
