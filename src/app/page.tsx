import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWIBDate } from "@/lib/date";
import { isSameDay, subDays } from "date-fns";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { ActivityCalendar } from "@/components/dashboard/activity-calendar";
import { CheckInButton } from "@/components/dashboard/checkin-button";
import { Button } from "@/components/ui/button";
import { getUserRank } from "@/actions/leaderboard";
import { FaTrophy } from "react-icons/fa6";
import Link from "next/link";

import { SubmitButton } from "@/components/submit-button";
import { BadgeCase } from "@/components/dashboard/badge-case";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LandingPage } from "@/components/landing-page";

export default async function Home() {
  const session = await auth();

  if (!session?.user?.id) {
    return <LandingPage />;
  }

  const userId = session.user.id;
  const todayWIB = getWIBDate();

  // Fetch streak info
  const streak = await prisma.streak.findUnique({
    where: { userId },
  });

  const currentStreak = streak?.currentStreak || 0;
  const longestStreak = streak?.longestStreak || 0;
  const freezeAvailable = streak?.freezeAvailable || 0;
  
  // Fetch user rank
  const userRank = await getUserRank(userId);

  // Check if already checked in today
  const lastCheckIn = streak?.lastCheckInDate;
  const alreadyCheckedIn = !!lastCheckIn && lastCheckIn.getTime() === todayWIB.getTime();

  // Fetch check-ins for the last 90 days for the calendar
  const ninetyDaysAgo = subDays(todayWIB, 90);
  const checkIns = await prisma.checkIn.findMany({
    where: {
      userId,
      date: {
        gte: ninetyDaysAgo,
      },
    },
    orderBy: { date: 'asc' }
  });

  // Fetch user badges
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: { badge: true },
    orderBy: { earnedAt: 'desc' }
  });

  return (
    <DashboardLayout userName={session.user.name} userImage={session.user.image} activeTab="dashboard">
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4 font-serif">Your Dashboard</h2>
          <StreakCounter 
            currentStreak={currentStreak} 
            longestStreak={longestStreak} 
            freezeAvailable={freezeAvailable} 
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ActivityCalendar checkIns={checkIns} />
          </div>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-serif mb-2">Daily Action</h3>
              <CheckInButton alreadyCheckedIn={alreadyCheckedIn} />
              <p className="text-xs text-center text-muted-foreground">
                Build your study habits one day at a time.
              </p>
            </div>
            
            <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Global Rank</h4>
                <div className="text-2xl font-bold font-serif flex items-center gap-2 mt-1">
                  {userRank ? `#${userRank}` : "Unranked"}
                </div>
              </div>
              <FaTrophy className="h-8 w-8 text-yellow-500 opacity-80" />
            </div>

            <BadgeCase badges={userBadges} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
