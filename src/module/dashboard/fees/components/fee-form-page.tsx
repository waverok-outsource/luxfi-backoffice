"use client";

import { useRouter } from "next/navigation";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import {
  FormControl,
  FormCurrencyInput,
  FormField,
  FormSelectTrigger,
  FormSwitchField,
  FormTextarea,
} from "@/components/util/form-controller";
import { BandsEditor } from "@/module/dashboard/fees/components/bands-editor";
import { BeneficiaryField } from "@/module/dashboard/fees/components/beneficiary-field";
import { ScopeRefsField } from "@/module/dashboard/fees/components/scope-refs-field";
import {
  BEARER_HINTS,
  METHOD_HINTS,
  TRIGGER_HINTS,
  blankBand,
  blankFeeForm,
  feeLabel,
  feeToFormValues,
  resolveFeeOptions,
  suggestFeeCode,
  toCreateFeePayload,
  toUpdateFeePayload,
} from "@/module/dashboard/fees/form";
import {
  createFeeFormSchema,
  updateFeeFormSchema,
  type FeeFormValues,
} from "@/schema/fee.schema";
import useFeeFns from "@/services/functions/fee.fns";
import { useFee, useFeeOptions } from "@/services/queries/fee.queries";
import route from "@/util/route";

type FeeFormPageProps = {
  feeId?: string;
};

export function FeeFormPage({ feeId }: FeeFormPageProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useFee(feeId ?? "");
  const fee = data?.data ?? null;

  if (feeId && isLoading && !fee) {
    return <StatusMessage message="Loading fee..." />;
  }

  if (feeId && (isError || !fee)) {
    return (
      <StatusMessage
        message="This fee could not be loaded."
        actionLabel="Back to fees"
        onAction={() => router.push(route.dashboard.systemSettingsFees)}
      />
    );
  }

  return (
    <FeeForm
      key={fee ? `${fee.feeId}-${fee.updatedAt}` : "new"}
      feeId={fee?.feeId}
      defaultValues={fee ? feeToFormValues(fee) : blankFeeForm()}
      title={fee ? fee.name : "New fee"}
    />
  );
}

