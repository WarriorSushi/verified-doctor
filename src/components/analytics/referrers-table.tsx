"use client";

import { Globe, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Referrer {
  referrer: string;
  count: number;
}

interface ReferrersTableProps {
  topReferrers: Referrer[];
}

export function ReferrersTable({ topReferrers }: ReferrersTableProps) {
  const total = topReferrers.reduce((sum, r) => sum + r.count, 0);

  const getPercentage = (count: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const formatReferrer = (referrer: string) => {
    if (referrer === "direct") return "Direct Traffic";
    // Remove www. prefix for cleaner display
    return referrer.replace(/^www\./, "");
  };

  return (
    <Card className="bg-white border-slate-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-base sm:text-lg font-semibold text-slate-800">
          Top Referrers
        </CardTitle>
      </CardHeader>
      <CardContent>
        {topReferrers.length === 0 ? (
          <div className="h-[150px] flex items-center justify-center text-slate-500">
            No referrer data yet
          </div>
        ) : (
          <div className="space-y-3">
            {topReferrers.slice(0, 5).map((referrer, index) => (
              <div key={referrer.referrer} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                  {referrer.referrer === "direct" ? (
                    <Globe className="w-3 h-3 text-slate-500" />
                  ) : (
                    <ExternalLink className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-slate-700 truncate">
                      {formatReferrer(referrer.referrer)}
                    </span>
                    <span className="text-xs text-slate-500 flex-shrink-0">
                      {referrer.count.toLocaleString()} ({getPercentage(referrer.count)}%)
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#0099F7] to-[#0080CC] rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(referrer.count)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
