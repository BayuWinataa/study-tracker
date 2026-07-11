"use server";

import { prisma } from "@/lib/prisma";
import { getWIBDate } from "@/lib/date";
import { calculateNewStreak } from "@/lib/streak-logic";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function checkIn() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }
  const userId = session.user.id;

  try {
    const todayWIB = getWIBDate();

    // Run transaction
    const result = await prisma.$transaction(async (tx) => {
      // Get or create streak
      const streak = await tx.streak.upsert({
        where: { userId },
        update: {},
        create: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
          freezeAvailable: 1, // Default from schema
        },
      });

      // Calculate new streak
      const calcResult = calculateNewStreak(
        streak.lastCheckInDate,
        todayWIB,
        streak.currentStreak,
        streak.freezeAvailable
      );

      if (calcResult.status === "IDEMPOTENT") {
        return { success: true, message: "Already checked in today", status: calcResult.status };
      }

      // Record CheckIn
      await tx.checkIn.create({
        data: {
          userId,
          date: todayWIB,
        },
      });

      // Update Streak
      const longestStreak = Math.max(streak.longestStreak, calcResult.currentStreak);
      await tx.streak.update({
        where: { userId },
        data: {
          currentStreak: calcResult.currentStreak,
          longestStreak,
          lastCheckInDate: todayWIB,
          freezeAvailable: calcResult.freezeAvailable,
        },
      });

      // Add Base Points
      await tx.pointsLog.create({
        data: {
          userId,
          source: "CHECK_IN",
          points: 10,
        },
      });

      let bonusAwarded = false;
      // Add Bonus Points if multiple of 7
      if (calcResult.currentStreak > 0 && calcResult.currentStreak % 7 === 0) {
        await tx.pointsLog.create({
          data: {
            userId,
            source: "STREAK_BONUS",
            points: 50,
          },
        });
        bonusAwarded = true;
      }

      const newBadges: { name: string, icon: string }[] = [];
      
      // Helper to award a badge
      const checkAndAwardBadge = async (code: string) => {
        const badge = await tx.badge.findUnique({ where: { code } });
        if (badge) {
          const existingUserBadge = await tx.userBadge.findUnique({
            where: { userId_badgeId: { userId, badgeId: badge.id } }
          });
          if (!existingUserBadge) {
            await tx.userBadge.create({
              data: { userId, badgeId: badge.id }
            });
            newBadges.push({ name: badge.name, icon: badge.icon });
          }
        }
      };

      if (!streak.lastCheckInDate) {
        await checkAndAwardBadge("FIRST_CHECKIN");
      }
      
      if (calcResult.currentStreak >= 7) {
        await checkAndAwardBadge("STREAK_7");
      }
      
      if (calcResult.currentStreak >= 30) {
        await checkAndAwardBadge("STREAK_30");
      }

      return {
        success: true,
        message: "Check-in successful",
        status: calcResult.status,
        newStreak: calcResult.currentStreak,
        freezeUsed: calcResult.freezeUsed,
        bonusAwarded,
        newBadges,
      };
    });

    revalidatePath('/');
    return result;
  } catch (error: any) {
    console.error("Check-in error:", error);
    return { success: false, error: "Failed to process check-in" };
  }
}

export async function getUserStreak() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const userId = session.user.id;

  try {
    const streak = await prisma.streak.findUnique({
      where: { userId },
    });
    return streak;
  } catch (error) {
    console.error("Error fetching streak:", error);
    return null;
  }
}
