import { RedirectIfAuthenticated } from "@/components/auth/session-guard";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RedirectIfAuthenticated>
      <div className="h-screen w-full overflow-hidden bg-[#fefefe]">{children}</div>
    </RedirectIfAuthenticated>
  );
};

export default Layout;
