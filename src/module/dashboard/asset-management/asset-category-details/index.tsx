"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { TableSearchField } from "@/components/table";
import { StatCard } from "@/components/dashboard/stat-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetCategoryDetailsHeader } from "@/module/dashboard/asset-management/asset-category-details/components/asset-category-details-header";
import { ASSET_CATEGORY_DETAILS_TAB_COMPONENTS } from "@/module/dashboard/asset-management/asset-category-details/components/tab-table-components";
import {
  DEFAULT_ASSET_CATEGORY_DETAILS_TAB,
  assetCategoryDetailsTabs,
  type AssetCategoryDetailsTabValue,
} from "@/module/dashboard/asset-management/asset-category-details/data";
import {
  useAssetCategories,
  useAssetCategoryDetails,
  useAssetClassDetails,
} from "@/services/queries/asset-management.queries";
import type { AssetCategoryType, AssetClassType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import route from "@/util/route";

type AssetCategoryDetailsQuery = {
  tab?: string;
  q?: string;
};

function isAssetCategoryDetailsTab(
  value: string | null | undefined,
): value is AssetCategoryDetailsTabValue {
  return assetCategoryDetailsTabs.some((tab) => tab.value === value);
}

function matchesCategoryId(category: AssetCategoryType, categoryId: string) {
  return (
    category.assetCategoryId === categoryId ||
    category.reference === categoryId ||
    category.categoryRef === categoryId
  );
}

function AssetCategoryMetrics({ assetCategory }: { assetCategory: AssetCategoryType }) {
  const metrics = [
    { title: "Brands", value: String(assetCategory.brandsCount ?? 0) },
    { title: "Assets", value: String(assetCategory.assetsCount) },
    {
      title: "Status",
      value: assetCategory.status === "published" ? "Published" : "Unpublished",
    },
    {
      title: "Override Config",
      value: assetCategory.overrideParentClassConfigurations ? "Yes" : "No",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <StatCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          valueClassName="whitespace-nowrap"
        />
      ))}
    </div>
  );
}

function AssetCategoryDetailsContent({
  assetClass,
  assetCategory,
}: {
  assetClass: AssetClassType;
  assetCategory: AssetCategoryType;
}) {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<AssetCategoryDetailsQuery>();

  const activeTab = isAssetCategoryDetailsTab(value.tab)
    ? value.tab
    : DEFAULT_ASSET_CATEGORY_DETAILS_TAB;
  const activeTabConfig = ASSET_CATEGORY_DETAILS_TAB_COMPONENTS[activeTab];

  const handleTabChange = (nextTab: string) => {
    if (!isAssetCategoryDetailsTab(nextTab)) {
      return;
    }

    setURLQuery({
      tab: nextTab,
      q: undefined,
    });
  };

  return (
    <div className="space-y-4">
      <AssetCategoryDetailsHeader
        assetClass={assetClass}
        assetCategory={assetCategory}
        onBack={() =>
          router.push(`${route.dashboard.assetClass(assetClass.assetClassId)}?tab=manage-categories`)
        }
      />

      <AssetCategoryMetrics assetCategory={assetCategory} />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {assetCategoryDetailsTabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-sm leading-tight md:text-base"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
        </Tabs>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-md">
            <TableSearchField placeholder="Search name or ID" />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeTabConfig.slots.action ? activeTabConfig.slots.action(assetCategory) : null}
          </div>
        </div>

        {activeTabConfig.slots.content(assetCategory)}
      </div>
    </div>
  );
}

export function AssetCategoryDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ assetClassId?: string; categoryId?: string }>();
  const assetClassId =
    params?.assetClassId && typeof params.assetClassId === "string"
      ? decodeURIComponent(params.assetClassId)
      : "";
  const categoryId =
    params?.categoryId && typeof params.categoryId === "string"
      ? decodeURIComponent(params.categoryId)
      : "";

  const { data: assetClassResponse, isLoading: isClassLoading } = useAssetClassDetails(assetClassId);
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useAssetCategories(
    convertObjectToQuery({ assetClassId }),
  );
  const { data: categoryDetailsResponse, isLoading: isCategoryDetailsLoading } =
    useAssetCategoryDetails(categoryId);

  const assetClass = assetClassResponse?.data ?? null;
  const assetCategory =
    (categoriesResponse?.data ?? []).find((category) => matchesCategoryId(category, categoryId)) ??
    categoryDetailsResponse?.data ??
    null;
  const isLoading =
    (isClassLoading && !assetClass) ||
    ((isCategoriesLoading || isCategoryDetailsLoading) && !assetCategory);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="text-text-grey">Loading category...</p>
      </div>
    );
  }

  if (!assetClass || !assetCategory) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">Asset category not found</p>
        <button
          type="button"
          className="text-sm text-primary-gold-brand underline"
          onClick={() =>
            router.push(
              assetClassId
                ? `${route.dashboard.assetClass(assetClassId)}?tab=manage-categories`
                : route.dashboard.assetManagement,
            )
          }
        >
          Back to Asset Class
        </button>
      </div>
    );
  }

  return <AssetCategoryDetailsContent assetClass={assetClass} assetCategory={assetCategory} />;
}
