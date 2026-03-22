"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "form-control-base form-control-focus form-control-invalid h-auto min-h-16 px-4 py-3 resize-none",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
