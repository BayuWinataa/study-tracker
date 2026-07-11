"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaBookOpen, FaTrophy, FaBrain, FaRegCircleCheck, FaMedal, FaChartLine } from "react-icons/fa6";

interface LandingPageProps {
  isLoggedIn?: boolean;
}

export function LandingPage({ isLoggedIn }: LandingPageProps = {}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">

      {/* Navbar */}
      <header className="p-6 md:px-12 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <FaBookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-bold text-primary tracking-tight">Ajarin.</span>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/dashboard">
              <Button className="w-auto bg-transparent border border-primary/30 hover:bg-primary/10 text-primary px-6 py-2 h-auto text-sm rounded-full">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/login">
              <Button className="w-auto bg-transparent border border-primary/30 hover:bg-primary/10 text-primary px-6 py-2 h-auto text-sm rounded-full">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-between p-6 md:p-12 z-10 relative max-w-7xl mx-auto w-full gap-8 lg:gap-16 min-h-[85vh] pt-12 lg:pt-0">

        {/* Left Column: Copy */}
        <div className="flex-1 space-y-8  text-center lg:text-left z-20">

          <h1 className="text-5xl md:text-7xl font-sans font-semibold leading-[1.1] tracking-tight text-white">
            Focus deeply.<br />
            Track progress.<br />
            <span className="text-white/40">Achieve more.</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-lg mx-auto lg:mx-0">
            A minimalist space designed for mindful studying. Build unbreakable habits, visualize your consistency, and join a community of focused learners.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 py-6 text-base font-medium transition-transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm">
                {isLoggedIn ? "Go to your Dashboard" : "Start tracking — it's free"}
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Minimalist Lottie */}
        <div className="flex-1 w-full hidden md:flex items-center justify-center relative z-10 mt-12 lg:mt-0">
          <div className="relative w-full aspect-square max-w-[600px] xl:max-w-[800px]  transition-transform duration-500 ">
            <DotLottieReact
              src="/Study.lottie"
              loop
              autoplay
            />
          </div>
        </div>

      </main>

      {/* Features Section - Anti-Slop Design */}
      <section className="bg-white text-black py-32 px-6 relative z-10 border-t border-black/5">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

          {/* Left Column: Features List */}
          <div className="flex-1 space-y-12 w-full">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-5xl  font-bold  text-black text-center sm:text-left">
                Engineered for consistency.
              </h2>
              <p className="text-lg text-black/60 max-w-md leading-relaxed">
                We stripped away the noise. What remains is a focused tool designed to build your momentum, day after day.
              </p>
            </div>

            <div className="space-y-10">
              {/* Feature 1 */}
              <div className="flex gap-6">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-black">
                  <FaRegCircleCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-sans mb-2">Frictionless Logging</h3>
                  <p className="text-black/60 leading-relaxed text-sm">
                    No complex forms. Check in with a single click. Visualize your growing streak and let psychology do the heavy lifting.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-black">
                  <FaMedal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-sans mb-2">Meaningful Milestones</h3>
                  <p className="text-black/60 leading-relaxed text-sm">
                    Unlock exclusive badges that actually mean something. From the 7-Day Warrior to the Monthly Master.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6">
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-black/5 text-black">
                  <FaChartLine className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-sans mb-2">Global Benchmarks</h3>
                  <p className="text-black/60 leading-relaxed text-sm">
                    Measure your dedication against peers worldwide. The leaderboard isn't a game, it's a mirror of your discipline.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Lottie Animation */}
          <div className="flex-1 w-full hidden lg:block  rounded-[2.5rem]  flex items-center justify-center ">
            <div className="relative w-full aspect-square">
              <DotLottieReact
                src="/Looping shapes.lottie"
                loop
                autoplay
                className="w-full h-full opacity-80 mix-blend-multiply"
              />
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section - Minimalist & Confident */}
      <section className="py-32 px-6 relative z-10 flex justify-center container mx-auto">
        <div className="w-full  bg-white/5 border border-white/10 rounded-[2rem] p-12 md:p-20 text-center backdrop-blur-sm">
          <div className=" space-y-8">
            <h2 className="text-4xl md:text-5xl font-sans font-semibold tracking-tight text-white leading-tight">
              Stop tracking time.<br />
              Start building discipline.
            </h2>
            <p className="text-lg text-white/60">
              No ads. No clutter. Just you and your goals. Join focused learners who have already taken control of their study habits.
            </p>
            <div className="pt-4 flex justify-center">
              <Link href={isLoggedIn ? "/dashboard" : "/login"} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-base font-semibold transition-transform hover:-translate-y-0.5 active:translate-y-0">
                  {isLoggedIn ? "Open Dashboard" : "Get Started"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 text-center text-sm text-white/40 border-t border-white/10 relative z-10 flex flex-col items-center justify-center gap-2">
        <div className="flex items-center gap-2 mb-2">
          <FaBookOpen className="h-4 w-4 text-white/30" />
          <span className="font-semibold tracking-tight text-white/50">Ajarin.</span>
        </div>
        <p>© 2026 Ajarin. All rights reserved.</p>
      </footer>
    </div>
  );
}
