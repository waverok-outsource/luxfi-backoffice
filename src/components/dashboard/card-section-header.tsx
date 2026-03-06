import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardSectionHeaderProps {
  title: string;
  icon?: ReactNode;
  rightSlot?: ReactNode;
  className?: string;
}

export function CardSectionHeader({ title, icon, rightSlot, className }: CardSectionHeaderProps) {
  return (
    <div className={cn("mb-3 flex items-center justify-between gap-3", className)}>
      <h2 className="flex items-center gap-2 text-xl font-semibold text-[#2D2D2D]">
        {icon}
        {title}
      </h2>
      {rightSlot}
    </div>
  );
}
