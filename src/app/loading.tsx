"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-foreground z-[100] fixed inset-0">
      <div className="w-48 h-48 grayscale mix-blend-multiply opacity-80">
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
