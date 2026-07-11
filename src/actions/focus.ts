"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function awardFocusPoints() {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    // Add 20 points for completing a Pomodoro session
    await prisma.pointsLog.create({
      data: {
        userId,
        source: "FOCUS_SESSION",
        points: 20,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/focus");
    revalidatePath("/leaderboard");

    return { success: true, pointsEarned: 20 };
  } catch (error) {
    console.error("Error awarding focus points:", error);
    return { error: "Failed to award points" };
  }
}
