"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";

import { ReferenceSearch, type ReferenceOption } from "@/module/dashboard/fees/components/reference-search";
import { SCOPE_HINTS } from "@/module/dashboard/fees/form";
import {
  fetchAssetCategories,
  fetchAssetClasses,
  fetchAssets,
} from "@/services/client/asset-management.fns";
import type { FeeFormValues } from "@/schema/fee.schema";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import keyFactory from "@/util/query-key-factory";

const OBJECT_ID = /^[a-fA-F0-9]{24}$/;

type ScopeRefsFieldProps = {
  control: Control<FeeFormValues>;
  setValue: UseFormSetValue<FeeFormValues>;
  error?: string;
};

export function ScopeRefsField({ control, setValue, error }: ScopeRefsFieldProps) {
  const scopeLevel = useWatch({ control, name: "scopeLevel" });
  const scopeRefs = useWatch({ control, name: "scopeRefs" }) ?? [];
  const [query, setQuery] = useState("");
  const debounced = useDebouncedValue(query.trim(), 400);
  const enabled = Boolean(scopeLevel && scopeLevel !== "global" && debounced);
  const search = convertObjectToQuery({ q: debounced, page: "1", limit: "8" });

  const classes = useQuery({
    queryKey: keyFactory.assetManagement.classes.list(search),
    queryFn: () => fetchAssetClasses(search),
    enabled: enabled && scopeLevel === "asset_class",
  });
  const categories = useQuery({
    queryKey: keyFactory.assetManagement.categories.list(search),
    queryFn: () => fetchAssetCategories(search),
    enabled: enabled && scopeLevel === "asset_category",
  });
  const assets = useQuery({
    queryKey: keyFactory.assetManagement.assets.list(search),
    queryFn: () => fetchAssets(search),
    enabled: enabled && scopeLevel === "asset",
  });

  if (!scopeLevel || scopeLevel === "global") {
    return <p className="text-sm text-text-grey">{SCOPE_HINTS.global}</p>;
  }

  const options = optionsFor(scopeLevel, classes.data?.data, categories.data?.data, assets.data?.data);
  const isLoading =
    (scopeLevel === "asset_class" && classes.isFetching) ||
    (scopeLevel === "asset_category" && categories.isFetching) ||
    (scopeLevel === "asset" && assets.isFetching);

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-grey">{SCOPE_HINTS[scopeLevel]}</p>
      <ReferenceSearch
        query={query}
        onQueryChange={setQuery}
        placeholder={placeholderFor(scopeLevel)}
        options={options}
        isLoading={isLoading}
        selected={scopeRefs}
        onSelect={(option) => {
          if (scopeRefs.some((ref) => ref.id === option.id)) return;
          setValue("scopeRefs", [...scopeRefs, { id: option.id, label: option.label }], {
            shouldValidate: true,
            shouldDirty: true,
          });
          setQuery("");
        }}
        onRemove={(id) =>
          setValue(
            "scopeRefs",
            scopeRefs.filter((ref) => ref.id !== id),
            { shouldValidate: true, shouldDirty: true },
          )
        }
        manualOption={manualOption(scopeLevel, debounced)}
      />
      {error ? <p className="text-sm text-red-500">{error}</p> : null}
    </div>
  );
}

function placeholderFor(scopeLevel: string) {
  if (scopeLevel === "asset_class") return "Search asset classes by name";
  if (scopeLevel === "asset_category") return "Search by the full category name, or paste its id";
  return "Search by the full asset name, or paste its id";
}

function optionsFor(
  scopeLevel: string,
  classes: { assetClassId: string; name: string }[] | undefined,
  categories: { categoryRef?: string; reference?: string; name: string; assetCategoryId?: string }[] | undefined,
  assets: { assetId: string; name: string }[] | undefined,
): ReferenceOption[] {
  if (scopeLevel === "asset_class") {
    return (classes ?? []).map((item) => ({
      id: item.assetClassId,
      label: item.name,
      hint: item.assetClassId,
    }));
  }
  if (scopeLevel === "asset_category") {
    return (categories ?? []).flatMap((item) => {
      const id = item.categoryRef || item.reference;
      if (!id) return [];
      return [{ id, label: item.name, hint: item.assetCategoryId || id }];
    });
  }
  return (assets ?? []).map((item) => ({
    id: item.assetId,
    label: item.name,
    hint: item.assetId,
  }));
}

function manualOption(scopeLevel: string, query: string): ReferenceOption | null {
  if (!query) return null;
  if (scopeLevel === "asset_category") {
    return OBJECT_ID.test(query) ? { id: query, label: "Use this category id", hint: query } : null;
  }
  if (query.length < 3) return null;
  return {
    id: query,
    label: scopeLevel === "asset_class" ? "Use this asset class id" : "Use this asset id",
    hint: query,
  };
}
