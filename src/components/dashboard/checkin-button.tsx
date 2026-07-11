"use client";

import React, { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { checkIn } from '@/actions/streak';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa6';

interface CheckInButtonProps {
  alreadyCheckedIn: boolean;
  onSuccess?: () => void;
}

export function CheckInButton({ alreadyCheckedIn, onSuccess }: CheckInButtonProps) {
  const [isPending, startTransition] = useTransition();

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
          toast.success("Check-in successful!", {
            description: `You earned 10 points. Current streak: ${res.newStreak}🔥`,
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
      <div className="w-full py-6 px-4 border-2 border-foreground bg-foreground text-background flex flex-col items-center justify-center gap-1">
        <span className="text-xl font-black uppercase tracking-widest">Logged</span>
        <span className="text-xs font-bold uppercase tracking-widest opacity-70">See you tomorrow</span>
      </div>
    );
  }

  return (
    <button 
      onClick={handleCheckIn} 
      disabled={isPending}
      className="w-full py-6 border-2 border-foreground bg-background hover:bg-foreground hover:text-background text-foreground transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
    >
      {isPending ? (
        <span className="flex items-center gap-3 text-lg font-black uppercase tracking-widest">
          <FaSpinner className="h-5 w-5 animate-spin" />
          Processing
        </span>
      ) : (
        <span className="flex items-center gap-3 text-lg font-black uppercase tracking-widest group-hover:scale-105 transition-transform">
          Log Today's Session
        </span>
      )}
    </button>
  );
}
