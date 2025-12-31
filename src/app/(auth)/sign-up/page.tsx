"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as clientAuth from "@/lib/auth/client";

function SignUpForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const claimedHandle = searchParams.get("handle");
  const inviteCode = searchParams.get("invite");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Sign up with Supabase Auth
      const { data, error: signUpError } = await clientAuth.signUp(
        email,
        password,
        { full_name: name }
      );

      if (signUpError) {
        throw new Error(signUpError.message);
      }

      if (!data.user) {
        throw new Error("Failed to create account");
      }

      // Redirect to onboarding with the handle and invite code
      const params = new URLSearchParams();
      if (claimedHandle) params.set("handle", claimedHandle);
      if (inviteCode) params.set("invite", inviteCode);
      const queryString = params.toString();
      router.push(`/onboarding${queryString ? `?${queryString}` : ""}`);
    } catch (err) {
      if (err instanceof Error) {
        // Handle specific Supabase auth errors
        if (err.message.includes("already registered")) {
          setError("An account with this email already exists. Please sign in.");
        } else if (err.message.includes("password")) {
          setError("Password must be at least 6 characters long.");
        } else {
          setError(err.message);
        }
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Create your account
        </h1>
        {claimedHandle && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              verified.doctor/{claimedHandle} is reserved for you
            </span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Dr. John Smith"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="doctor@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="h-12"
          />
          <p className="text-xs text-slate-500">Must be at least 6 characters</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-gradient-to-r from-[#0099F7] to-[#0080CC] hover:from-[#0088E0] hover:to-[#0070B8] text-white font-semibold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{" "}
          <Link
            href={`/sign-in${claimedHandle ? `?handle=${claimedHandle}` : ""}`}
            className="font-medium text-[#0099F7] hover:text-[#0080CC]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

function SignUpFormFallback() {
  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Create your account
        </h1>
      </div>
      <div className="space-y-4">
        <div className="h-12 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-12 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-12 bg-slate-100 rounded-md animate-pulse" />
        <div className="h-12 bg-slate-100 rounded-md animate-pulse" />
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense fallback={<SignUpFormFallback />}>
      <SignUpForm />
    </Suspense>
  );
}
