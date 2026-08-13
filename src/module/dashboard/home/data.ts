import { AlertTriangle, Headset, Megaphone, ShoppingCart } from "lucide-react";
import type { ElementType, SVGProps } from "react";
import AssetLoanIcon from "@/components/icon/sidebar/asset";
import AssetManagementIcon from "@/components/icon/sidebar/asset-management";
import Contracts from "@/components/icon/sidebar/contracts";
import CustomerIcon from "@/components/icon/sidebar/customer";
import HomeIcon from "@/components/icon/sidebar/home";
import PaymentIcon from "@/components/icon/sidebar/payment";
import SettingsIcon from "@/components/icon/sidebar/settings";

export type SidebarMenuItem = {
  label: string;
  icon: ElementType<SVGProps<SVGSVGElement>>;
  active?: boolean;
};

export const sideMenu: SidebarMenuItem[] = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Customers", icon: CustomerIcon },
  { label: "MarketPlace", icon: ShoppingCart },
  { label: "Asset Management", icon: AssetManagementIcon },
  { label: "Asset Loans", icon: AssetLoanIcon },
  { label: "Smart Contracts", icon: Contracts },
  { label: "Risk Management", icon: AlertTriangle },
  { label: "Payments & Settlements", icon: PaymentIcon },
  { label: "Growth & Marketing", icon: Megaphone },
  { label: "Help & Support", icon: Headset },
  { label: "System Settings", icon: SettingsIcon },
];
