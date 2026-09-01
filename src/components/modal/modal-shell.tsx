"use client";

import { type VariantProps } from "class-variance-authority";

import { ModalRoot } from "@/components/modal/modal-root";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import BackIcon from "@/components/icon/back";

type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];

type ModalShellRootProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  keepMounted?: boolean;
  closeOnBackdropClick?: boolean;
  showCloseButton?: boolean;
  shellClassName?: string;
  children: React.ReactNode;
};

function Root({
  open,
  onOpenChange,
  keepMounted = false,
  closeOnBackdropClick = true,
  showCloseButton = false,
  shellClassName,
  children,
}: ModalShellRootProps) {
  return (
    <ModalRoot
      open={open}
      onOpenChange={onOpenChange}
      keepMounted={keepMounted}
      closeOnBackdropClick={closeOnBackdropClick}
      showCloseButton={showCloseButton}
      contentClassName={shellClassName}
    >
      {children}
    </ModalRoot>
  );
}

type ModalShellHeaderProps = {
  title: React.ReactNode;
  description?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
  backButtonVariant?: ButtonVariant;
  /** Pins the header to the top of the modal's scroll container. Opt-in — off by default. */
  sticky?: boolean;
  className?: string;
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

function Header({
  title,
  description,
  showBackButton = false,
  onBack,
  backButtonVariant = "grey-stroke",
  sticky = false,
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: ModalShellHeaderProps) {
  return (
    // The negative-margin bleed cancels this modal's own p-4 sm:p-6
    // container padding so the header's background spans the full bleed
    // width and reaches the true top edge. That alone isn't enough for
    // `position: sticky`, though: `top`/`bottom` offsets are measured
    // against the *padding edge* of the scrolling ancestor, not affected by
    // this element's own margin — a plain `top-0` sticks 24px (the
    // container's own padding) short of the true edge, leaving a sliver of
    // scrolled content peeking out. Using a negative top equal to that
    // padding (-top-4 sm:-top-6, matching p-4 sm:p-6) closes that gap.
    // Verified empirically against DialogContent's actual padding — if a
    // future modal opts in with different padding, re-check this value.
    <div
      className={cn(
        "border-b-2 border-white pb-5",
        sticky
          ? "sticky -top-4 z-10 -mx-4 -mt-4 bg-alertSoft-disabled px-4 pt-4 sm:-top-6 sm:-mx-6 sm:-mt-6 sm:px-6 sm:pt-6"
          : "pl-3",
        className,
      )}
    >
      <div className={cn("flex items-start gap-4", contentClassName)}>
        {showBackButton ? (
          <Button
            type="button"
            variant={backButtonVariant}
            size="icon"
            className="h-12 w-12 rounded-2xl"
            onClick={onBack}
          >
            <BackIcon />
          </Button>
        ) : null}

        <div>
          <h2 className={cn("text-[32px] font-bold leading-tight", titleClassName)}>{title}</h2>
          {description ? (
            <p className={cn("mt-1 text-sm", descriptionClassName)}>{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Body({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("rounded-xl bg-primary-white p-2 sm:p-4", className)} {...props} />;
}

type ModalShellFooterProps = React.ComponentProps<"div"> & {
  align?: "end" | "between";
  stackOnMobile?: boolean;
  /** Pins the footer to the bottom of the modal's scroll container. Opt-in — off by default. */
  sticky?: boolean;
};

function Footer({
  className,
  align = "end",
  stackOnMobile = true,
  sticky = false,
  ...props
}: ModalShellFooterProps) {
  return (
    <div
      className={cn(
        "gap-3",
        sticky
          ? "sticky -bottom-4 z-10 -mx-4 -mb-4 border-t border-primary-grey-stroke bg-alertSoft-disabled px-4 pt-4 pb-4 sm:-bottom-6 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6"
          : "pt-2",
        stackOnMobile ? "flex flex-col-reverse sm:flex-row" : "flex flex-row",
        align === "between" ? "justify-between" : "justify-end",
        className,
      )}
      {...props}
    />
  );
}

function Action({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button className={cn("min-w-46.75", className)} {...props} />;
}

export const ModalShell = {
  Root,
  Header,
  Body,
  Footer,
  Action,
};
