"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch, type Control, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Combobox } from "@base-ui/react/combobox";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailBreadcrumbHeader } from "@/components/ui/detail-breadcrumb-header";
import { Select, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FormField, FormSelectTrigger, FormSwitchField } from "@/components/util/form-controller";
import { useHasPermission } from "@/hooks/useHasPermission";
import {
  blankAccessForm,
  buildCreatePayload,
  buildUpdatePayload,
  endpointResourceHint,
  isEndpointMissing,
  resourceTitle,
  ruleTargetTitle,
  ruleToEditForm,
  targetTypeLabel,
  tierLabel,
} from "@/module/dashboard/kyc/access";
import { cn } from "@/lib/utils";
import {
  kycAccessEditSchema,
  kycAccessFormSchema,
  type KycAccessEditValues,
  type KycAccessFormValues,
} from "@/schema/kyc.schema";
import useKycAccessFns, { type KycAccessMutationError } from "@/services/functions/kyc-access.fns";
import {
  useKycAccessEndpoints,
  useKycAccessResources,
  useKycAccessRule,
  useKycAccessRules,
  useKycAccessTiers,
} from "@/services/queries/kyc-access.queries";
import type {
  KycAccessEndpointOption,
  KycAccessResource,
  KycAccessRule,
  KycTier,
} from "@/types/kyc.type";
import route from "@/util/route";

const EXISTING_RULES_QUERY = "page=1&limit=100";
const TIERS_QUERY = "page=1&limit=100";
const FORM_ID = "kyc-access-rule-form";

type TierChoice = { id: string; label: string };

type AccessRuleFormPageProps = {
  ruleId?: string;
};

export function AccessRuleFormPage({ ruleId }: AccessRuleFormPageProps) {
  const router = useRouter();
  const { data, isLoading, isError } = useKycAccessRule(ruleId ?? "");
  const rule = data?.data ?? null;

  if (ruleId && isLoading && !rule) {
    return <StatusMessage message="Loading access rule..." />;
  }

  if (ruleId && (isError || !rule)) {
    return (
      <StatusMessage
        message="This access rule could not be loaded."
        actionLabel="Back to resource access"
        onAction={() => router.push(route.dashboard.kycResourceAccess)}
      />
    );
  }

  if (rule) {
    return <EditAccessRuleForm key={`${rule.kycAccessRef}-${rule.updatedAt}`} rule={rule} />;
  }

  return <CreateAccessRuleForm />;
}

/* ------------------------------------------------------------------ */
/* Create                                                              */
/* ------------------------------------------------------------------ */

