"use client";

import { useState, KeyboardEvent } from "react";
import { X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TagInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxTags?: number;
}

export function TagInput({
  value,
  onChange,
  placeholder = "Type and press Enter to add",
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

  return (
    <div className="space-y-3">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0099F7]/10 text-[#0099F7] rounded-full text-sm font-medium"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-0.5 hover:bg-[#0099F7]/20 rounded-full transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input Field */}
      {tags.length < maxTags && (
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 text-sm"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddClick}
            disabled={!inputValue.trim()}
            className="shrink-0"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Helper Text */}
      <p className="text-xs text-slate-500">
        {tags.length} of {maxTags} tags
        {tags.length < maxTags && " • Press Enter to add"}
      </p>
    </div>
  );
}
