import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { FaTableColumns, FaTrophy, FaArrowRightFromBracket, FaBookOpen } from "react-icons/fa6";

interface SidebarProps {
  userName: string | null | undefined;
  activeTab: "dashboard" | "leaderboard";
}

export function Sidebar({ userName, activeTab }: SidebarProps) {
  return (
    <aside className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex shrink-0 shadow-sm z-20">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <FaBookOpen className="h-6 w-6 text-primary" />
          <span className="text-2xl font-serif font-bold text-primary tracking-tight">Ajarin</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link href="/">
          <Button
            variant={activeTab === "dashboard" ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 ${activeTab === "dashboard" ? "font-bold" : "text-muted-foreground hover:text-foreground"}`}
            size="lg"
          >
            <FaTableColumns className="h-5 w-5" />
            Dashboard
          </Button>
        </Link>

        <Link href="/leaderboard">
          <Button
            variant={activeTab === "leaderboard" ? "secondary" : "ghost"}
            className={`w-full justify-start gap-3 ${activeTab === "leaderboard" ? "font-bold" : "text-muted-foreground hover:text-foreground"}`}
            size="lg"
          >
            <FaTrophy className="h-5 w-5" />
            Leaderboard
          </Button>
        </Link>
      </nav>

      {/* User Info & Sign Out */}
      <div className="p-4 border-t border-border bg-muted/10">
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="outline" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-colors" type="submit">
            <FaArrowRightFromBracket className="h-5 w-5 mr-2" />
            Sign Out
          </Button>
        </form>
      </div>
    </aside>
  );
}
