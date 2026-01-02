"use client";

import { useState } from "react";
import { Sparkles, Plus, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface AISuggestTagsProps {
  currentTags: string[];
  specialty: string;
  type: "conditions" | "procedures";
  onAddTag: (tag: string) => void;
  disabled?: boolean;
}

export function AISuggestTags({
  currentTags,
  specialty,
  type,
  onAddTag,
  disabled = false,
}: AISuggestTagsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const fetchSuggestions = async () => {
    if (!specialty.trim()) {
      setError("Please enter your specialty first");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          specialty: specialty.trim(),
          existingTags: currentTags,
          type,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get suggestions");
      }

      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setHasLoaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get suggestions");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = (tag: string) => {
    onAddTag(tag);
    // Remove from suggestions
    setSuggestions((prev) => prev.filter((s) => s !== tag));
  };

  const handleDismiss = () => {
    setSuggestions([]);
    setHasLoaded(false);
    setError(null);
  };

  const typeLabel = type === "conditions" ? "Conditions" : "Procedures";

  return (
    <div className="space-y-3">
      {/* Suggestion Button */}
      {!hasLoaded && (
        <button
          type="button"
          onClick={fetchSuggestions}
          disabled={disabled || isLoading}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all",
            "bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100",
            "text-violet-700 border border-violet-200 hover:border-violet-300",
            "disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Getting AI suggestions...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Get AI Suggestions</span>
            </>
          )}
        </button>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
          {error}
        </p>
      )}

      {/* Suggestions Display */}
      {hasLoaded && suggestions.length > 0 && (
        <div className="relative bg-gradient-to-br from-violet-50/80 to-purple-50/80 rounded-xl p-4 border border-violet-100">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-violet-700">
              <Sparkles className="w-4 h-4" />
              <span>Suggested {typeLabel} for {specialty}</span>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full hover:bg-violet-100 text-violet-400 hover:text-violet-600 transition-colors"
              aria-label="Dismiss suggestions"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Pills */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleAddTag(suggestion)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full",
                  "bg-white hover:bg-violet-100 text-slate-700 hover:text-violet-800",
                  "border border-violet-200 hover:border-violet-300",
                  "transition-all duration-150 hover:shadow-sm",
                  "group"
                )}
              >
                <Plus className="w-3.5 h-3.5 text-violet-500 group-hover:text-violet-600" />
                {suggestion}
              </button>
            ))}
          </div>

          {/* Help text */}
          <p className="mt-3 text-xs text-violet-500">
            Click on suggestions to add them to your list
          </p>
        </div>
      )}

      {/* No suggestions message */}
      {hasLoaded && suggestions.length === 0 && !error && (
        <div className="flex items-center justify-between bg-slate-50 rounded-lg p-3 border border-slate-200">
          <p className="text-sm text-slate-600">
            All suggestions have been added, or no more relevant {type} found.
          </p>
          <button
            type="button"
            onClick={fetchSuggestions}
            disabled={isLoading}
            className="text-sm text-violet-600 hover:text-violet-700 font-medium"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>
      )}
    </div>
  );
}
