import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { FaTrophy } from "react-icons/fa6";
import { LeaderboardEntry } from "@/actions/leaderboard";

interface LeaderboardTableProps {
  data: LeaderboardEntry[];
  currentUserId: string | null;
}

export function LeaderboardTable({ data, currentUserId }: LeaderboardTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-card text-muted-foreground">
        No students found on the leaderboard yet. Check in to get on the board!
      </div>
    );
  }

  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center">Rank</TableHead>
            <TableHead>Student</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((entry, index) => {
            const isCurrentUser = entry.userId === currentUserId;
            const rank = index + 1;
            
            return (
              <TableRow 
                key={entry.userId}
                className={isCurrentUser ? "bg-primary/5 hover:bg-primary/10" : ""}
              >
                <TableCell className="text-center font-medium">
                  {rank === 1 ? (
                    <FaTrophy className="h-5 w-5 text-yellow-500 mx-auto" />
                  ) : rank === 2 ? (
                    <FaTrophy className="h-5 w-5 text-slate-400 mx-auto" />
                  ) : rank === 3 ? (
                    <FaTrophy className="h-5 w-5 text-amber-600 mx-auto" />
                  ) : (
                    <span className="text-muted-foreground">{rank}</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={entry.user?.image || ""} alt={entry.user?.name || "Student"} />
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                        {entry.user?.name ? entry.user.name.charAt(0).toUpperCase() : "S"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {entry.user?.name || "Anonymous Student"}
                        {isCurrentUser && (
                          <Badge variant="outline" className="ml-2 text-[10px] py-0 h-4 border-primary/50 text-primary">You</Badge>
                        )}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-serif font-bold text-primary text-lg">
                  {entry.points}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
