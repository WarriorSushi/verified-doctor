"use client";

import { Users } from "lucide-react";

interface MembershipItem {
  organization: string;
  year?: string;
}

interface ProfessionalMembershipsProps {
  items: MembershipItem[];
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function ProfessionalMemberships({
  items,
  themeColors,
}: ProfessionalMembershipsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <Users className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Professional Memberships</h3>
      </div>

      <div className="space-y-2">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 rounded-lg bg-slate-50"
          >
            <span className="text-sm font-medium text-slate-700">
              {item.organization}
            </span>
            {item.year && (
              <span className="text-xs text-slate-400">Since {item.year}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
