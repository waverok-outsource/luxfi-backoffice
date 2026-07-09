import { AssetClassesProvider } from "@/module/dashboard/asset-management/context";

export default function AssetManagementLayout({ children }: { children: React.ReactNode }) {
  return <AssetClassesProvider>{children}</AssetClassesProvider>;
}
