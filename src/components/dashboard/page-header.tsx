import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  description: string;
  showBorder?: boolean;
}

export function DashboardPageHeader({
  title,
  description,
  showBorder = true,
}: DashboardPageHeaderProps) {
  return (
    <div className={cn(showBorder && "border-b-2 border-white pb-3")}>
      <div className="ml-3">
        <h1 className="text-4xl font-semibold leading-tight text-primary-black">{title}</h1>
        <p className="text-sm text-text-grey">{description}</p>
      </div>
    </div>
  );
}
