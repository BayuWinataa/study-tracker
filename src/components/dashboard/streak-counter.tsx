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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Current Streak */}
      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Current Streak</CardTitle>
          <FaFire className={`h-12 w-12 ${hasStreak ? 'text-orange-500' : 'text-gray-400'} drop-shadow-sm transition-colors duration-500`} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-serif">{currentStreak}</div>
          <p className="text-xs text-muted-foreground mt-1">Days in a row</p>
        </CardContent>
      </Card>

      {/* Longest Streak */}
      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Longest Streak</CardTitle>
          <FaTrophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-serif">{longestStreak}</div>
          <p className="text-xs text-muted-foreground mt-1">Personal best</p>
        </CardContent>
      </Card>

      {/* Freeze Token */}
      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Freeze Tokens</CardTitle>
          <FaSnowflake className={`h-5 w-5 ${freezeAvailable > 0 ? 'text-blue-300' : 'text-muted-foreground'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold font-serif">{freezeAvailable}</div>
          <p className="text-xs text-muted-foreground mt-1">Available to save streak</p>
        </CardContent>
      </Card>
    </div>
  );
}
