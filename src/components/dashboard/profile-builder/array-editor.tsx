"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "year";
  placeholder?: string;
  required?: boolean;
}

interface ArrayEditorProps<T extends Record<string, string>> {
  items: T[];
  onChange: (items: T[]) => void;
  fields: FieldConfig[];
  addLabel?: string;
  emptyMessage?: string;
  maxItems?: number;
}

export function ArrayEditor<T extends Record<string, string>>({
  items,
  onChange,
  fields,
  addLabel = "Add Item",
  emptyMessage = "No items added yet",
  maxItems = 10,
}: ArrayEditorProps<T>) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addItem = () => {
    if (items.length >= maxItems) return;
    const newItem = fields.reduce((acc, field) => {
      acc[field.name as keyof T] = "" as T[keyof T];
      return acc;
    }, {} as T);
    onChange([...items, newItem]);
    setEditingIndex(items.length);
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
    if (editingIndex === index) setEditingIndex(null);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= items.length) return;
    const updated = [...items];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {items.length === 0 ? (
        <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-2 hover:bg-slate-200 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <GripVertical className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="text-sm font-medium text-slate-600">
                    #{index + 1}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name}>
                    <Label className="text-sm text-slate-600 mb-2 block">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-0.5">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={item[field.name as keyof T] || ""}
                        onChange={(e) =>
                          updateItem(index, field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        className="text-base min-h-[100px] rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-100"
                      />
                    ) : (
                      <Input
                        type={field.type === "year" ? "number" : "text"}
                        value={item[field.name as keyof T] || ""}
                        onChange={(e) =>
                          updateItem(index, field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        className="h-12 text-base rounded-xl border-slate-200 focus:border-emerald-300 focus:ring-emerald-100"
                        min={field.type === "year" ? 1950 : undefined}
                        max={field.type === "year" ? new Date().getFullYear() + 5 : undefined}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length < maxItems && (
        <button
          type="button"
          onClick={addItem}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-4 rounded-xl",
            "border-2 border-dashed border-slate-200 hover:border-slate-300",
            "text-slate-600 hover:text-slate-700 font-medium text-sm",
            "transition-all active:scale-[0.99]"
          )}
        >
          <Plus className="w-4 h-4" />
          {addLabel}
        </button>
      )}

      {items.length >= maxItems && (
        <p className="text-xs text-slate-400 text-center">
          Maximum of {maxItems} items
        </p>
      )}
    </div>
  );
}
