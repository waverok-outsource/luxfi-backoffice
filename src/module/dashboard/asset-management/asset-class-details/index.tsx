"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";

import { TableSearchField } from "@/components/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useURLQuery } from "@/hooks/useUrlQuery";
import { AssetClassDetailsHeader } from "@/module/dashboard/asset-management/asset-class-details/components/asset-class-details-header";
import { AssetClassMetrics } from "@/module/dashboard/asset-management/asset-class-details/components/asset-class-metrics";
import { ASSET_CLASS_DETAILS_TAB_COMPONENTS } from "@/module/dashboard/asset-management/asset-class-details/components/tab-table-components";
import {
  DEFAULT_ASSET_CLASS_DETAILS_TAB,
  assetClassDetailsTabs,
  type AssetClassDetailsTabValue,
} from "@/module/dashboard/asset-management/asset-class-details/data";
import {
  useAssetCategories,
  useAssetClassDetails,
  useAssets,
} from "@/services/queries/asset-management.queries";
import type { AssetClassType } from "@/types/asset-management.type";
import convertObjectToQuery from "@/util/convertObjectToQuery";
import route from "@/util/route";

type AssetClassDetailsQuery = {
  tab?: string;
  page?: string;
  q?: string;
  category?: string;
  year?: string;
};

function isAssetClassDetailsTab(value: string | null | undefined): value is AssetClassDetailsTabValue {
  return assetClassDetailsTabs.some((tab) => tab.value === value);
}

function AssetClassDetailsContent({ assetClass }: { assetClass: AssetClassType }) {
  const router = useRouter();
  const { value, setURLQuery } = useURLQuery<AssetClassDetailsQuery>();

  const activeTab = isAssetClassDetailsTab(value.tab) ? value.tab : DEFAULT_ASSET_CLASS_DETAILS_TAB;
  const activeTabConfig = ASSET_CLASS_DETAILS_TAB_COMPONENTS[activeTab];
  const activeCategory = value.category ?? "all";
  const activeYear = value.year ?? "all";

  const { data: categoriesResponse } = useAssetCategories(
    convertObjectToQuery({ assetClassId: assetClass.classId }),
  );
  const { data: assetsResponse } = useAssets(convertObjectToQuery({ assetClassId: assetClass.classId }));

  const categoryOptions = categoriesResponse?.data ?? [];
  const yearOptions = React.useMemo(
    () =>
      Array.from(new Set((assetsResponse?.data ?? []).map((item) => item.productionYear)))
        .sort()
        .reverse(),
    [assetsResponse],
  );

  const handleTabChange = (nextTab: string) => {
    if (!isAssetClassDetailsTab(nextTab)) {
      return;
    }

    setURLQuery({ tab: nextTab, page: undefined, q: undefined, category: undefined, year: undefined });
  };

  return (
    <div className="space-y-4">
      <AssetClassDetailsHeader
        assetClass={assetClass}
        onBack={() => router.push(route.dashboard.assetManagement)}
      />

      <AssetClassMetrics assetClass={assetClass} />

      <div className="space-y-3">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="no-scrollbar w-full overflow-x-auto">
            <TabsList variant="line" className="w-full min-w-max justify-start gap-8 px-5">
              {assetClassDetailsTabs.map((tab) => (
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
            {activeTab === "manage-assets" ? (
              <>
                <Select
                  value={activeCategory}
                  onValueChange={(nextCategory) =>
                    setURLQuery({
                      category: nextCategory && nextCategory !== "all" ? nextCategory : undefined,
                    })
                  }
                >
                  <SelectTrigger className="w-[170px]" size="sm">
                    <SelectValue>
                      {(selected: string | null) => {
                        if (!selected || selected === "all") {
                          return "All Categories";
                        }
                        return categoryOptions.find((category) => category.reference === selected)?.name ?? "All Categories";
                      }}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.reference} value={category.reference}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={activeYear}
                  onValueChange={(nextYear) =>
                    setURLQuery({ year: nextYear && nextYear !== "all" ? nextYear : undefined })
                  }
                >
                  <SelectTrigger className="w-[150px]" size="sm">
                    <SelectValue>
                      {(selected: string | null) => (selected && selected !== "all" ? selected : "All Time")}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    {yearOptions.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : null}

            {activeTabConfig.slots.action ? activeTabConfig.slots.action(assetClass) : null}
          </div>
        </div>

        {activeTabConfig.slots.content(assetClass)}
      </div>
    </div>
  );
}

export function AssetClassDetailsDashboard() {
  const router = useRouter();
  const params = useParams<{ assetClassId?: string }>();
  const assetClassId =
    params?.assetClassId && typeof params.assetClassId === "string"
      ? decodeURIComponent(params.assetClassId)
      : "";

  const { data: assetClassResponse, isLoading } = useAssetClassDetails(assetClassId);
  const assetClass = assetClassResponse?.data ?? null;

  if (isLoading && !assetClass) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="text-text-grey">Loading asset class...</p>
      </div>
    );
  }

  if (!assetClass) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
        <p className="font-semibold text-text-black">Asset class not found</p>
        <button
          type="button"
          className="text-sm text-primary-gold-brand underline"
          onClick={() => router.push(route.dashboard.assetManagement)}
        >
          Back to Asset Management
        </button>
      </div>
    );
  }

  return <AssetClassDetailsContent assetClass={assetClass} />;
}
