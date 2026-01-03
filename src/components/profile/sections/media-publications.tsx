"use client";

import { useState } from "react";
import { Newspaper, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface MediaItem {
  title: string;
  publication: string;
  link?: string;
  year?: string;
}

interface MediaPublicationsProps {
  items: MediaItem[];
  themeColors: {
    primary: string;
    accent: string;
  };
}

const MAX_VISIBLE_ITEMS = 3;

export function MediaPublications({
  items,
  themeColors,
}: MediaPublicationsProps) {
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
          <Newspaper className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Media & Publications</h3>
      </div>

      <div className="space-y-3">
        {displayItems.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-xl border border-slate-100 bg-slate-50/50"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="text-sm text-slate-600">{item.publication}</p>
                {item.year && (
                  <p className="text-xs text-slate-400 mt-1">{item.year}</p>
                )}
              </div>
              {item.link && (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  style={{ color: themeColors.primary }}
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
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
