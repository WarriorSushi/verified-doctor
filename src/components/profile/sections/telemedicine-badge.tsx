"use client";

import { MonitorSmartphone, Video } from "lucide-react";

interface TelemedicineBadgeProps {
  offersTelemedicine: boolean;
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function TelemedicineBadge({
  offersTelemedicine,
  themeColors,
}: TelemedicineBadgeProps) {
  if (!offersTelemedicine) return null;

  return (
    <div
      className="rounded-2xl shadow-sm border p-4"
      style={{
        backgroundColor: `${themeColors.primary}08`,
        borderColor: `${themeColors.primary}20`,
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <Video className="w-5 h-5" style={{ color: themeColors.primary }} />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-900">Telemedicine Available</p>
          <p className="text-sm text-slate-500">Online consultations offered</p>
        </div>
        <MonitorSmartphone className="w-5 h-5" style={{ color: themeColors.primary }} />
      </div>
    </div>
  );
}
