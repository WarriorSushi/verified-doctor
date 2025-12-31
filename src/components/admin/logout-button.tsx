"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="ghost"
      className="text-slate-400 hover:text-white hover:bg-slate-800"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
}
