"use client";

import Image from "next/image";
import { FolderOpen, Triangle, Watch } from "lucide-react";
import type { ReactNode } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
} from "@/components/util/form-controller";
import type { AddToMarketplaceFormValues } from "@/schema/marketplace.schema";
import type { AssetItemType } from "@/types/asset-management.type";
import type { AssetMarketAssetDetails } from "@/types/marketplace.type";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/util/format-currency";

export function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-text-grey">{label}</span>
      <span className="font-semibold text-text-black">{value}</span>
    </div>
  );
}

export function formatDateLabel(isoDate: string) {
  return new Date(isoDate).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

type AssetDetailsPanelProps = {
  assetDetails: AssetMarketAssetDetails | null;
  images: string[];
  className?: string;
  /** Extra rows rendered after the built-in Year/Dial/Case/Weight grid — lets callers compose
   * their own additional fields (e.g. Box-Packaged, Papers Available) without forking this panel. */
  extraRows?: ReactNode;
};

export function AssetDetailsPanel({ assetDetails, images, className, extraRows }: AssetDetailsPanelProps) {
  return (
    <div className={cn("rounded-2xl bg-primary-white p-4", className)}>
      <h3 className="border-b border-primary-grey-stroke pb-3 font-semibold text-text-black">
        Asset Details
      </h3>

      {!assetDetails ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-grey-undertone text-text-grey">
            <FolderOpen className="size-5" />
          </span>
          <p className="text-sm text-text-grey">No data available</p>
        </div>
      ) : (
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-4 gap-3">
            {(images.length ? images : Array.from({ length: 4 }, () => null))
              .slice(0, 4)
              .map((url: string | null, index: number) => (
                <div
                  key={url ?? index}
                  className="relative aspect-square overflow-hidden rounded-xl border border-primary-grey-stroke bg-primary-grey-undertone"
                >
                  {url ? (
                    <Image src={url} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-grey">
                      <Watch className="size-5" />
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="space-y-2 border-t border-primary-grey-stroke pt-4">
            <DetailField label="Asset Name:" value={assetDetails.assetName} />
            <DetailField label="Asset ID:" value={assetDetails.assetId} />
            <DetailField label="Asset Category:" value={assetDetails.category} />
            <DetailField label="Asset Class:" value={assetDetails.assetClass} />
          </div>

          <div className="grid grid-cols-2 gap-y-2 border-t border-primary-grey-stroke pt-4">
            <DetailField
              label="Year"
              value={assetDetails.productionYear && assetDetails.productionYear !== "undefined" ? assetDetails.productionYear : "-"}
            />
            <DetailField label="Dial Colour" value={assetDetails.dialColour || "-"} />
            <DetailField label="Case Colour" value={assetDetails.case?.colour ?? "-"} />
            <DetailField label="Weight" value={assetDetails.weight ? `${assetDetails.weight.value}${assetDetails.weight.unit}` : "-"} />
            <DetailField label="Case Size" value={assetDetails.case ? `${assetDetails.case.size}${assetDetails.case.unit}` : "-"} />
          </div>

          {extraRows}
        </div>
      )}
    </div>
  );
}

export function InfoBox({
  label,
  value,
  className,
}: {
  label: string;
  value: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl bg-primary-white p-4", className)}>
      <p className="text-sm text-text-grey">{label}</p>
      <div className="mt-1">{value}</div>
    </div>
  );
}

export function ValuationPanelShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5 rounded-2xl bg-primary-white p-4", className)}>
      <h3 className="border-b border-primary-grey-stroke pb-3 font-semibold text-text-black">
        Asset Valuation
      </h3>

      {children}
    </div>
  );
}

type ValuationInfoBoxProps = {
  label: string;
  value: string;
  trend?: { value: string; tone: "positive" | "negative"; period: string };
  tone?: "default" | "highlight";
};

export function ValuationInfoBox({ label, value, trend, tone = "default" }: ValuationInfoBoxProps) {
  return (
    <div
      className={cn(
        "rounded-xl p-3",
        tone === "highlight" ? "bg-alertSoft-success" : "bg-primary-grey-undertone",
      )}
    >
      <p className={cn("text-sm", tone === "highlight" ? "text-alert-success" : "text-text-grey")}>
        {label}
      </p>
      <div className="mt-1 flex items-center gap-2">
        <p
          className={cn(
            "text-lg font-semibold",
            tone === "highlight" ? "text-alert-success" : "text-text-black",
          )}
        >
          {value}
        </p>
        {trend ? (
          <Badge
            variant={trend.tone === "negative" ? "error" : "active"}
            className="gap-1 px-2 py-1"
          >
            <span>{trend.value}</span>
            <Triangle
              className={cn("h-2.5 w-2.5 fill-current", trend.tone === "negative" && "rotate-180")}
            />
            <span className="ml-1 border-l border-current/20 pl-1.5">{trend.period}</span>
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

type AssetValuationPanelProps<TFieldValues extends FieldValues> = {
  assetItem: AssetItemType | null;
  control: Control<TFieldValues>;
  disabled?: boolean;
  className?: string;
};

export function AssetValuationPanel<TFieldValues extends FieldValues = AddToMarketplaceFormValues>({
  assetItem,
  control,
  disabled = false,
  className,
}: AssetValuationPanelProps<TFieldValues>) {
  return (
    <ValuationPanelShell className={className}>
      <ValuationInfoBox
        label={assetItem ? "Asset Market Price" : "Unit Market Price"}
        value={assetItem ? formatCurrency(assetItem.price.value, assetItem.price.currencyCode) : "N/A"}
        trend={assetItem ? { value: "2.2%", tone: "negative", period: "Last 24 hrs" } : undefined}
      />

      <FormField
        control={control}
        name={"unitListingPrice" as Path<TFieldValues>}
        label="Unit Listing Price"
        required
      >
        {({ field }) => (
          <FormControl>
            <Input {...field} disabled={disabled} placeholder="0.00" startAdornment="$" />
          </FormControl>
        )}
      </FormField>

      <FormField
        control={control}
        name={"quantity" as Path<TFieldValues>}
        label="Quantity"
        required
      >
        {({ field }) => (
          <FormControl>
            <Input {...field} disabled={disabled} placeholder="0" />
          </FormControl>
        )}
      </FormField>
    </ValuationPanelShell>
  );
}
