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
    <Card className="bg-card text-card-foreground border border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-serif font-bold text-primary flex items-center gap-2">
          <FaAward className="h-5 w-5" />
          Trophy Case
        </CardTitle>
      </CardHeader>
      <CardContent>
        {badges.length === 0 ? (
          <div className="text-center py-6 px-4 bg-muted/20 rounded-lg border border-dashed border-muted-foreground/30">
            <FaAward className="h-6 w-6 text-muted-foreground mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium text-muted-foreground">No badges yet</p>
            <p className="text-xs text-muted-foreground mt-1">Keep checking in to earn your first badge!</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {badges.map((userBadge) => (
              <div 
                key={userBadge.id} 
                className="flex flex-col items-center justify-center p-3 bg-secondary/10 hover:bg-secondary/20 transition-colors rounded-lg border border-border text-center group cursor-default"
                title={userBadge.badge.description}
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                  {userBadge.badge.icon}
                </div>
                <h4 className="text-xs font-bold leading-tight font-serif text-card-foreground/90 mt-1">
                  {userBadge.badge.name}
                </h4>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
