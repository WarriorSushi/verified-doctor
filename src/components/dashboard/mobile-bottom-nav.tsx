"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare, Users, Settings, BarChart3 } from "lucide-react";

interface MobileBottomNavProps {
  unreadCount: number;
  pendingConnectionsCount?: number;
}

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/messages", label: "Messages", icon: MessageSquare, badgeKey: "messages" },
  { href: "/dashboard/connections", label: "Connections", icon: Users, badgeKey: "connections" },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function MobileBottomNav({ unreadCount, pendingConnectionsCount = 0 }: MobileBottomNavProps) {
  const pathname = usePathname();

  const getBadgeCount = (badgeKey?: string) => {
    if (badgeKey === "messages") return unreadCount;
    if (badgeKey === "connections") return pendingConnectionsCount;
    return 0;
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex justify-around items-center h-16">
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
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-colors",
                isActive
                  ? "text-[#0099F7]"
                  : "text-slate-400 active:text-slate-600"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive && "stroke-[2.5]")} />
                {badgeCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.5 text-[9px] font-bold bg-red-500 text-white rounded-full min-w-[14px] text-center leading-none">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-[#0099F7]" : "text-slate-500"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#0099F7] rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
