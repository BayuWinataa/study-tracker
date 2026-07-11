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
      <div className="space-y-12">
        <div className="border-b-2 border-foreground pb-8">
          <h2 className="text-4xl md:text-5xl font-black font-sans uppercase tracking-tight mb-4">Global Leaderboard</h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl">
            Top students based on {period === "all-time" ? "all-time" : "weekly"} points. Keep your streak alive to climb the ranks!
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-start mb-8">
          <div className="border-2 border-foreground p-1 inline-flex bg-background">
            <a 
              href="?period=weekly"
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                period === "weekly" ? "bg-foreground text-background" : "text-foreground hover:bg-foreground/10"
              }`}
            >
              Weekly
            </a>
            <a 
              href="?period=all-time"
              className={`px-6 py-3 text-xs font-black uppercase tracking-widest transition-colors ${
                period === "all-time" ? "bg-foreground text-background" : "text-foreground hover:bg-foreground/10"
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
