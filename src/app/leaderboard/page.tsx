import { auth, signIn } from "@/lib/auth";
import { getLeaderboard } from "@/actions/leaderboard";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { LeaderboardTable } from "@/components/dashboard/leaderboard-table";
import { SubmitButton } from "@/components/submit-button";
import { LandingPage } from "@/components/landing-page";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const session = await auth();

  if (!session?.user?.id) {
    return <LandingPage />;
  }

  // Handle searchParams safely
  const params = await searchParams;
  const period = params?.period === "all-time" ? "all-time" : "weekly";
  const leaderboardData = await getLeaderboard(period);

  return (
    <DashboardLayout userName={session.user.name} userImage={session.user.image} activeTab="leaderboard">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold font-serif mb-2">Global Leaderboard</h2>
          <p className="text-muted-foreground">
            Top students based on {period === "all-time" ? "all-time" : "weekly"} points. Keep your streak alive to climb the ranks!
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-start mb-4">
          <div className="bg-secondary rounded-full p-1 inline-flex">
            <a 
              href="?period=weekly"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                period === "weekly" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Weekly
            </a>
            <a 
              href="?period=all-time"
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                period === "all-time" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All-Time
            </a>
          </div>
        </div>

        <LeaderboardTable data={leaderboardData} currentUserId={session.user.id} />
      </div>
    </DashboardLayout>
  );
}
