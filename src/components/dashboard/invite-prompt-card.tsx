"use client";

import { Target, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InviteDialog } from "./invite-dialog";

interface InvitePromptCardProps {
  connectionCount: number;
}

export function InvitePromptCard({ connectionCount }: InvitePromptCardProps) {
  // Only show if connections are less than 5
  if (connectionCount >= 5) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200 p-4 sm:p-6">
      <div className="flex items-start gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0">
          <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-1">
            Grow Your Network
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
            Doctors with 10+ connections get <span className="font-semibold text-amber-700">3x more profile views</span>. Invite colleagues to build your professional network!
          </p>

          {/* Stats hint */}
          <div className="flex items-center gap-4 mb-3 sm:mb-4 text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{connectionCount} connections</span>
            </div>
            <div className="flex items-center gap-1 text-amber-600">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Goal: 10+</span>
            </div>
          </div>

          <InviteDialog
            trigger={
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs sm:text-sm"
              >
                Invite Colleagues
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
