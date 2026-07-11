"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground">
      <div className=" p-12 flex flex-col items-center justify-center w-full max-w-2xl">
        <div className="mb-4  ">
          <DotLottieReact
            src="/404 error page with cat.lottie"
            loop
            autoplay
          />
        </div>
        <p className="text-muted-foreground mb-12 max-w-sm text-center font-medium leading-relaxed">
          The page you are looking for does not exist in our system. It may have been deleted, moved, or never existed.
        </p>

        <Link href="/" className="w-full">
          <Button className="w-full border-2 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-colors uppercase font-black tracking-widest py-8 rounded-none text-base group">
            <span className="group-hover:-translate-y-1 transition-transform">
              Return to System
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
