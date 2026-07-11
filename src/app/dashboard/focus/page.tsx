import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { FocusTimer } from "@/components/dashboard/focus-timer";

export default async function FocusPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <DashboardLayout userName={session.user.name} userImage={session.user.image} activeTab="focus">
      <div className="space-y-12">
        <section className="border-b border-border pb-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-sans tracking-tight text-foreground uppercase">
            Focus Room
          </h1>
          <p className="text-lg text-muted-foreground mt-4 font-medium max-w-2xl">
            Block out the noise. Every 25-minute work session earns you +20 Points. No shortcuts.
          </p>
        </section>

        <section className="flex justify-center items-center py-8">
          <FocusTimer />
        </section>
      </div>
    </DashboardLayout>
  );
}
