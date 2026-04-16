import { AlertTriangle, Headset, Megaphone } from "lucide-react";
import type { ElementType, SVGProps } from "react";
import AssetLoanIcon from "@/components/icon/sidebar/asset";
import Contracts from "@/components/icon/sidebar/contracts";
import CustomerIcon from "@/components/icon/sidebar/customer";
import HomeIcon from "@/components/icon/sidebar/home";
import PaymentIcon from "@/components/icon/sidebar/payment";
import PortfolioIcon from "@/components/icon/sidebar/portfolio";
import SettingsIcon from "@/components/icon/sidebar/settings";

export type SidebarMenuItem = {
  label: string;
  icon: ElementType<SVGProps<SVGSVGElement>>;
  active?: boolean;
};

export const sideMenu: SidebarMenuItem[] = [
  { label: "Home", icon: HomeIcon, active: true },
  { label: "Customers", icon: CustomerIcon },
  { label: "Portfolio Management", icon: PortfolioIcon },
  { label: "Asset Loans", icon: AssetLoanIcon },
  { label: "Smart Contracts", icon: Contracts },
  { label: "Risk Management", icon: AlertTriangle },
  { label: "Payments & Settlements", icon: PaymentIcon },
  { label: "Growth & Marketing", icon: Megaphone },
  { label: "Help & Support", icon: Headset },
  { label: "System Settings", icon: SettingsIcon },
];

export type StatCard = {
  title: string;
  value: string;
  trend: string;
  period: string;
  tone: "positive" | "negative";
};

export const stats: StatCard[] = [
  {
    title: "Total Inflow",
    value: "$ 400,820,000.00",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Total Outflow",
    value: "$ 224,200,000.00",
    trend: "-10%",
    period: "Last 7 days",
    tone: "negative",
  },
  {
    title: "Total Assets Inventory",
    value: "1,723",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Total Customers",
    value: "2,269",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Verified Customers",
    value: "1,290",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Total Loan Disbursed",
    value: "$2,960,000",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  {
    title: "Total Loan Repaid",
    value: "$4,820,000",
    trend: "67%",
    period: "Last 7 days",
    tone: "positive",
  },
  { title: "Active Loans", value: "312", trend: "67%", period: "Last 7 days", tone: "positive" },
  {
    title: "Near Liquidations",
    value: "27",
    trend: "-10%",
    period: "Last 7 days",
    tone: "negative",
  },
];

export const activityFeed = [
  { message: "Loan #LN-2031 has been approved ($7,500)", period: "Today", time: "10:42 AM" },
  { message: "Asset revalued (Rolex Submariner +4.2%)", period: "Today", time: "09:23 AM" },
  { message: "KYC approved - Customer #CU-889", period: "Today", time: "05:25 AM" },
  { message: "Smart contract executed - SC-118", period: "Yesterday", time: "10:25 PM" },
];

export type RiskAlert = {
  label: string;
  tone: "critical" | "urgent" | "priority";
};

export const riskAlerts: RiskAlert[] = [
  { label: "9 loans above liquidation LTV (>=75%)", tone: "critical" },
  { label: "18 loans overdue (7-30 days)", tone: "urgent" },
  { label: "14 KYC reviews pending", tone: "priority" },
  { label: "6 asset valuations awaiting approval", tone: "priority" },
];

export const inventory = [
  { brand: "Rolex", category: "Luxury Watches", units: 250 },
  { brand: "Patek Philippe", category: "Luxury Watches", units: 180 },
  { brand: "Fendi", category: "Luxury Bags", units: 166 },
  { brand: "Audemar Piguet", category: "Luxury Watches", units: 75 },
  { brand: "Cartier", category: "Luxury Watches", units: 75 },
];
