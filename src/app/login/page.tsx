"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { registerUser } from "@/actions/auth";
import { SubmitButton } from "@/components/submit-button";
import { Button } from "@/components/ui/button";
import { FaBookOpen, FaArrowLeft, FaSpinner } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (isRegister) {
      // Registration Flow
      const result = await registerUser(formData);
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      // Successfully registered, switch to Sign In and show success message
      setIsRegister(false);
      setSuccess("Account created successfully! Please sign in.");
      setError(null);
      setLoading(false);

    } else {
      // Login Flow
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password.");
        setLoading(false);
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="h-screen w-full bg-background lg:grid lg:grid-cols-2 relative overflow-hidden">

      {/* Left Column - Animation (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between items-center bg-black/5 dark:bg-white/5 p-8 relative border-r border-border h-screen overflow-hidden">

        {/* Logo / Top Spacer */}
        <div className="w-full flex justify-start pt-2 pl-2 shrink-0">
          <div className="flex items-center gap-2">
            <FaBookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary tracking-tight">Ajarin.</span>
          </div>
        </div>

        {/* Animation Container - Shrinks to fit available space */}
        <div className="w-full flex-1 min-h-0 flex items-center justify-center">
          <DotLottieReact
            src="/Sign up.lottie"
            loop
            autoplay
            className="w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-90"
          />
        </div>

        {/* Text Container */}
        <div className="text-center shrink-0 pb-4 pt-4">
          <h2 className="text-2xl xl:text-3xl font-sans font-bold text-foreground mb-2">Start your journey today.</h2>
          <p className="text-muted-foreground text-base xl:text-lg max-w-sm mx-auto">Build sustainable study habits and track your progress with a community of focused learners.</p>
        </div>
      </div>

      {/* Right Column - Form (Full width on mobile) */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 h-full overflow-y-auto relative container mx-auto">

        <div className="w-full  relative z-10 py-8 lg:py-0">

          {/* Header / Back Button */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
              <FaArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <div className="lg:hidden flex items-center gap-2">
              <FaBookOpen className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-primary">Ajarin.</span>
            </div>
          </div>

          <div className="flex flex-col items-start mb-6 text-left">
            <h1 className="text-3xl sm:text-4xl font-sans font-bold text-foreground mb-1">
              {isRegister ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-base">
              {isRegister
                ? "Join Ajarin and start building mindful study habits."
                : "Enter your credentials to access your dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-secondary/30 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-medium">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 text-sm rounded-xl border border-emerald-500/20 font-medium">
                {success}
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-6 text-base rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2 transition-transform active:scale-95"
              disabled={loading}
            >
              {loading ? (
                <FaSpinner className="h-5 w-5 animate-spin mx-auto" />
              ) : (
                isRegister ? "Sign Up" : "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            <span className="text-xs text-muted-foreground px-4 uppercase tracking-wider font-semibold">or</span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-6 rounded-full mt-6 bg-transparent hover:bg-secondary/50 font-semibold border-border transition-transform active:scale-95 disabled:opacity-70"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || loading}
          >
            {isGoogleLoading ? (
              <FaSpinner className="w-5 h-5 mr-3 animate-spin text-muted-foreground" />
            ) : (
              <FcGoogle className="w-5 h-5 mr-3" />
            )}
            {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground font-medium">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-primary hover:underline font-bold"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
