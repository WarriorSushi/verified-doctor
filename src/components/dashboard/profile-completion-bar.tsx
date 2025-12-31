"use client";

import Link from "next/link";
import { CheckCircle, Circle, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProfileCompletionBarProps {
  profile: {
    profile_photo_url: string | null;
    specialty: string | null;
    clinic_name: string | null;
    clinic_location: string | null;
    years_experience: number | null;
    external_booking_url: string | null;
    is_verified: boolean | null;
    connection_count: number | null;
  };
}

interface CompletionItem {
  key: string;
  label: string;
  completed: boolean;
  weight: number;
  href: string;
  priority: number;
}

export function ProfileCompletionBar({ profile }: ProfileCompletionBarProps) {
  const items: CompletionItem[] = [
    {
      key: "photo",
      label: "Add profile photo",
      completed: !!profile.profile_photo_url,
      weight: 20,
      href: "/dashboard/settings",
      priority: 1,
    },
    {
      key: "specialty",
      label: "Add specialty",
      completed: !!profile.specialty,
      weight: 15,
      href: "/dashboard/settings",
      priority: 2,
    },
    {
      key: "clinic",
      label: "Add clinic details",
      completed: !!profile.clinic_name && !!profile.clinic_location,
      weight: 15,
      href: "/dashboard/settings",
      priority: 3,
    },
    {
      key: "experience",
      label: "Add years of experience",
      completed: profile.years_experience !== null && profile.years_experience > 0,
      weight: 10,
      href: "/dashboard/settings",
      priority: 4,
    },
    {
      key: "booking",
      label: "Add booking link",
      completed: !!profile.external_booking_url,
      weight: 10,
      href: "/dashboard/settings",
      priority: 5,
    },
    {
      key: "verified",
      label: "Get verified",
      completed: !!profile.is_verified,
      weight: 25,
      href: "/dashboard/settings#verification",
      priority: 6,
    },
    {
      key: "connections",
      label: "Invite colleagues",
      completed: (profile.connection_count || 0) >= 3,
      weight: 5,
      href: "/dashboard/connections",
      priority: 7,
    },
  ];

  const completedWeight = items
    .filter((item) => item.completed)
    .reduce((sum, item) => sum + item.weight, 0);

  const percentage = Math.round(completedWeight);

  // Get incomplete items sorted by priority
  const incompleteItems = items
    .filter((item) => !item.completed)
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  // If profile is complete, don't show the bar
  if (percentage === 100) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-slate-900">Profile Completion</h3>
          <p className="text-sm text-slate-500">
            Complete your profile to attract more patients
          </p>
        </div>
        <div className="text-2xl font-bold text-[#0099F7]">{percentage}%</div>
      </div>

      <Progress value={percentage} className="h-2 mb-6" />

      {incompleteItems.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Next steps
          </p>
          <div className="space-y-1">
            {incompleteItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <Circle className="w-4 h-4 text-slate-300" />
                  <span className="text-sm text-slate-700">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Show completed items summary */}
      <div className="mt-4 pt-4 border-t border-slate-100">
        <div className="flex flex-wrap gap-2">
          {items
            .filter((item) => item.completed)
            .map((item) => (
              <div
                key={item.key}
                className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium"
              >
                <CheckCircle className="w-3 h-3" />
                {item.label.replace("Add ", "").replace("Get ", "")}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
