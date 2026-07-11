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
    <aside className="w-64 bg-background border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex shrink-0 z-20">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-sans font-bold text-primary tracking-tight">Ajarin.</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Link href="/">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-4 rounded-none border-l-4 transition-all duration-200 ${
              activeTab === "dashboard" 
                ? "border-foreground bg-foreground text-background font-black uppercase tracking-widest" 
                : "border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground font-bold uppercase tracking-widest"
            }`}
            size="lg"
          >
            <FaTableColumns className="h-5 w-5" />
            Dashboard
          </Button>
        </Link>

        <Link href="/leaderboard">
          <Button
            variant="ghost"
            className={`w-full justify-start gap-4 rounded-none border-l-4 transition-all duration-200 ${
              activeTab === "leaderboard" 
                ? "border-foreground bg-foreground text-background font-black uppercase tracking-widest" 
                : "border-transparent text-muted-foreground hover:bg-foreground/5 hover:text-foreground font-bold uppercase tracking-widest"
            }`}
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
