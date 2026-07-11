"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { startOfWeekWIB, getWIBDate } from "@/lib/date";

export async function getWeeklyPointsData() {
  const session = await auth();
  if (!session?.user?.id) {
    return { data: [] };
  }

  const userId = session.user.id;
  const now = new Date();
  
  // Get start of the current week (Monday)
  const startOfWeek = startOfWeekWIB(now);
  
  // Get points for the current week
  const pointsLogs = await prisma.pointsLog.findMany({
    where: {
      userId,
      createdAt: {
        gte: startOfWeek,
      },
    },
    select: {
      points: true,
      createdAt: true,
    }
  });

  // Aggregate by day of week (Monday to Sunday)
  const days = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];
  
  const aggregatedData = days.map(day => ({
    day,
    points: 0,
  }));

  pointsLogs.forEach(log => {
    // Convert UTC createdAt to WIB Date
    const wibDate = getWIBDate(log.createdAt);
    
    // getUTCDay() returns 0 for Sunday, 1 for Monday, etc.
    let dayIndex = wibDate.getUTCDay() - 1; 
    if (dayIndex === -1) dayIndex = 6; // Sunday is the last day in our array

    if (dayIndex >= 0 && dayIndex < 7) {
      aggregatedData[dayIndex].points += log.points;
    }
  });

  return { data: aggregatedData };
}
