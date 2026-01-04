"use client";

import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ValidationRule {
  validate: (value: string) => boolean | Promise<boolean>;
  message: string;
}

interface ValidatedInputProps extends React.ComponentProps<"input"> {
  rules?: ValidationRule[];
  onValidationChange?: (isValid: boolean) => void;
  showIndicator?: boolean;
  validateOnBlur?: boolean;
  validateOnChange?: boolean;
  debounceMs?: number;
}

type ValidationState = "idle" | "validating" | "valid" | "invalid";

function ValidatedInput({
  className,
  rules = [],
  onValidationChange,
  showIndicator = true,
  validateOnBlur = true,
  validateOnChange = true,
  debounceMs = 300,
  ...props
}: ValidatedInputProps) {
  const [value, setValue] = useState((props.value as string) || (props.defaultValue as string) || "");
  const [validationState, setValidationState] = useState<ValidationState>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [touched, setTouched] = useState(false);

  const validateValue = useCallback(async (val: string) => {
    if (!val || rules.length === 0) {
      setValidationState("idle");
      setErrorMessage("");
      onValidationChange?.(true);
      return;
    }

    setValidationState("validating");

    for (const rule of rules) {
      try {
        const isValid = await rule.validate(val);
        if (!isValid) {
          setValidationState("invalid");
          setErrorMessage(rule.message);
          onValidationChange?.(false);
          return;
        }
      } catch {
        setValidationState("invalid");
        setErrorMessage(rule.message);
        onValidationChange?.(false);
        return;
      }
    }

    setValidationState("valid");
    setErrorMessage("");
    onValidationChange?.(true);
  }, [rules, onValidationChange]);

  // Debounced validation on change
  useEffect(() => {
    if (!validateOnChange || !touched) return;

    const timer = setTimeout(() => {
      validateValue(value);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [value, validateOnChange, touched, debounceMs, validateValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    props.onChange?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    if (validateOnBlur) {
      validateValue(e.target.value);
    }
    props.onBlur?.(e);
  };

  const getIndicatorIcon = () => {
    if (!showIndicator || !touched || validationState === "idle") return null;

    switch (validationState) {
      case "validating":
        return <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />;
      case "valid":
        return <Check className="w-4 h-4 text-emerald-500" />;
      case "invalid":
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getBorderClass = () => {
    if (!touched || validationState === "idle" || validationState === "validating") {
      return "";
    }
    if (validationState === "valid") {
      return "border-emerald-500 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20";
    }
    if (validationState === "invalid") {
      return "border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20";
    }
    return "";
  };

  return (
    <div className="relative">
      <input
        data-slot="validated-input"
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          showIndicator && "pr-10",
          getBorderClass(),
          className
        )}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={validationState === "invalid"}
        {...props}
      />

      {/* Validation indicator */}
      {showIndicator && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {getIndicatorIcon()}
        </div>
      )}

      {/* Error message */}
      {touched && validationState === "invalid" && errorMessage && (
        <p className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

// Common validation rules
export const validationRules = {
  required: (message = "This field is required"): ValidationRule => ({
    validate: (value) => value.trim().length > 0,
    message,
  }),
  email: (message = "Please enter a valid email"): ValidationRule => ({
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message,
  }),
  phone: (message = "Please enter a valid phone number"): ValidationRule => ({
    validate: (value) => /^[\d\s+\-()]{10,}$/.test(value.replace(/\s/g, "")),
    message,
  }),
  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => value.length >= min,
    message: message || `Must be at least ${min} characters`,
  }),
  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => value.length <= max,
    message: message || `Must be at most ${max} characters`,
  }),
  url: (message = "Please enter a valid URL"): ValidationRule => ({
    validate: (value) => {
      if (!value) return true;
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message,
  }),
  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => regex.test(value),
    message,
  }),
};

export { ValidatedInput };
export type { ValidationRule, ValidatedInputProps };
