import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FaAward } from 'react-icons/fa6';

export interface UserBadgeWithDetails {
  id: string;
  earnedAt: Date;
  badge: {
    name: string;
    description: string;
    icon: string;
  };
}

interface BadgeCaseProps {
  badges: UserBadgeWithDetails[];
}

export function BadgeCase({ badges }: BadgeCaseProps) {
  return (
    <div className="w-full">
      {badges.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted-foreground/30 text-muted-foreground">
          <p className="text-sm font-bold uppercase tracking-widest">No badges yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {badges.map((userBadge) => (
            <div 
              key={userBadge.id} 
              className="flex flex-col items-start p-4 border-2 border-foreground bg-background hover:bg-foreground hover:text-background text-foreground transition-colors group cursor-default"
              title={userBadge.badge.description}
            >
              <div className="text-3xl mb-3 grayscale group-hover:grayscale-0 transition-all duration-300">
                {userBadge.badge.icon}
              </div>
              <h4 className="text-xs font-black uppercase tracking-widest leading-tight">
                {userBadge.badge.name}
              </h4>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
