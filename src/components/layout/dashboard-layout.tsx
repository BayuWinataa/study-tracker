import React from "react";
import { Sidebar } from "./sidebar";
import Link from "next/link";
import { FaArrowRightFromBracket, FaTableColumns, FaTrophy } from "react-icons/fa6";
import { signOut } from "@/lib/auth";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userName: string | null | undefined;
  userImage?: string | null | undefined;
  activeTab: "dashboard" | "leaderboard";
}

export function DashboardLayout({ children, userName, userImage, activeTab }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <Sidebar userName={userName} activeTab={activeTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navbar for Profile */}
        <header className="flex items-center justify-between p-4 border-b border-border bg-card shadow-sm z-10 shrink-0">
          <div className="flex items-center">
            {/* Mobile Logo */}
            <span className="md:hidden text-xl font-serif font-bold text-primary">Ajarin.</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-secondary/50 py-1.5 px-3 rounded-full border border-border/50">
              <Avatar className="h-6 w-6 border border-border/50">
                <AvatarImage src={userImage || ""} alt={userName || "User"} />
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {userName ? userName.charAt(0).toUpperCase() : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground hidden sm:block">
                {userName || "Student"}
              </span>
            </div>
            
            {/* Mobile Sign Out */}
            <form
              className="md:hidden ml-1"
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button className="text-muted-foreground hover:text-destructive p-2 transition-colors" type="submit" aria-label="Sign Out">
                <FaArrowRightFromBracket className="h-5 w-5" />
              </button>
            </form>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
          <div className="max-w-4xl mx-auto w-full">
            {children}
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around p-3 pb-safe z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
          <Link href="/" className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-primary' : 'text-muted-foreground'}`}>
            <FaTableColumns className="h-5 w-5" />
            <span className="text-[10px] font-medium">Dashboard</span>
          </Link>
          <Link href="/leaderboard" className={`flex flex-col items-center gap-1 ${activeTab === 'leaderboard' ? 'text-primary' : 'text-muted-foreground'}`}>
            <FaTrophy className="h-5 w-5" />
            <span className="text-[10px] font-medium">Leaderboard</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}
