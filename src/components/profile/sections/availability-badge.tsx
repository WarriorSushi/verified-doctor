"use client";

import { Clock, CheckCircle, XCircle } from "lucide-react";

interface AvailabilityBadgeProps {
  isAvailable: boolean;
  availabilityNote?: string;
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function AvailabilityBadge({
  isAvailable,
  availabilityNote,
  themeColors,
}: AvailabilityBadgeProps) {
  return (
    <div
      className={`rounded-2xl shadow-sm border p-4 ${
        isAvailable
          ? "bg-green-50 border-green-100"
          : "bg-red-50 border-red-100"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isAvailable ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {isAvailable ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
        </div>
        <div className="flex-1">
          <p
            className={`font-semibold ${
              isAvailable ? "text-green-800" : "text-red-800"
            }`}
          >
            {isAvailable ? "Accepting New Patients" : "Not Accepting New Patients"}
          </p>
          {availabilityNote && (
            <p
              className={`text-sm mt-0.5 ${
                isAvailable ? "text-green-600" : "text-red-600"
              }`}
            >
              {availabilityNote}
            </p>
          )}
        </div>
        <Clock
          className={`w-5 h-5 ${isAvailable ? "text-green-400" : "text-red-400"}`}
        />
      </div>
    </div>
  );
}
