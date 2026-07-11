"use client";

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { checkIn } from '@/actions/streak';
import { toast } from 'sonner';
import { FaCircleCheck, FaSpinner, FaWandMagicSparkles } from 'react-icons/fa6';
import confetti from 'canvas-confetti';

interface CheckInButtonProps {
  alreadyCheckedIn: boolean;
  onSuccess?: () => void;
}

export function CheckInButton({ alreadyCheckedIn, onSuccess }: CheckInButtonProps) {
  const [isPending, startTransition] = useTransition();

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const handleCheckIn = () => {
    startTransition(async () => {
      const result = await checkIn();
      if (result.success) {
        if ('status' in result && result.status === 'IDEMPOTENT') {
          toast.info("Already checked in today!", {
            description: "Come back tomorrow to keep the streak going."
          });
        } else {
          const res = result as any;
          triggerConfetti();
          toast.success("Check-in successful!", {
            description: `You earned 10 points. Current streak: ${res.newStreak}🔥`,
            icon: <FaCircleCheck className="h-5 w-5 text-primary" />
          });

          if (res.freezeUsed) {
            toast("Freeze Token used!", {
              description: "You missed yesterday, but your freeze token saved your streak! ❄️",
            });
          }

          if (res.bonusAwarded) {
            toast.success("Bonus Points!", {
              description: "You hit a 7-day milestone and earned 50 bonus points! 🎁",
            });
          }
          
          if (res.newBadges && res.newBadges.length > 0) {
            res.newBadges.forEach((badge: any) => {
              toast("Achievement Unlocked!", {
                description: `You earned a new badge: ${badge.name} ${badge.icon}`,
                icon: <span className="text-2xl">{badge.icon}</span>,
              });
            });
          }
          
          if (onSuccess) onSuccess();
        }
      } else {
        const err = result as any;
        toast.error("Check-in failed", {
          description: err.error || "An unexpected error occurred."
        });
      }
    });
  };

  if (alreadyCheckedIn) {
    return (
      <div className="w-full py-5 px-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 flex items-center justify-center gap-2 text-green-700 dark:text-green-400 font-bold shadow-sm">
          <FaCircleCheck className="mr-2 h-4 w-4" />
        Checked In Today!
      </div>
    );
  }

  return (
    <Button 
      onClick={handleCheckIn} 
      disabled={isPending}
      className="w-full py-7 text-lg font-bold shadow-lg transition-all duration-300 relative overflow-hidden group bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      {/* Animated gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_2s_infinite]" />
      
      {isPending ? (
        <span className="flex items-center gap-2">
          <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
          Processing Check-in...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <FaWandMagicSparkles className="mr-2 h-4 w-4" />
          Check-In Now!
        </span>
      )}
    </Button>
  );
}
