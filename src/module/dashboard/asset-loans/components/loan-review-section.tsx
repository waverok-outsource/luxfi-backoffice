import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type LoanReviewSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function LoanReviewSection({ title, description, children, className }: LoanReviewSectionProps) {
  return (
    <section className={cn("overflow-hidden rounded-[24px] border border-primary-grey-stroke bg-primary-white", className)}>
      <header className="border-b border-primary-grey-stroke px-5 py-4 sm:px-6">
        <h2 className="text-base font-semibold text-text-black">{title}</h2>
        {description ? <p className="mt-1 text-sm text-text-grey">{description}</p> : null}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
