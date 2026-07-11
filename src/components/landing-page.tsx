"use client";

import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaBookOpen, FaTrophy, FaBrain } from "react-icons/fa6";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">

      {/* Navbar */}
      <header className="p-6 md:px-12 flex justify-between items-center z-10 relative">
        <div className="flex items-center gap-2">
          <FaBookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-serif font-bold text-primary tracking-tight">Ajarin.</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button className="w-auto bg-transparent border border-primary/30 hover:bg-primary/10 text-primary px-6 py-2 h-auto text-sm rounded-full">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center p-6 md:p-12 z-10 relative max-w-7xl mx-auto w-full gap-12 lg:gap-24 min-h-[90vh]">

        {/* Left Column: Copy */}
        <div className="flex-1 space-y-8 max-w-2xl text-center lg:text-left">
          <h1 className="text-5xl md:text-7xl font-sans font-medium leading-[1.1] tracking-tight text-white">
            Focus. <br />
            <span className="text-primary italic font-serif">Reflect.</span> <br />
            Achieve.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground/90 font-serif leading-relaxed max-w-lg mx-auto lg:mx-0">
            Mindful moments for your daily study streak. Build habits that last, track your progress, and climb the global leaderboard.
          </p>

          <div className="pt-4 flex justify-center lg:justify-start">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-7 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Column: Lottie Animation */}
        <div className="flex-1 w-full  hidden md:flex items-center justify-center relative">
          <DotLottieReact
            src="https://assets3.lottiefiles.com/packages/lf20_w51pcehl.json"
            loop
            autoplay
            className="w-full h-full relative z-10"
          />
        </div>

      </main>

      {/* Features Section */}
      <section className="bg-[#F8F3EE] text-[#1C322D] py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight">Master Your Mind</h2>
            <p className="text-lg font-serif text-[#1C322D]/70 leading-relaxed">
              We built Ajarin to be more than just a habit tracker. It is a mindful space designed specifically to keep your brain sharply focused on studying, day after day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-black/5">
              <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">Daily Habit Check-in</h3>
              <p className="text-[#1C322D]/70 text-sm leading-relaxed">
                Log your study sessions with a single mindful click. Watch your streak grow and let momentum carry you forward.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-black/5">
              <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">Earn Trophies</h3>
              <p className="text-[#1C322D]/70 text-sm leading-relaxed">
                Unlock exclusive badges like the "7-Day Warrior" or "Monthly Master" to decorate your personal trophy case.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-black/5">
              <div className="h-12 w-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-6">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-bold font-serif mb-3">Global Leaderboard</h3>
              <p className="text-[#1C322D]/70 text-sm leading-relaxed">
                See how you stack up against top learners worldwide. Compete healthily to maintain your place at the top.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">Ready to break your limits?</h2>
          <p className="text-lg text-muted-foreground font-serif">Join hundreds of students mastering their study habits.</p>
          <div className="flex justify-center">
            <Link href="/login" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-10 py-6 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none">
                Start Now — It's Free
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground/60 border-t border-white/5 relative z-10">
        <p>© 2026 Ajarin Study Tracker. All rights reserved.</p>
        <p className="mt-1">Designed for deep focus & mindful moments.</p>
      </footer>
    </div>
  );
}
