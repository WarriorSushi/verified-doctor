"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, ArrowRight, Check, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as clientAuth from "@/lib/auth/client";

function SignUpForm() {
  const searchParams = useSearchParams();
  const claimedHandle = searchParams.get("handle");
  const inviteCode = searchParams.get("invite");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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

      // Store handle in localStorage for retrieval after email confirmation
      if (claimedHandle) {
        localStorage.setItem("claimed_handle", claimedHandle);
      }
      if (inviteCode) {
        localStorage.setItem("invite_code", inviteCode);
      }

      // Show confirmation message instead of redirecting
      setShowConfirmation(true);
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

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);
    try {
      const { error } = await clientAuth.resendConfirmationEmail(email);
      if (error) throw error;
      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
    } catch {
      setError("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  // Show email confirmation screen
  if (showConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-6 bg-emerald-50 rounded-full flex items-center justify-center">
          <Mail className="w-8 h-8 text-emerald-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Check your email
        </h1>

        <p className="text-slate-600 mb-6">
          We sent a confirmation link to<br />
          <span className="font-semibold text-slate-800">{email}</span>
        </p>

        <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-sky-800">
            Click the link in your email to verify your account.
            The link will redirect you back here to complete your profile setup.
          </p>
        </div>

        {claimedHandle && (
          <div className="flex items-center justify-center gap-2 mb-6 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              verified.doctor/{claimedHandle} is reserved for you
            </span>
          </div>
        )}

        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            Didn&apos;t receive the email?
          </p>
          <Button
            variant="outline"
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : resendSuccess ? (
              <Check className="w-4 h-4 text-emerald-600 mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            {resendSuccess ? "Email sent!" : "Resend confirmation email"}
          </Button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Wrong email?{" "}
            <button
              onClick={() => {
                setShowConfirmation(false);
                setEmail("");
                setPassword("");
              }}
              className="font-medium text-[#0099F7] hover:text-[#0080CC]"
            >
              Try again
            </button>
          </p>
        </div>
      </motion.div>
    );
  }

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
