"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sideMenu } from "@/module/dashboard/home/data";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import route from "@/util/route";

const labelToPath: Record<string, string> = {
  Home: route.dashboard.home,
  Customers: route.dashboard.customers,
  "Portfolio Management": route.dashboard.portfolioManagement,
  "Risk Management": route.dashboard.riskManagement,
  "Payments & Settlements": route.dashboard.paymentsSettlements,
  "Growth & Marketing": route.dashboard.growthMarketing,
  "Help & Support": route.dashboard.helpSupport,
};

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
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
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition",
                isActive
                  ? "bg-primary-white text-primary-black"
                  : "text-primary-white/90 hover:bg-white/10",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="my-5 border-t border-white/40 md:mt-4" />

      <button className="flex w-full items-center gap-2 rounded-xl bg-alertSoft-error px-3 py-2.5 text-sm font-medium text-alert-error">
        <LogOut className="h-4 w-4" />
        Log out
      </button>
    </aside>
  );
}
