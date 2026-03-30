import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopHeader } from "@/components/dashboard/nav-bar";
import route from "@/util/route";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect(route.auth.login);
  }

  return (
    <div className="h-screen overflow-hidden bg-primary-white px-2 pt-1 pb-2">
      <div className="grid h-full grid-rows-[auto_1fr] gap-1 overflow-hidden rounded-3xl bg-primary-white">
        <div className="shrink-0">
          <DashboardTopHeader />
        </div>

        <div className="grid min-h-0 items-stretch gap-3 md:grid-cols-[250px_minmax(0,1fr)]">
          <DashboardSidebar />
          <main className="no-scrollbar min-h-0 min-w-0 overflow-y-auto pr-1">
            <section className="rounded-3xl bg-[#F3F3F3] p-3 md:p-4">{children}</section>
          </main>
        </div>
      </div>
    </div>
  );
}
