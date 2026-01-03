"use client";

import { useState } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

interface MembershipItem {
  organization: string;
  year?: string;
}

interface ProfessionalMembershipsProps {
  items: MembershipItem[];
  themeColors: {
    primary: string;
    accent: string;
  };
}

const MAX_VISIBLE_ITEMS = 4;

export function ProfessionalMemberships({
  items,
  themeColors,
}: ProfessionalMembershipsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!items || items.length === 0) return null;

  const hasMore = items.length > MAX_VISIBLE_ITEMS;
  const displayItems = isExpanded ? items : items.slice(0, MAX_VISIBLE_ITEMS);
  const hiddenCount = items.length - MAX_VISIBLE_ITEMS;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <Users className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Professional Memberships</h3>
      </div>

      <div className="space-y-2">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
          >
            <span className="text-sm font-medium text-slate-700">
              {item.organization}
            </span>
            {item.year && (
              <span className="text-xs text-slate-400">Since {item.year}</span>
            )}
          </div>
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
    </div>
  );
}
