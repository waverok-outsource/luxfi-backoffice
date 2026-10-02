"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  DataTable,
  createActionColumnWithOptions,
  createIdentifierColumn,
  createStatusColumn,
  createTextColumn,
} from "@/components/table";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetBrandConfigurationModal } from "@/module/dashboard/asset-management/asset-category-details/components/modals/asset-brand-configuration-modal";
import {
  ASSET_BRAND_STATUS_CONFIG,
  normalizeAssetBrandStatus,
} from "@/module/dashboard/asset-management/asset-category-details/data";
import { useAssetBrands } from "@/services/queries/asset-management.queries";
import type { AssetBrandStatus, AssetBrandType, AssetCategoryType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import { toTitleCase } from "@/util/helper";

type AssetBrandTableRow = Record<string, unknown> & {
  id: string;
  brandName: string;
  assetsCount: number;
  status: AssetBrandStatus;
};

type ManageBrandsTabProps = {
  assetCategory: AssetCategoryType;
};

function matchesCategory(brand: AssetBrandType, category: AssetCategoryType) {
  const identifiers = [
    category.assetCategoryId,
    category.reference,
    category.categoryRef,
  ].filter(Boolean);

  return (
    identifiers.includes(brand.categoryId) ||
    identifiers.includes(brand.categoryRef) ||
    (brand.categoryName && brand.categoryName.toLowerCase() === category.name.toLowerCase())
  );
}

export function ManageBrandsTab({ assetCategory }: ManageBrandsTabProps) {
  const { value } = useURLQuery<{ q?: string }>();
  const [editingBrand, setEditingBrand] = React.useState<AssetBrandType | null>(null);

  const searchQuery = (value.q ?? "").trim();
  const brandsQuery = convertObjectToQuery({
    categoryId: assetCategory.assetCategoryId,
    ...(searchQuery ? { q: searchQuery } : {}),
  });

  const { data: brandsResponse, isLoading } = useAssetBrands(brandsQuery);
  const fetchedBrands = brandsResponse?.data ?? [];
  const matchedBrands = fetchedBrands.filter((brand) => matchesCategory(brand, assetCategory));
  const brands = matchedBrands.length > 0 || fetchedBrands.length === 0 ? matchedBrands : fetchedBrands;

  const rows: AssetBrandTableRow[] = brands.map((brand) => ({
    id: brand.brandId,
    brandName: brand.name ? toTitleCase(brand.name) : "-",
    assetsCount: brand.assetsCount,
    status: normalizeAssetBrandStatus(brand.status),
  }));

  const columns: ColumnDef<AssetBrandTableRow, unknown>[] = [
    createIdentifierColumn<AssetBrandTableRow>("Brand ID", "id"),
    createTextColumn<AssetBrandTableRow>("Brand Name", "brandName"),
    createTextColumn<AssetBrandTableRow>("Assets", "assetsCount"),
    createStatusColumn<AssetBrandTableRow, AssetBrandStatus>("Status", ASSET_BRAND_STATUS_CONFIG),
    createActionColumnWithOptions<AssetBrandTableRow>({
      ariaLabel: "Edit brand",
      onView: (row) => {
        const brand = brands.find((candidate) => candidate.brandId === row.id);
        if (brand) {
          setEditingBrand(brand);
        }
      },
    }),
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={rows}
        loading={isLoading}
        emptyStateLabel="No brands found."
        pagination={{ totalEntries: rows.length, pageSize: Math.max(rows.length, 1) }}
      />

      {editingBrand && (
        <AssetBrandConfigurationModal
          mode="edit"
          open={Boolean(editingBrand)}
          onOpenChange={(open) => {
            if (!open) {
              setEditingBrand(null);
            }
          }}
          assetCategory={assetCategory}
          assetBrand={editingBrand}
        />
      )}
    </>
  );
}
