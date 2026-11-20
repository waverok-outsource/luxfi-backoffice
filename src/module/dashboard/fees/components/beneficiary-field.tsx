"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";

import { ReferenceSearch } from "@/module/dashboard/fees/components/reference-search";
import { fetchFeeBeneficiaries } from "@/services/client/fee.fns";
import type { FeeFormValues } from "@/schema/fee.schema";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { getFullName } from "@/util/helper";
import keyFactory from "@/util/query-key-factory";

const OBJECT_ID = /^[a-fA-F0-9]{24}$/;

type BeneficiaryFieldProps = {
  control: Control<FeeFormValues>;
  setValue: UseFormSetValue<FeeFormValues>;
  error?: string;
};

export function BeneficiaryField({ control, setValue, error }: BeneficiaryFieldProps) {
  const beneficiaryId = useWatch({ control, name: "beneficiaryId" });
  const beneficiaryLabel = useWatch({ control, name: "beneficiaryLabel" });
  const [userType, setUserType] = useState<"platform" | "customer">("platform");
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 400);
  const search = convertObjectToQuery({
    userType,
    q: debounced,
    page: "1",
    limit: "8",
  });

  const { data, isFetching } = useQuery({
    queryKey: keyFactory.fees.beneficiaries(search),
    queryFn: () => fetchFeeBeneficiaries(search),
    enabled: debounced.length > 0,
  });

  const options = (data?.data ?? []).map((member) => ({
    id: member.userRef,
    label: getFullName(member),
    hint: member.email,
  }));
  const manualId = OBJECT_ID.test(debounced) ? debounced : "";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {(
          [
            ["platform", "Platform user"],
            ["customer", "Customer"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={
              userType === value
                ? "rounded-full bg-primary-black px-3 py-1.5 text-xs font-semibold text-primary-white"
                : "rounded-full border border-primary-grey-stroke px-3 py-1.5 text-xs font-semibold text-text-grey"
            }
            onClick={() => setUserType(value)}
          >
            {label}
          </button>
        ))}
      </div>
      <ReferenceSearch
        query={query}
        onQueryChange={setQuery}
        placeholder="Search by full email, name, or user id"
        options={options}
        isLoading={isFetching}
        selected={
          beneficiaryId
            ? [{ id: beneficiaryId, label: beneficiaryLabel || beneficiaryId, hint: beneficiaryId }]
            : []
        }
        onSelect={(option) => {
          setValue("beneficiaryId", option.id, { shouldValidate: true, shouldDirty: true });
          setValue("beneficiaryLabel", option.hint ? `${option.label} · ${option.hint}` : option.label, {
            shouldDirty: true,
          });
          setQuery("");
        }}
        onRemove={() => {
          setValue("beneficiaryId", "", { shouldValidate: true, shouldDirty: true });
          setValue("beneficiaryLabel", "", { shouldDirty: true });
        }}
        emptyHint="No user matched. Search uses the full email, first name, last name, or user id."
        manualOption={
          manualId
            ? { id: manualId, label: "Use this user id", hint: manualId }
            : null
        }
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}
