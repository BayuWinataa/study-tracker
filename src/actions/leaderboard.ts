"use server";

import { prisma } from "@/lib/prisma";
import { startOfWeekWIB } from "@/lib/date";

export type LeaderboardEntry = {
  userId: string;
  points: number;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  } | undefined;
};

export async function getLeaderboard(period: 'weekly' | 'all-time'): Promise<LeaderboardEntry[]> {
  const whereClause = period === 'weekly' ? {
    createdAt: { gte: startOfWeekWIB(new Date()) }
  } : {};

  try {
    const leaderboardData = await prisma.pointsLog.groupBy({
      by: ['userId'],
      where: whereClause,
      _sum: {
        points: true,
      },
      orderBy: {
        _sum: {
          points: 'desc',
        },
      },
      take: 100,
    });

    const userIds = leaderboardData.map(l => l.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true },
    });

    return leaderboardData.map((l) => ({
      userId: l.userId,
      points: l._sum.points || 0,
      user: users.find((u) => u.id === l.userId),
    }));
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    return [];
  }
}

export async function getUserRank(userId: string): Promise<number | null> {
  try {
    // Note: Prisma raw queries with dynamic schema might need explicit cast.
    // Using a raw SQL query to calculate rank efficiently.
    const result: any[] = await prisma.$queryRaw`
      WITH UserPoints AS (
        SELECT "userId", SUM(points) as "totalPoints"
        FROM "PointsLog"
        GROUP BY "userId"
      ),
      RankedUsers AS (
        SELECT "userId", "totalPoints",
               RANK() OVER (ORDER BY "totalPoints" DESC) as rank
        FROM UserPoints
      )
      SELECT rank FROM RankedUsers WHERE "userId" = ${userId}
    `;

    if (result && result.length > 0) {
      // rank returned as BigInt by Postgres, convert to Number
      return Number(result[0].rank);
    }
    return null;
  } catch (error) {
    console.error("User rank fetch error:", error);
    return null;
  }
}
