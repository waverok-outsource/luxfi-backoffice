import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import route from "@/util/route";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (token) {
    redirect(route.dashboard.home);
  }

  return <div className="h-screen w-full overflow-hidden bg-[#fefefe]">{children}</div>;
};

export default Layout;
