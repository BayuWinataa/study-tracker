"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaSpinner } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

export function LoginForm() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginInput) => {
    setGlobalError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: values.email,
      password: values.password,
    });

    if (res?.error) {
      setGlobalError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          type="email"
          placeholder="you@example.com"
          className="bg-secondary/30 h-12"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm font-semibold text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          type="password"
          placeholder="••••••••"
          className="bg-secondary/30 h-12"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm font-semibold text-destructive">{errors.password.message}</p>
        )}
      </div>

      {globalError && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-xl border border-destructive/20 font-medium">
          {globalError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full py-6 text-base rounded-full font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2 transition-transform active:scale-95"
        disabled={loading}
      >
        {loading ? <FaSpinner className="h-5 w-5 animate-spin mx-auto" /> : "Sign In"}
      </Button>
    </form>
  );
}