function FeeForm({
  feeId,
  defaultValues,
  title,
}: {
  feeId?: string;
  defaultValues: FeeFormValues;
  title: string;
}) {
  const router = useRouter();
  const formId = "fee-form";
  const mode = feeId ? "edit" : "create";
  const { createFee, updateFee, loading } = useFeeFns();
  const { data: optionsResponse } = useFeeOptions();
  const options = resolveFeeOptions(optionsResponse?.data);
  const { control, handleSubmit, setValue, getValues, getFieldState, formState } = useForm<FeeFormValues>({
    resolver: zodResolver(mode === "create" ? createFeeFormSchema : updateFeeFormSchema) as unknown as Resolver<FeeFormValues>,
    defaultValues,
  });
  const trigger = useWatch({ control, name: "trigger" });
  const bearer = useWatch({ control, name: "bearer" });
  const calculationMethod = useWatch({ control, name: "calculationMethod" });
  const currencyCode = useWatch({ control, name: "currencyCode" });
  const pending = mode === "create" ? loading.CREATE_FEE : loading.UPDATE_FEE;

  const onSubmit = async (values: FeeFormValues) => {
    const result =
      mode === "create"
        ? await createFee(toCreateFeePayload(values))
        : await updateFee(feeId ?? "", toUpdateFeePayload(values));
    if (!result) return;
    router.push(result.queued ? `${route.dashboard.approvals}?tab=mine` : route.dashboard.systemSettingsFees);
  };

  const back = () => router.push(feeId ? route.dashboard.fee(feeId) : route.dashboard.systemSettingsFees);

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader title="Fees" entityId={title} idPrefix="" onBack={back} />

      <form
        id={formId}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, () => {
          toast.error("Check the highlighted fields and try again.");
        })}
      >
        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Fee details</h2>
            <p className="mt-1 text-sm text-text-grey">
              A fee is charged when its trigger happens. Creating and editing a fee is sent to another
              authorised user before it takes effect.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <FormField control={control} name="name" label="Name" required>
              {({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Marketplace VAT"
                    onChange={(event) => {
                      const nextName = event.target.value;
                      field.onChange(nextName);
                      if (mode === "create" && !getFieldState("code").isDirty) {
                        setValue("code", suggestFeeCode(nextName));
                      }
                    }}
                    onBlur={field.onBlur}
                  />
                </FormControl>
              )}
            </FormField>
            <FormField
              control={control}
              name="code"
              label="Code"
              required={mode === "create"}
              description={
                mode === "create"
                  ? "A stable name such as marketplace_vat. It cannot be changed later."
                  : "The code stays the same after the fee is created."
              }
            >
              {({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    disabled={mode === "edit"}
                    placeholder="marketplace_vat"
                    onChange={(event) => field.onChange(event.target.value.toLowerCase())}
                  />
                </FormControl>
              )}
            </FormField>
            <EnumSelect
              control={control}
              name="feeType"
              label="Fee type"
              placeholder="Select a fee type"
              choices={options.feeTypes}
              required
            />
            <EnumSelect
              control={control}
              name="trigger"
              label="Trigger"
              placeholder="Select a trigger"
              choices={options.triggers}
              required
              description={TRIGGER_HINTS[trigger]}
              onPick={(value) => {
                if (value === "loan.default") {
                  setValue("bearer", "payer", { shouldValidate: true });
                } else {
                  setValue("graceDays", "0");
                }
              }}
            />
            <EnumSelect
              control={control}
              name="bearer"
              label="Bearer"
              placeholder="Who pays"
              choices={options.bearers}
              required
              disabled={trigger === "loan.default"}
              description={BEARER_HINTS[bearer]}
            />
            <EnumSelect
              control={control}
              name="calculationMethod"
              label="Calculation"
              placeholder="How the amount is worked out"
              choices={options.calculationMethods}
              required
              description={METHOD_HINTS[calculationMethod]}
              onPick={(value) => {
                if (value === "banded" && getValues("bands").length === 0) {
                  setValue("bands", [blankBand()]);
                }
              }}
            />
          </div>

          {calculationMethod === "percentage" || calculationMethod === "flat" ? (
            <FormField
              control={control}
              name="value"
              label={calculationMethod === "percentage" ? "Percentage" : "Amount"}
              required
            >
              {({ field }) =>
                calculationMethod === "percentage" ? (
                  <FormControl>
                    <Input
                      {...field}
                      inputMode="decimal"
                      placeholder="7.5"
                      endAdornment={<span className="text-sm font-semibold">%</span>}
                    />
                  </FormControl>
                ) : (
                  <FormCurrencyInput
                    name={field.name}
                    value={field.value}
                    onValueChange={(value) => field.onChange(value ?? "")}
                    onBlur={field.onBlur}
                    placeholder="0.00"
                    endAdornment={
                      currencyCode ? <span className="text-xs font-semibold">{currencyCode}</span> : undefined
                    }
                  />
                )
              }
            </FormField>
          ) : null}

          {calculationMethod === "banded" ? (
            <BandsEditor
              control={control}
              getValues={getValues}
              currencyCode={currencyCode}
              error={listError(formState.errors.bands)}
            />
          ) : null}

          <FormField control={control} name="description" label="Description">
            {({ field }) => (
              <FormTextarea {...field} placeholder="What this fee is for, and when it should apply" />
            )}
          </FormField>
        </section>

        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Limits and currency</h2>
            <p className="mt-1 text-sm text-text-grey">
              A floor or a cap is applied after the fee is calculated. A currency is required whenever
              the fee uses a flat amount, and the fee then only matches that currency.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FormField control={control} name="minAmount" label="Minimum fee">
              {({ field }) => (
                <FormCurrencyInput
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  onBlur={field.onBlur}
                  placeholder="No floor"
                />
              )}
            </FormField>
            <FormField control={control} name="maxAmount" label="Maximum fee">
              {({ field }) => (
                <FormCurrencyInput
                  name={field.name}
                  value={field.value}
                  onValueChange={(value) => field.onChange(value ?? "")}
                  onBlur={field.onBlur}
                  placeholder="No cap"
                />
              )}
            </FormField>
            <FormField control={control} name="currencyCode" label="Currency">
              {({ field }) => (
                <FormControl>
                  <Input
                    {...field}
                    maxLength={3}
                    placeholder="NGN"
                    onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                  />
                </FormControl>
              )}
            </FormField>
          </div>
          {trigger === "loan.default" ? (
            <FormField
              control={control}
              name="graceDays"
              label="Grace days"
              description="Days past the installment due date before this fee is charged."
            >
              {({ field }) => (
                <FormControl>
                  <Input {...field} inputMode="numeric" placeholder="0" />
                </FormControl>
              )}
            </FormField>
          ) : null}
        </section>

        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Who receives it</h2>
            <p className="mt-1 text-sm text-text-grey">
              The fee is credited to this user&apos;s wallet. Search uses the full email, first name, last
              name, or user id.
            </p>
          </div>
          <BeneficiaryField
            control={control}
            setValue={setValue}
            error={formState.errors.beneficiaryId?.message}
          />
        </section>

        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Where it applies</h2>
            <p className="mt-1 text-sm text-text-grey">
              A narrower scope replaces a broader fee of the same type and bearer. A zero-value fee at
              that scope waives the broader one.
            </p>
          </div>
          <EnumSelect
            control={control}
            name="scopeLevel"
            label="Scope"
            placeholder="Select a scope"
            choices={options.scopeLevels}
            required
            onPick={(value) => {
              if (value === "global") setValue("scopeRefs", [], { shouldValidate: true });
            }}
          />
          <ScopeRefsField control={control} setValue={setValue} error={listError(formState.errors.scopeRefs)} />
          {mode === "create" ? (
            <FormSwitchField
              control={control}
              name="isActive"
              label="Active once approved"
              description="Leave this off to keep the fee on record without charging it."
            />
          ) : (
            <p className="text-sm text-text-grey">
              Active and inactive are changed from the fee page, and that change is also approved separately.
            </p>
          )}
        </section>
      </form>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={back}>
          Cancel
        </Button>
        <Button type="submit" form={formId} pending={pending}>
          Submit for approval
        </Button>
      </div>
    </div>
  );
}

