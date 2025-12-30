"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Users, Settings } from "lucide-react";

interface DashboardNavProps {
  unreadCount: number;
  pendingConnectionsCount?: number;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
  { href: "/dashboard/connections", label: "Connections", icon: Users, badgeKey: "connections" },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardNav({ unreadCount, pendingConnectionsCount = 0 }: DashboardNavProps) {
  const pathname = usePathname();

  const getBadgeCount = (badgeKey?: string) => {
    if (badgeKey === "messages") return unreadCount;
    if (badgeKey === "connections") return pendingConnectionsCount;
    return 0;
  };

  return (
    <nav className="border-t border-slate-100 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            const Icon = item.icon;
            const badgeCount = getBadgeCount(item.badgeKey);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
                  isActive
                    ? "border-[#0099F7] text-[#0099F7]"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {badgeCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {badgeCount}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
