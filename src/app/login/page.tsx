"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FaBookOpen, FaArrowLeft, FaSpinner } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="h-screen w-full bg-background lg:grid lg:grid-cols-2 relative overflow-hidden">
      {/* Left Column - Animation (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between items-center bg-black/5 dark:bg-white/5 p-8 relative border-r border-border h-screen overflow-hidden">
        <div className="w-full flex justify-start pt-2 pl-2 shrink-0">
          <div className="flex items-center gap-2">
            <FaBookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary tracking-tight">Ajarin.</span>
          </div>
        </div>
        <div className="w-full flex-1 min-h-0 flex items-center justify-center">
          <DotLottieReact
            src="/Sign up.lottie"
            loop
            autoplay
            className="w-full max-h-full object-contain mix-blend-multiply dark:mix-blend-normal opacity-90"
          />
        </div>
        <div className="text-center shrink-0 pb-4 pt-4">
          <h2 className="text-2xl xl:text-3xl font-sans font-bold text-foreground mb-2">Start your journey today.</h2>
          <p className="text-muted-foreground text-base xl:text-lg max-w-sm mx-auto">Build sustainable study habits and track your progress with a community of focused learners.</p>
        </div>
      </div>

      {/* Right Column - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 h-full overflow-y-auto relative container mx-auto">
        <div className="w-full relative z-10 py-8 lg:py-0">
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

          {/* Conditional Form Rendering */}
          {isRegister ? (
            <RegisterForm onSuccess={() => setIsRegister(false)} />
          ) : (
            <LoginForm />
          )}

          <div className="mt-6 flex items-center justify-between before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
            <span className="text-xs text-muted-foreground px-4 uppercase tracking-wider font-semibold">or</span>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full py-6 rounded-full mt-6 bg-transparent hover:bg-secondary/50 font-semibold border-border transition-transform active:scale-95 disabled:opacity-70"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
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
              onClick={() => setIsRegister(!isRegister)}
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