function EnumSelect({
  control,
  name,
  label,
  placeholder,
  choices,
  required,
  description,
  disabled,
  onPick,
}: {
  control: ReturnType<typeof useForm<FeeFormValues>>["control"];
  name: "feeType" | "trigger" | "bearer" | "calculationMethod" | "scopeLevel";
  label: string;
  placeholder: string;
  choices: string[];
  required?: boolean;
  description?: string;
  disabled?: boolean;
  onPick?: (value: string) => void;
}) {
  return (
    <FormField control={control} name={name} label={label} required={required} description={description}>
      {({ field }) => (
        <Select
          value={field.value || null}
          disabled={disabled}
          onValueChange={(value) => {
            if (typeof value !== "string") return;
            field.onChange(value);
            onPick?.(value);
          }}
        >
          <FormSelectTrigger>
            <SelectValue>
              {(selected: string | null) => (selected ? feeLabel(selected) : placeholder)}
            </SelectValue>
          </FormSelectTrigger>
          <SelectContent>
            {choices.map((choice) => (
              <SelectItem key={choice} value={choice}>
                {feeLabel(choice)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

function listError(error: { message?: string; root?: { message?: string } } | undefined) {
  return error?.message || error?.root?.message;
}

function StatusMessage({
  message,
  actionLabel,
  onAction,
}: {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
      <p className="text-text-grey">{message}</p>
      {actionLabel && onAction ? (
        <button type="button" className="text-sm text-primary-gold-brand underline" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
