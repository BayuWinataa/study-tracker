"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaPlay, FaPause, FaArrowRotateRight } from "react-icons/fa6";
import { awardFocusPoints } from "@/actions/focus";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type TimerMode = "WORK" | "SHORT_BREAK" | "LONG_BREAK";

const MODES = {
  WORK: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
};

export function FocusTimer() {
  const [mode, setMode] = useState<TimerMode>("WORK");
  const [timeLeft, setTimeLeft] = useState(MODES.WORK);
  const [isActive, setIsActive] = useState(false);
  const [isPendingAward, setIsPendingAward] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode]);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode]);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      handleTimerComplete();
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    if (mode === "WORK") {
      setIsPendingAward(true);
      // Trigger confetti
      const end = Date.now() + 3 * 1000;
      const colors = ['#000000', '#ffffff', '#cccccc'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());

      const result = await awardFocusPoints();
      setIsPendingAward(false);
      
      if (result.success) {
        toast.success(`Session Complete! +${result.pointsEarned} Points earned.`);
      } else {
        toast.error("Session completed, but failed to award points.");
      }
    } else {
      toast.info("Break is over. Back to work!");
    }
  };

  // Format mm:ss
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div className="flex flex-col items-center justify-center p-8 py-16 border-4 border-foreground w-full max-w-4xl mx-auto bg-background text-foreground shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:shadow-[12px_12px_0px_0px_rgba(255,255,255,1)]">
      
      {/* Mode Selectors */}
      <div className="flex flex-wrap items-center justify-center gap-4 mb-16 w-full">
        <Button 
          variant={mode === "WORK" ? "default" : "outline"}
          className={`rounded-none border-2 border-foreground font-black uppercase tracking-widest px-6 py-6 ${mode === "WORK" ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background transition-colors"}`}
          onClick={() => switchMode("WORK")}
        >
          Pomodoro
        </Button>
        <Button 
          variant={mode === "SHORT_BREAK" ? "default" : "outline"}
          className={`rounded-none border-2 border-foreground font-black uppercase tracking-widest px-6 py-6 ${mode === "SHORT_BREAK" ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background transition-colors"}`}
          onClick={() => switchMode("SHORT_BREAK")}
        >
          Short Break
        </Button>
        <Button 
          variant={mode === "LONG_BREAK" ? "default" : "outline"}
          className={`rounded-none border-2 border-foreground font-black uppercase tracking-widest px-6 py-6 ${mode === "LONG_BREAK" ? "bg-foreground text-background" : "hover:bg-foreground hover:text-background transition-colors"}`}
          onClick={() => switchMode("LONG_BREAK")}
        >
          Long Break
        </Button>
      </div>

      {/* Timer Display */}
      <div className="text-[6rem] sm:text-[10rem] md:text-[12rem] font-black tracking-tighter leading-none mb-16 select-none tabular-nums">
        {minutes}:{seconds}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8">
        <Button
          onClick={toggleTimer}
          disabled={isPendingAward || timeLeft === 0}
          className="rounded-full w-24 h-24 sm:w-28 sm:h-28 border-4 border-foreground bg-foreground text-background hover:bg-background hover:text-foreground transition-all flex items-center justify-center group"
        >
          {isActive ? (
            <FaPause className="h-10 w-10 sm:h-12 sm:w-12 group-hover:scale-95 transition-transform" />
          ) : (
            <FaPlay className="h-10 w-10 sm:h-12 sm:w-12 ml-2 group-hover:scale-95 transition-transform" />
          )}
        </Button>
        
        <Button
          onClick={resetTimer}
          disabled={isPendingAward}
          variant="outline"
          className="rounded-full w-16 h-16 sm:w-20 sm:h-20 border-4 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background transition-all flex items-center justify-center group"
        >
          <FaArrowRotateRight className="h-6 w-6 sm:h-8 sm:w-8 group-hover:-rotate-90 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