function CreateAccessRuleForm() {
  const router = useRouter();
  const canApprove = useHasPermission("approvekyc");
  const { createRule, loading } = useKycAccessFns();
  const resourcesQuery = useKycAccessResources();
  const endpointsQuery = useKycAccessEndpoints();
  const rulesQuery = useKycAccessRules(EXISTING_RULES_QUERY);
  const { tierChoices, tiersQuery } = useTierChoices();
  const [submitError, setSubmitError] = useState<KycAccessMutationError | null>(null);

  const { control, handleSubmit, setValue, clearErrors } = useForm<KycAccessFormValues>({
    resolver: zodResolver(kycAccessFormSchema) as unknown as Resolver<KycAccessFormValues>,
    defaultValues: blankAccessForm(),
  });

  const [targetType, selectedResourceId, selectedEndpointKey] = useWatch({
    control,
    name: ["targetType", "resourceId", "endpoint"],
  });

  const resources = resourcesQuery.data?.data ?? [];
  const endpoints = useMemo(
    () =>
      [...(endpointsQuery.data?.data ?? [])].sort((a, b) =>
        (a.label || a.key).localeCompare(b.label || b.key),
      ),
    [endpointsQuery.data],
  );

  // Existing rules, keyed by target, so the admin is told up front when a target already has a rule.
  // Taken targets stay selectable: the backend is the source of truth for duplicates.
  const existingRules = useMemo(() => {
    const byResource = new Map<string, string>();
    const byEndpoint = new Map<string, string>();
    (rulesQuery.data?.data ?? []).forEach((rule) => {
      if (rule.targetType === "endpoint" && rule.endpoint?.key) {
        byEndpoint.set(rule.endpoint.key, rule.kycAccessRef);
      } else if (rule.resource?.resourceRef) {
        byResource.set(rule.resource.resourceRef, rule.kycAccessRef);
      }
    });
    return { byResource, byEndpoint };
  }, [rulesQuery.data]);

  const existingRuleForSelection =
    targetType === "resource"
      ? existingRules.byResource.get(selectedResourceId)
      : existingRules.byEndpoint.get(selectedEndpointKey);

  const changeTargetType = (next: string) => {
    if (next !== "resource" && next !== "endpoint") return;
    if (next === targetType) return;
    setValue("targetType", next);
    // Clear the other picker so its value can never leak into the payload.
    setValue(next === "resource" ? "endpoint" : "resourceId", "");
    clearErrors(["resourceId", "endpoint"]);
    setSubmitError(null);
  };

  const onSubmit = async (values: KycAccessFormValues) => {
    setSubmitError(null);
    const result = await createRule(buildCreatePayload(values));
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    router.push(route.dashboard.kycResourceAccessRule(result.data.kycAccessRef));
  };

  const pickerLoading = targetType === "resource" ? resourcesQuery.isLoading : endpointsQuery.isLoading;
  const pickerError = targetType === "resource" ? resourcesQuery.isError : endpointsQuery.isError;
  const permissionDenied = canApprove === false;

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader
        title="KYC"
        entityId="New rule"
        idPrefix=""
        onBack={() => router.push(route.dashboard.kycResourceAccess)}
      />

      <form
        id={FORM_ID}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, () => {
          toast.error(
            targetType === "resource"
              ? "Select a resource and a KYC tier."
              : "Select an endpoint and a KYC tier.",
          );
        })}
      >
        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Access rule</h2>
            <p className="mt-1 text-sm text-text-grey">
              Customers need this KYC tier, or a higher one, before they can use the resource or
              endpoint. One rule is allowed per target. An inactive rule stays on record and is not
              enforced.
            </p>
          </div>

          {permissionDenied ? (
            <Notice tone="error">
              You need the approve KYC permission to create access rules.
            </Notice>
          ) : null}

          {submitError ? <SubmitErrorNotice error={submitError} /> : null}

          <FormField control={control} name="targetType" label="Target type" required>
            {({ field }) => (
              <ToggleGroup
                selection="single"
                look="segmented"
                value={field.value}
                onValueChange={changeTargetType}
                className="w-fit"
              >
                <ToggleGroupItem value="resource">Resource</ToggleGroupItem>
                <ToggleGroupItem value="endpoint">Endpoint</ToggleGroupItem>
              </ToggleGroup>
            )}
          </FormField>

          {pickerError || tiersQuery.isError ? (
            <Notice tone="error">
              {targetType === "resource" ? "Resources" : "Endpoints"} or KYC tiers could not be
              loaded. Refresh and try again.
            </Notice>
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            {targetType === "resource" ? (
              <FormField control={control} name="resourceId" label="Resource" required>
                {({ field }) => (
                  <Select
                    value={field.value || null}
                    onValueChange={(value) => {
                      if (typeof value === "string") field.onChange(value);
                      setSubmitError(null);
                    }}
                    disabled={pickerLoading || resources.length === 0}
                  >
                    <FormSelectTrigger>
                      <SelectValue>
                        {(selected: string | null) => {
                          const resource = resources.find((item) => item.resourceRef === selected);
                          if (resource) return resourceTitle(resource.title);
                          return pickerLoading ? "Loading resources..." : "Select a resource";
                        }}
                      </SelectValue>
                    </FormSelectTrigger>
                    <SelectContent>
                      {resources.map((resource) => (
                        <SelectItem key={resource.resourceRef} value={resource.resourceRef}>
                          {resourceOptionLabel(resource)}
                          {existingRules.byResource.has(resource.resourceRef) ? (
                            <span className="text-xs text-text-grey">· has a rule</span>
                          ) : null}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </FormField>
            ) : (
              <FormField
                control={control}
                name="endpoint"
                label="Endpoint"
                required
                description={endpointDescription(
                  endpoints.find((item) => item.key === selectedEndpointKey),
                )}
              >
                {({ field }) => (
                  <EndpointPicker
                    endpoints={endpoints}
                    takenKeys={existingRules.byEndpoint}
                    value={field.value}
                    loading={endpointsQuery.isLoading}
                    onChange={(key) => {
                      field.onChange(key);
                      setSubmitError(null);
                    }}
                  />
                )}
              </FormField>
            )}

            <TierField control={control} tierChoices={tierChoices} loading={tiersQuery.isLoading} />
          </div>

          {existingRuleForSelection && !submitError ? (
            <Notice tone="warning">
              A rule already exists for this {targetType}.{" "}
              <Link
                className="font-semibold underline"
                href={route.dashboard.kycResourceAccessEdit(existingRuleForSelection)}
              >
                Edit the existing rule
              </Link>
            </Notice>
          ) : null}

          <FormSwitchField
            control={control}
            name="isActive"
            label="Active"
            description="Turn this off to keep the rule without enforcing it."
          />
        </section>
      </form>

      <FormActions
        onCancel={() => router.push(route.dashboard.kycResourceAccess)}
        submitLabel="Create rule"
        pending={loading.CREATE_RULE}
        disabled={permissionDenied || tiersQuery.isLoading || tierChoices.length === 0}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Edit                                                                */
/* ------------------------------------------------------------------ */

function EditAccessRuleForm({ rule }: { rule: KycAccessRule }) {
  const router = useRouter();
  const canApprove = useHasPermission("approvekyc");
  const { updateRule, loading } = useKycAccessFns();
  const { tierChoices, tiersQuery } = useTierChoices(rule);
  const [submitError, setSubmitError] = useState<KycAccessMutationError | null>(null);

  const { control, handleSubmit } = useForm<KycAccessEditValues>({
    resolver: zodResolver(kycAccessEditSchema) as unknown as Resolver<KycAccessEditValues>,
    defaultValues: ruleToEditForm(rule),
  });

  const onSubmit = async (values: KycAccessEditValues) => {
    setSubmitError(null);
    const result = await updateRule(rule.kycAccessRef, buildUpdatePayload(values));
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    router.push(route.dashboard.kycResourceAccessRule(result.data?.kycAccessRef ?? rule.kycAccessRef));
  };

  const permissionDenied = canApprove === false;
  const backToRule = () => router.push(route.dashboard.kycResourceAccessRule(rule.kycAccessRef));

  return (
    <div className="space-y-4">
      <DetailBreadcrumbHeader title="KYC" entityId={ruleTargetTitle(rule)} idPrefix="" onBack={backToRule} />

      <form
        id={FORM_ID}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit, () => toast.error("Select a KYC tier."))}
      >
        <section className="space-y-4 rounded-[24px] border border-primary-grey-stroke bg-primary-white p-5 sm:p-6">
          <div>
            <h2 className="text-base font-semibold text-text-black">Access rule</h2>
            <p className="mt-1 text-sm text-text-grey">
              You can change the minimum tier and whether the rule is enforced.
            </p>
          </div>

          {permissionDenied ? (
            <Notice tone="error">You need the approve KYC permission to edit access rules.</Notice>
          ) : null}

          {submitError ? <SubmitErrorNotice error={submitError} /> : null}

          <div className="space-y-2 rounded-2xl bg-primary-grey-undertone p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-text-grey">
              Target (read-only)
            </p>
            <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-text-black">
              <Badge variant="neutral">{targetTypeLabel(rule.targetType)}</Badge>
              <span>{ruleTargetTitle(rule)}</span>
              {rule.targetType === "endpoint" && rule.endpoint?.key ? (
                <code className="text-xs font-normal text-text-grey">{rule.endpoint.key}</code>
              ) : null}
              {isEndpointMissing(rule) ? <Badge variant="warning">Route removed</Badge> : null}
            </div>
            <p className="text-sm text-text-grey">
              The target of a rule can&apos;t be changed. To gate a different resource or endpoint,
              delete this rule and create a new one.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TierField control={control} tierChoices={tierChoices} loading={tiersQuery.isLoading} />
          </div>

          <FormSwitchField
            control={control}
            name="isActive"
            label="Active"
            description="Turn this off to keep the rule without enforcing it."
          />
        </section>
      </form>

      <FormActions
        onCancel={backToRule}
        submitLabel="Save changes"
        pending={loading.UPDATE_RULE}
        disabled={permissionDenied || tiersQuery.isLoading || tierChoices.length === 0}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared pieces                                                       */
/* ------------------------------------------------------------------ */

function useTierChoices(rule?: KycAccessRule) {
  const tiersQuery = useKycAccessTiers(TIERS_QUERY);
  const tierChoices = useMemo(() => {
    const choices: TierChoice[] = [...(tiersQuery.data?.data ?? [])]
      .sort((a, b) => a.tierNumber - b.tierNumber)
      .map((tier) => ({ id: tier.kycRef, label: tierOptionLabel(tier) }));
    const currentId = rule?.minimumKycTier?.kycRef;
    if (currentId && !choices.some((tier) => tier.id === currentId)) {
      choices.unshift({ id: currentId, label: tierLabel(rule.minimumKycTier) });
    }
    return choices;
  }, [rule, tiersQuery.data]);
  return { tierChoices, tiersQuery };
}

function TierField<T extends { kycTierId: string }>({
  control,
  tierChoices,
  loading,
}: {
  control: Control<T>;
  tierChoices: TierChoice[];
  loading: boolean;
}) {
  const typedControl = control as unknown as Control<{ kycTierId: string }>;
  return (
    <FormField control={typedControl} name="kycTierId" label="Minimum KYC tier" required>
      {({ field }) => (
        <Select
          value={field.value || null}
          onValueChange={(value) => {
            if (typeof value === "string") field.onChange(value);
          }}
          disabled={loading || tierChoices.length === 0}
        >
          <FormSelectTrigger>
            <SelectValue>
              {(selected: string | null) =>
                tierChoices.find((tier) => tier.id === selected)?.label ??
                (loading ? "Loading tiers..." : "Select a KYC tier")
              }
            </SelectValue>
          </FormSelectTrigger>
          <SelectContent>
            {tierChoices.map((tier) => (
              <SelectItem key={tier.id} value={tier.id}>
                {tier.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </FormField>
  );
}

function EndpointPicker({
  endpoints,
  takenKeys,
  value,
  loading,
  onChange,
}: {
  endpoints: KycAccessEndpointOption[];
  takenKeys: Map<string, string>;
  value: string;
  loading: boolean;
  onChange: (key: string) => void;
}) {
  const selected = endpoints.find((item) => item.key === value) ?? null;

  return (
    <Combobox.Root<KycAccessEndpointOption>
      items={endpoints}
      value={selected}
      onValueChange={(next) => onChange(next?.key ?? "")}
      itemToStringLabel={(item) => item.label || item.key}
      itemToStringValue={(item) => item.key}
      isItemEqualToValue={(item, current) => item.key === current.key}
      filter={(item, query) => {
        const needle = query.trim().toLowerCase();
        if (!needle) return true;
        return (item.label || item.key).toLowerCase().includes(needle);
      }}
      disabled={loading || endpoints.length === 0}
    >
      <div className="relative">
        <Combobox.Input
          placeholder={loading ? "Loading endpoints..." : "Search endpoints by name"}
          className="form-control-base form-control-focus form-control-invalid pr-10"
        />
        <Combobox.Trigger
          aria-label="Show endpoints"
          className="absolute right-3 top-1/2 inline-flex size-5 -translate-y-1/2 items-center justify-center rounded-full border border-primary-black text-primary-black"
        >
          <ChevronDownIcon className="pointer-events-none size-4" />
        </Combobox.Trigger>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner sideOffset={4} className="isolate z-50">
          <Combobox.Popup className="max-h-[min(320px,var(--available-height))] w-(--anchor-width) overflow-y-auto rounded-2xl border border-primary-grey-stroke bg-primary-white p-1 text-text-black shadow-md">
            <Combobox.Empty className="px-3 py-2 text-sm text-text-grey empty:hidden">
              No endpoints match your search.
            </Combobox.Empty>
            <Combobox.List>
              {(item: KycAccessEndpointOption) => {
                const hint = endpointResourceHint(item);
                return (
                  <Combobox.Item
                    key={item.key}
                    value={item}
                    className="relative flex cursor-default flex-col gap-0.5 rounded-xl py-2 pl-2 pr-8 text-sm outline-hidden select-none data-highlighted:bg-primary-grey-undertone"
                  >
                    <span className="font-medium">
                      {item.label || item.key}
                      {takenKeys.has(item.key) ? (
                        <span className="ml-1 text-xs font-normal text-text-grey">· has a rule</span>
                      ) : null}
                    </span>
                    <span className="text-xs text-text-grey">
                      {[item.method?.toUpperCase(), item.path].filter(Boolean).join(" ")}
                      {hint ? ` · in ${hint}` : ""}
                    </span>
                    <Combobox.ItemIndicator className="absolute right-2 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center">
                      <CheckIcon className="size-4" />
                    </Combobox.ItemIndicator>
                  </Combobox.Item>
                );
              }}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function endpointDescription(endpoint?: KycAccessEndpointOption) {
  if (!endpoint) return undefined;
  const hint = endpointResourceHint(endpoint);
  return hint
    ? `${endpoint.key} · This route already belongs to the ${hint} resource.`
    : endpoint.key;
}

function SubmitErrorNotice({ error }: { error: KycAccessMutationError }) {
  return (
    <Notice tone="error">
      <span>{error.message}</span>
      {error.isDuplicate && error.existingRuleId ? (
        <>
          {" "}
          <Link
            className="font-semibold underline"
            href={route.dashboard.kycResourceAccessEdit(error.existingRuleId)}
          >
            Edit the existing rule
          </Link>
        </>
      ) : null}
    </Notice>
  );
}

function Notice({ tone, children }: { tone: "error" | "warning"; children: ReactNode }) {
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm",
        tone === "error" ? "bg-alertSoft-error text-alert-error" : "bg-alertSoft-warning text-alert-warning",
      )}
    >
      {children}
    </div>
  );
}

function FormActions({
  onCancel,
  submitLabel,
  pending,
  disabled,
}: {
  onCancel: () => void;
  submitLabel: string;
  pending: boolean;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
      <Button type="button" variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button type="submit" form={FORM_ID} pending={pending} disabled={disabled}>
        {submitLabel}
      </Button>
    </div>
  );
}

function resourceOptionLabel(resource: KycAccessResource) {
  const title = resourceTitle(resource.title);
  const description = resource.description?.trim();
  if (!description || description.toLowerCase() === resource.title?.trim().toLowerCase()) {
    return title;
  }
  return `${title} — ${description}`;
}

function tierOptionLabel(tier: KycTier) {
  const label = tierLabel(tier);
  return tier.isActive === false ? `${label} (inactive)` : label;
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
