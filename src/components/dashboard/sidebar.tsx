"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ModalRoot } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { sideMenu } from "@/module/dashboard/home/data";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import route from "@/util/route";

const labelToPath: Record<string, string> = {
  Home: route.dashboard.home,
  Customers: route.dashboard.customers,
  "Portfolio Management": route.dashboard.portfolioManagement,
  "Asset Loans": route.dashboard.assetLoans,
  "Smart Contracts": route.dashboard.smartContracts,
  "Risk Management": route.dashboard.riskManagement,
  "Payments & Settlements": route.dashboard.paymentsSettlements,
  "Growth & Marketing": route.dashboard.growthMarketing,
  "Help & Support": route.dashboard.helpSupport,
  "System Settings": route.dashboard.systemSettings,
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = React.useState(false);

  const handleLogoutConfirm = () => {
    setIsLogoutModalOpen(false);
    router.push(route.auth.logout);
  };

  return (
    <>
      <aside className="h-full rounded-xl bg-[linear-gradient(145deg,#1E1E1E_0%,#3f3a1f_45%,#E6CF62_100%)] p-3 text-primary-white shadow-lg md:flex md:flex-col">
        <div className="mb-4 rounded-xl bg-[#C8A159]/25 px-3 py-3 text-center text-xs font-semibold tracking-wide">
          BACK OFFICE MENU PANEL
        </div>

        <nav className="no-scrollbar space-y-1 md:flex-1 md:overflow-y-auto">
          {sideMenu.map((item) => {
            const Icon = item.icon;
            const href = labelToPath[item.label] ?? "#";
            const isActive =
              href !== "#" && (href === "/" ? pathname === "/" : pathname.startsWith(href));

            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition font-semibold",
                  isActive
                    ? "bg-primary-white text-primary-black"
                    : "text-primary-white/90 hover:bg-white/10",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="my-5 border-t border-white/40 md:mt-4" />

        <button
          type="button"
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex w-full items-center gap-2 rounded-xl bg-alertSoft-error px-3 py-2.5 text-sm font-medium text-alert-error"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </aside>

      {isLogoutModalOpen && (
        <ModalRoot
          open={isLogoutModalOpen}
          onOpenChange={setIsLogoutModalOpen}
          showCloseButton={false}
          contentClassName="w-[calc(100%-2rem)] max-w-[560px] rounded-[24px] border-none bg-primary-white p-6 shadow-[0_24px_64px_rgba(0,0,0,0.28)] sm:p-8"
        >
          <div className="space-y-6 text-center sm:space-y-8">
            <div className="space-y-3">
              <h2 className="text-[32px] leading-tight font-bold text-text-black">Logging out?</h2>
              <p className="mx-auto max-w-[420px] text-sm leading-6 text-text-grey">
                You are about to log out of this back-office session. You&apos;ll have to log back
                in to continue.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="grey-stroke"
                className="w-full sm:flex-1"
                onClick={() => setIsLogoutModalOpen(false)}
              >
                No, Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                className="w-full sm:flex-1"
                onClick={handleLogoutConfirm}
              >
                Yes, Confirm
              </Button>
            </div>
          </div>
        </ModalRoot>
      )}
    </>
  );
}
