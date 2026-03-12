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
  className,
  contentClassName,
  titleClassName,
  descriptionClassName,
}: ModalShellHeaderProps) {
  return (
    <div className={cn("border-b-2 border-white pb-5 pl-3", className)}>
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
};

function Footer({
  className,
  align = "end",
  stackOnMobile = true,
  ...props
}: ModalShellFooterProps) {
  return (
    <div
      className={cn(
        "gap-3 pt-2",
        stackOnMobile ? "flex flex-col-reverse sm:flex-row" : "flex flex-row",
        align === "between" ? "justify-between" : "justify-end",
        className,
      )}
      {...props}
    />
  );
}

function Action({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button className={cn("min-w-[187px]", className)} {...props} />;
}

export const ModalShell = {
  Root,
  Header,
  Body,
  Footer,
  Action,
};
