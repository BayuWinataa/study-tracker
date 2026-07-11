"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground z-[100] fixed inset-0">
      <div className="w-48 h-48 sm:w-64 sm:h-64 opacity-80 flex items-center justify-center">
        <DotLottieReact
          src="/loading.lottie"
          loop
          autoplay
        />
      </div>
      <p className="mt-8 text-sm font-black uppercase tracking-widest text-foreground animate-pulse">
        Loading System
      </p>
    </div>
  );
}
