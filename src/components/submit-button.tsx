"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { FaSpinner } from "react-icons/fa6";

interface SubmitButtonProps {
  children: React.ReactNode;
  className?: string;
}

export function SubmitButton({ children, className = "" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <Button 
      size="lg" 
      className={`w-full text-lg transition-all duration-300 relative ${className}`} 
      disabled={pending} 
      type="submit"
    >
      {pending ? (
        <>
          <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
          Connecting...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
