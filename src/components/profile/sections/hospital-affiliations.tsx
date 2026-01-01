"use client";

import { Building2 } from "lucide-react";

interface HospitalItem {
  name: string;
  role: string;
  department?: string;
}

interface HospitalAffiliationsProps {
  items: HospitalItem[];
  themeColors: {
    primary: string;
    accent: string;
  };
}

export function HospitalAffiliations({ items, themeColors }: HospitalAffiliationsProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${themeColors.primary}15` }}
        >
          <Building2 className="w-4 h-4" style={{ color: themeColors.primary }} />
        </div>
        <h3 className="font-semibold text-slate-900">Hospital Affiliations</h3>
      </div>

      <div className="grid gap-3">
        {items.map((item, index) => (
          <div
            key={index}
            className="p-3 rounded-xl border border-slate-100 bg-slate-50/50"
          >
            <p className="font-medium text-slate-900">{item.name}</p>
            <p className="text-sm text-slate-600">{item.role}</p>
            {item.department && (
              <p className="text-xs text-slate-400 mt-1">{item.department}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
