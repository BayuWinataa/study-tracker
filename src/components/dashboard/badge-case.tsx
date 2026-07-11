import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaAward } from 'react-icons/fa6';

export interface UserBadgeWithDetails {
  id: string;
  earnedAt: Date;
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
}

interface BadgeCaseProps {
  badges: UserBadgeWithDetails[];
  allBadges?: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }[];
}

export function BadgeCase({ badges, allBadges = [] }: BadgeCaseProps) {
  if (allBadges.length === 0) {
    return (
      <div className="text-center py-8 border-2 border-dashed border-muted-foreground/30 text-muted-foreground">
        <p className="text-sm font-bold uppercase tracking-widest">No badges available</p>
      </div>
    );
  }

  // Sort badges: Earned first, then by ID
  const sortedBadges = [...allBadges].sort((a, b) => {
    const aEarned = badges.some((ub) => ub.badge.id === a.id);
    const bEarned = badges.some((ub) => ub.badge.id === b.id);
    if (aEarned && !bEarned) return -1;
    if (!aEarned && bEarned) return 1;
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sortedBadges.map((badge) => {
          const isEarned = badges.some((b) => b.badge.id === badge.id);

          return (
            <div 
              key={badge.id} 
              className={`flex flex-col items-start p-4 border-2 transition-colors group cursor-default ${
                isEarned 
                  ? "border-foreground bg-background hover:bg-foreground hover:text-background text-foreground" 
                  : "border-muted-foreground/30 bg-background text-muted-foreground/60"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3">
                <div className={`text-3xl transition-all duration-300 ${isEarned ? "grayscale group-hover:grayscale-0" : "grayscale opacity-50"}`}>
                  {badge.icon}
                </div>
                {!isEarned && (
                  <span className="text-[10px] font-bold uppercase tracking-widest border border-muted-foreground/30 px-2 py-0.5">
                    Locked
                  </span>
                )}
              </div>
              <h4 className="text-sm font-black uppercase tracking-widest leading-tight mb-2">
                {badge.name}
              </h4>
              <p className={`text-xs font-medium leading-snug ${isEarned ? "group-hover:text-background/80" : ""}`}>
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
