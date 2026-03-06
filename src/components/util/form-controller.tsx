"use client";

import * as React from "react";
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type ControllerRenderProps,
  type ControllerFieldState,
} from "react-hook-form";

import { cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";

import { SelectTrigger } from "../ui/select";
import { Checkbox } from "../ui/checkbox";

/* ----------------------------- Context ----------------------------- */

type FormFieldContextValue = {
  id: string;
  invalid: boolean;
  describedBy?: string;
};

const FormFieldContext = React.createContext<FormFieldContextValue | null>(null);

export function useFormField() {
  const ctx = React.useContext(FormFieldContext);
  if (!ctx) throw new Error("useFormField must be used within <FormField>");
  return ctx;
}

/* ----------------------------- Types ----------------------------- */

type FormFieldRenderProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  field: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
};

type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = {
  control: Control<TFieldValues>;
  name: TName;

  label?: React.ReactNode;
  description?: React.ReactNode;

  orientation?: "vertical" | "horizontal" | "responsive";
  className?: string;
  required?: boolean;
  children: (props: FormFieldRenderProps<TFieldValues, TName>) => React.ReactNode;
};

/* ----------------------------- FormField ----------------------------- */

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  name,
  label,
  description,
  orientation = "vertical",
  className,
  required,
  children,
}: FormFieldProps<TFieldValues, TName>) {
  const rid = React.useId();
  const id = `${name}-${rid}`;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const invalid = !!fieldState.error;

        const descriptionId = description ? `${id}-desc` : undefined;
        const errorId = invalid ? `${id}-err` : undefined;

        const describedBy = [descriptionId, errorId].filter(Boolean).join(" ") || undefined;

        return (
          <FormFieldContext.Provider value={{ id, invalid, describedBy }}>
            <Field
              orientation={orientation}
              data-invalid={invalid ? "true" : "false"}
              className={cn(className)}
            >
              {label && (
                <FieldLabel htmlFor={id}>
                  {label}
                  {required && <span className="text-red-500">*</span>}
                </FieldLabel>
              )}

              <FieldContent>
                {children({ field, fieldState })}

                {description && (
                  <FieldDescription id={descriptionId}>{description}</FieldDescription>
                )}

                <FieldError
                  id={errorId}
                  errors={invalid ? [{ message: fieldState.error?.message }] : undefined}
                  className="mt-1"
                />
              </FieldContent>
            </Field>
          </FormFieldContext.Provider>
        );
      }}
    />
  );
}

/* ----------------------------- FormControl ----------------------------- */
/** For Input / Textarea */

type FormControlInjectProps = {
  id?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-describedby"?: string;
};

export function FormControl({
  children,
}: {
  children: React.ReactElement<FormControlInjectProps>;
}) {
  const { id, invalid, describedBy } = useFormField();

  return React.cloneElement(children, {
    id,
    "aria-invalid": invalid || undefined,
    "aria-describedby": describedBy,
  });
}

/* ----------------------------- Select Trigger ----------------------------- */

export function FormSelectTrigger(props: React.ComponentProps<typeof SelectTrigger>) {
  const { id, invalid, describedBy } = useFormField();

  return (
    <SelectTrigger
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      {...props}
    />
  );
}

/* ----------------------------- Checkbox ----------------------------- */

type FormCheckboxProps = Omit<
  React.ComponentProps<typeof Checkbox>,
  "checked" | "onCheckedChange"
> & {
  value?: boolean;
  onChange?: (value: boolean) => void;
};

export function FormCheckbox({ value, onChange, ...props }: FormCheckboxProps) {
  const { id, invalid, describedBy } = useFormField();

  return (
    <Checkbox
      {...props}
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={describedBy}
      checked={!!value}
      onCheckedChange={(v) => onChange?.(Boolean(v))}
    />
  );
}
