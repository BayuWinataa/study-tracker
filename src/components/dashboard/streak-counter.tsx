import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaFire, FaSnowflake, FaTrophy } from 'react-icons/fa6';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  freezeAvailable: number;
}

export function StreakCounter({ currentStreak, longestStreak, freezeAvailable }: StreakCounterProps) {
  const hasStreak = currentStreak > 0;
  return (
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b-2 border-foreground pb-8 gap-8">
      
      {/* Current Streak */}
      <div className="flex-1">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-2">
          Current Streak
        </h3>
        <div className="flex items-end gap-3">
          <span className={`text-7xl md:text-8xl font-black leading-none tracking-tighter ${hasStreak ? 'text-foreground' : 'text-muted-foreground/30'}`}>
            {currentStreak}
          </span>
          <span className="text-xl font-bold uppercase tracking-widest text-muted-foreground pb-2">
            Days
          </span>
        </div>
      </div>

      <div className="flex gap-12">
        {/* Longest Streak */}
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Personal Best
          </h3>
          <span className="text-4xl font-black text-foreground">
            {longestStreak}
          </span>
        </div>

        {/* Freeze Tokens */}
        <div className="text-right">
          <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">
            Freeze Tokens
          </h3>
          <span className={`text-4xl font-black ${freezeAvailable > 0 ? 'text-foreground' : 'text-muted-foreground/30'}`}>
            {freezeAvailable}
          </span>
        </div>
      </div>
      
    </div>
  );
}
