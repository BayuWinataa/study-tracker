"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaSpinner } from "react-icons/fa6";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";

interface RegisterFormProps {
  onSuccess: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (values: RegisterInput) => {
    setGlobalError(null);
    setSuccess(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);

    const result = await registerUser(formData);
    if (result.error) {
      setGlobalError(result.error);
      setLoading(false);
      return;
    }

    setSuccess("Account created successfully! Please sign in.");
    setGlobalError(null);
    reset(); // clear form
    setLoading(false);
    
    // Switch to login tab automatically after a short delay
    setTimeout(() => {
      onSuccess();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="register-name">Full Name</Label>
        <Input
          id="register-name"
          type="text"
          placeholder="John Doe"
          className="bg-secondary/30 h-12"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm font-semibold text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
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
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
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
        {loading ? <FaSpinner className="h-5 w-5 animate-spin mx-auto" /> : "Sign Up"}
      </Button>
    </form>
  );
}
