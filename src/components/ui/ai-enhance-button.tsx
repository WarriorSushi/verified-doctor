"use client";

import { useState } from "react";
import { Sparkles, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EnhanceType = "bio" | "approach" | "first_visit" | "conditions" | "procedures";
type EnhanceLength = "short" | "medium" | "long";

interface AIEnhanceButtonProps {
  text: string;
  type: EnhanceType;
  onEnhance: (enhancedText: string) => void;
  disabled?: boolean;
  className?: string;
  showLengthSelector?: boolean;
}

const LENGTH_LABELS: Record<EnhanceLength, string> = {
  short: "Short",
  medium: "Medium",
  long: "Long",
};

export function AIEnhanceButton({
  text,
  type,
  onEnhance,
  disabled = false,
  className,
  showLengthSelector = true,
}: AIEnhanceButtonProps) {
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [length, setLength] = useState<EnhanceLength>("medium");

  const handleEnhance = async () => {
    if (!text.trim() || isEnhancing || disabled) return;

    setIsEnhancing(true);
    setError(null);

    try {
      const response = await fetch("/api/enhance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, type, length }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to enhance");
      }

      onEnhance(data.enhancedText);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enhancement failed");
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsEnhancing(false);
    }
  };

  const isDisabled = disabled || isEnhancing || !text.trim();

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {/* Length Selector */}
      {showLengthSelector && (
        <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {(Object.keys(LENGTH_LABELS) as EnhanceLength[]).map((len) => (
            <button
              key={len}
              type="button"
              onClick={() => setLength(len)}
              disabled={isEnhancing}
              className={cn(
                "px-2.5 py-1 text-xs font-medium rounded-md transition-all",
                length === len
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {LENGTH_LABELS[len]}
            </button>
          ))}
        </div>
      )}

      {/* Enhance Button */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleEnhance}
        disabled={isDisabled}
        className={cn(
          "gap-1.5 text-xs font-medium transition-all",
          showSuccess && "bg-emerald-50 border-emerald-200 text-emerald-700",
          error && "bg-red-50 border-red-200 text-red-700",
          !showSuccess && !error && "hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700",
          className
        )}
      >
        {isEnhancing ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Enhancing...</span>
          </>
        ) : showSuccess ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Enhanced!</span>
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Try again</span>
          </>
        ) : (
          <>
            <Sparkles className="w-3.5 h-3.5" />
            <span>Enhance for free with AI</span>
          </>
        )}
      </Button>

      {/* Tooltip for error */}
      {error && (
        <div className="absolute left-0 top-full mt-1 z-10 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 max-w-[200px] shadow-md">
          {error}
        </div>
      )}
    </div>
  );
}
