"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function TestLoginButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Only render if test auth is enabled
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH !== "true") {
    return null;
  }

  async function handleTestLogin() {
    setLoading(true);

    try {
      const response = await fetch("/api/test-auth/login", {
        method: "POST",
      });

      if (response.ok) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Test login failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-6 p-4 border-2 border-dashed border-amber-500 rounded-lg bg-amber-50">
      <p className="text-sm text-amber-800 mb-3 font-medium">
        Development Mode Only
      </p>
      <Button
        variant="outline"
        onClick={handleTestLogin}
        disabled={loading}
        className="w-full border-amber-500 text-amber-700 hover:bg-amber-100"
        data-testid="test-login-button"
      >
        {loading ? "Logging in..." : "Test Login (Skip Auth)"}
      </Button>
    </div>
  );
}
