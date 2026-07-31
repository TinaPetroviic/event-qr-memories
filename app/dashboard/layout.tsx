import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-cream-50">
      <DashboardNav email={user.email ?? ""} />
      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6">{children}</div>
    </div>
  );
}
