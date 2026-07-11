import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/actions/leaderboard";

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  currentUserId: string | null;
}

export function LeaderboardTable({ data, currentUserId }: LeaderboardTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-foreground/30 text-muted-foreground">
        <p className="text-sm font-bold uppercase tracking-widest">No students found yet</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b-2 border-foreground mb-4">
        <div className="w-16 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Rank</div>
        <div className="flex-1 text-xs font-bold uppercase tracking-widest text-muted-foreground">Student</div>
        <div className="text-right text-xs font-bold uppercase tracking-widest text-muted-foreground">Points</div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-3">
        {data.map((entry, index) => {
          const isCurrentUser = entry.userId === currentUserId;
          const rank = index + 1;
          
          return (
            <div 
              key={entry.userId}
              className={`flex items-center px-4 py-4 border-2 transition-colors ${
                isCurrentUser 
                  ? "border-foreground bg-foreground text-background" 
                  : "border-border hover:border-foreground/50 bg-background text-foreground"
              }`}
            >
              <div className="w-16 text-center font-black text-2xl">
                {rank}
              </div>
              <div className="flex-1 flex items-center gap-4">
                <Avatar className={`h-12 w-12 border-2 rounded-none ${isCurrentUser ? 'border-background' : 'border-foreground'}`}>
                  <AvatarImage src={entry.user?.image || ""} alt={entry.user?.name || "Student"} className="rounded-none object-cover" />
                  <AvatarFallback className="bg-transparent font-bold rounded-none">
                    {entry.user?.name ? entry.user.name.charAt(0).toUpperCase() : "S"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-bold text-lg uppercase tracking-wide">
                    {entry.user?.name || "Anonymous Student"}
                  </span>
                  {isCurrentUser && (
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">
                      You
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right font-black text-3xl tracking-tighter">
                {entry.points}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
