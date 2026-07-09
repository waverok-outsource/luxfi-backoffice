"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ModalShell } from "@/components/modal";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormField, FormSelectTrigger } from "@/components/util/form-controller";
import { blacklistAssetSchema, type BlacklistAssetFormValues } from "@/schema/asset-verification.schema";

const reasonOptions = [
  { label: "Suspected Counterfeit", value: "Suspected Counterfeit" },
  { label: "Stolen Item Reported", value: "Stolen Item Reported" },
  { label: "Repeated Policy Violation", value: "Repeated Policy Violation" },
  { label: "Other", value: "Other" },
];

const DEFAULT_VALUES: BlacklistAssetFormValues = { reason: "", notice: "" };

type BlacklistAssetConfirmProps = {
  assetId: string;
  onCancel: () => void;
  onConfirm: (values: BlacklistAssetFormValues) => void;
};

export function BlacklistAssetConfirm({ assetId, onCancel, onConfirm }: BlacklistAssetConfirmProps) {
  const formId = React.useId();

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm<BlacklistAssetFormValues>({
    resolver: zodResolver(blacklistAssetSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "all",
  });

  return (
    <div className="space-y-6">
      <ModalShell.Header
        title="Blacklist Asset?"
        description={
          <>
            You are about to blacklist asset <span className="font-semibold text-text-black">{assetId}</span>.
            Select a reason to proceed.
          </>
        }
      />

      <ModalShell.Body>
        <form id={formId} onSubmit={handleSubmit(onConfirm)} className="space-y-6">
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
                <Textarea {...field} placeholder="Enter remark" className="min-h-[160px]" />
              </FormControl>
            )}
          </FormField>
        </form>
      </ModalShell.Body>

      <ModalShell.Footer className="pt-2">
        <ModalShell.Action type="button" variant="grey-stroke" onClick={onCancel}>
          No, Cancel
        </ModalShell.Action>
        <ModalShell.Action type="submit" form={formId} variant="danger" disabled={!isValid}>
          Yes, Confirm
        </ModalShell.Action>
      </ModalShell.Footer>
    </div>
  );
}
