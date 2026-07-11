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

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        router.push("/");
        router.refresh();
      }
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors">
          <FaArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>

        <div className="bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8 text-center">
            <FaBookOpen className="h-10 w-10 text-primary mb-4" />
            <h1 className="text-3xl font-serif font-bold text-card-foreground">
              {isRegister ? "Create an Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isRegister 
                ? "Join Ajarin and start building mindful study habits."
                : "Enter your credentials to access your dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-card-foreground">Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Email</label>
              <input 
                type="email" 
                name="email" 
                required 
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-card-foreground">Password</label>
              <input 
                type="password" 
                name="password" 
                required 
                className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20">
                {error}
              </div>
            )}

            {success && (
              <div className="p-3 bg-emerald-500/10 text-emerald-600 text-sm rounded-lg border border-emerald-500/20">
                {success}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full py-6 text-lg rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
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
            <span className="text-xs text-muted-foreground px-4 uppercase tracking-wider">or</span>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full py-6 rounded-full mt-6 bg-transparent hover:bg-secondary/50"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="w-5 h-5 mr-3" />
            Continue with Google
          </Button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button 
              onClick={() => {
                setIsRegister(!isRegister);
                setError(null);
              }}
              className="text-primary hover:underline font-medium"
            >
              {isRegister ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
