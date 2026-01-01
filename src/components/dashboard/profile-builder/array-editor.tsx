"use client";

import { useState } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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
    <div className="space-y-3">
      {items.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-slate-50 rounded-lg p-4 border border-slate-200"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="p-1 hover:bg-slate-200 rounded cursor-grab"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <GripVertical className="w-4 h-4 text-slate-400" />
                  </button>
                  <span className="text-xs font-medium text-slate-500">
                    #{index + 1}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                  onClick={() => removeItem(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {fields.map((field) => (
                  <div
                    key={field.name}
                    className={field.type === "textarea" ? "sm:col-span-2" : ""}
                  >
                    <Label className="text-xs text-slate-600 mb-1 block">
                      {field.label}
                      {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    {field.type === "textarea" ? (
                      <Textarea
                        value={item[field.name as keyof T] || ""}
                        onChange={(e) =>
                          updateItem(index, field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        className="text-sm min-h-[80px]"
                      />
                    ) : (
                      <Input
                        type={field.type === "year" ? "number" : "text"}
                        value={item[field.name as keyof T] || ""}
                        onChange={(e) =>
                          updateItem(index, field.name, e.target.value)
                        }
                        placeholder={field.placeholder}
                        className="text-sm"
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
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={addItem}
        >
          <Plus className="w-4 h-4 mr-2" />
          {addLabel}
        </Button>
      )}

      {items.length >= maxItems && (
        <p className="text-xs text-slate-500 text-center">
          Maximum of {maxItems} items allowed
        </p>
      )}
    </div>
  );
}
