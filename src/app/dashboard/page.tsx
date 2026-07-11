import { auth, signIn, signOut } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getWIBDate } from "@/lib/date";
import { isSameDay, subDays } from "date-fns";
import { StreakCounter } from "@/components/dashboard/streak-counter";
import { ActivityCalendar } from "@/components/dashboard/activity-calendar";
import { CheckInButton } from "@/components/dashboard/checkin-button";
import { getUserRank } from "@/actions/leaderboard";
import { BadgeCase } from "@/components/dashboard/badge-case";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
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

  // Fetch all available badges
  const allBadges = await prisma.badge.findMany({
    orderBy: { id: 'asc' }
  });

  return (
    <DashboardLayout userName={session.user.name} userImage={session.user.image} activeTab="dashboard">
      <div className="space-y-16">

        {/* Header Section */}
        <section className="border-b border-border pb-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-foreground">
            Welcome back, {session.user.name?.split(" ")[0] || "Student"}.
          </h1>
          <p className="text-lg text-muted-foreground mt-4 font-medium max-w-2xl">
            This is your personal command center. Track your habits, maintain your streak, and build discipline every single day.
          </p>
        </section>

        {/* Top Analytics (Streak & Stats) */}
        <section>
          <StreakCounter
            currentStreak={currentStreak}
            longestStreak={longestStreak}
            freezeAvailable={freezeAvailable}
          />
        </section>

        {/* Action & Calendar Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-border pt-12">

          {/* Left Column: Action */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-12">
            <div>
              <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-foreground mb-6">
                Daily Action
              </h2>
              <CheckInButton alreadyCheckedIn={alreadyCheckedIn} />
            </div>

            <div>
              <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-foreground mb-6">
                Global Status
              </h2>
              <div className="flex items-end justify-between border-b-2 border-primary pb-4">
                <span className="text-lg font-medium text-muted-foreground uppercase tracking-wide">Rank</span>
                <span className="text-4xl font-black text-foreground">
                  {userRank ? `#${userRank}` : "—"}
                </span>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-foreground mb-6">
                Achievements
              </h2>
              <BadgeCase badges={userBadges} allBadges={allBadges} />
            </div>
          </div>

          {/* Right Column: Calendar */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h2 className="text-xl font-bold font-sans uppercase tracking-widest text-foreground mb-6">
              Consistency Map
            </h2>
            <ActivityCalendar checkIns={checkIns} />
          </div>

        </section>
      </div>
    </DashboardLayout>
  );
}
