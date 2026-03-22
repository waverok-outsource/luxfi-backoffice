"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell } from "@/components/modal";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import {
  blacklistCustomerSchema,
  type BlacklistCustomerFormValues,
} from "@/schema/customers.schema";

type BlacklistCustomerModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customerName: string;
  onConfirm: (payload: BlacklistCustomerFormValues) => void;
};

const reasonOptions = [
  { label: "Fraudulent Transactions", value: "Fraudulent Transactions" },
  { label: "Chargeback Abuse", value: "Chargeback Abuse" },
  { label: "KYC Violation", value: "KYC Violation" },
  { label: "Suspicious Activity", value: "Suspicious Activity" },
];

const DEFAULT_VALUES: BlacklistCustomerFormValues = {
  reason: "",
  notice: "",
};

export function BlacklistCustomerModal({
  open,
  onOpenChange,
  customerName,
  onConfirm,
}: BlacklistCustomerModalProps) {
  const formId = React.useId();

  const {
    control,
    handleSubmit,
    formState: { isValid },
    reset,
  } = useForm<BlacklistCustomerFormValues>({
    resolver: zodResolver(blacklistCustomerSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  const handleRootOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      reset(DEFAULT_VALUES);
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = (values: BlacklistCustomerFormValues) => {
    onConfirm(values);
    handleRootOpenChange(false);
  };

  return (
    <ModalShell.Root
      open={open}
      onOpenChange={handleRootOpenChange}
      showCloseButton={false}
      closeOnBackdropClick
      shellClassName="max-w-[650px]"
    >
      <div className="space-y-6">
        <ModalShell.Header
          title="Blacklist Customer?"
          description={
            <>
              You are about to blacklist{" "}
              <span className="font-semibold text-text-black">{customerName}</span>. This will
              immediately disable their access across all platforms. Select a reason to proceed.
            </>
          }
        />

        <ModalShell.Body>
          <form id={formId} onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField control={control} name="reason" label="Reason For Blacklist" required>
              {({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormSelectTrigger>
                    <SelectValue placeholder="Select Reason" />
                  </FormSelectTrigger>
                  <SelectContent>
                    {reasonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </FormField>

            <FormField control={control} name="notice" label="Compliance Notice" required>
              {({ field }) => (
                <FormControl>
                  <Textarea {...field} placeholder="Enter remark" className="min-h-[160px] " />
                </FormControl>
              )}
            </FormField>
          </form>
        </ModalShell.Body>

        <ModalShell.Footer className="pt-2">
          <ModalShell.Action
            type="button"
            variant="grey-stroke"
            onClick={() => handleRootOpenChange(false)}
          >
            No, Cancel
          </ModalShell.Action>
          <ModalShell.Action type="submit" form={formId} variant="danger" disabled={!isValid}>
            Yes, Confirm
          </ModalShell.Action>
        </ModalShell.Footer>
      </div>
    </ModalShell.Root>
  );
}
