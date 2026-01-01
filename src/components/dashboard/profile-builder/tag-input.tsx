"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Add a tag...",
  maxTags = 20,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");

  // Parse comma-separated string into array of tags
  const tags = value
    ? value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (tags.includes(trimmed)) return;
    if (tags.length >= maxTags) return;

    const newTags = [...tags, trimmed];
    onChange(newTags.join(", "));
    setInputValue("");
  };

  const removeTag = (index: number) => {
    const newTags = tags.filter((_, i) => i !== index);
    onChange(newTags.join(", "));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const handleAddClick = () => {
    addTag(inputValue);
  };

  const canAddMore = tags.length < maxTags;

  return (
    <div className="space-y-4">
      {/* Input Field with Add Button */}
      {canAddMore && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 h-12 text-base px-4 rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-100"
          />
          <button
            type="button"
            onClick={handleAddClick}
            disabled={!inputValue.trim()}
            className={cn(
              "h-12 px-5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all duration-200 active:scale-[0.98]",
              inputValue.trim()
                ? "bg-emerald-500 text-white hover:bg-emerald-600"
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            )}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>
      )}

      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 pl-4 pr-2 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium group"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-1 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-500" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-400">
        {tags.length} of {maxTags} tags added
      </p>
    </div>
  );
}
