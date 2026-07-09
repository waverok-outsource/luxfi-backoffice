"use client";

import * as React from "react";

import { mockPortfolioAssetsByPortfolioId } from "@/module/dashboard/asset-management/user-portfolios/data";
import type {
  AssetVerificationPayload,
  AssetVerificationRecord,
  BlacklistAssetPayload,
} from "@/types/asset-verification.type";

type UserPortfolioAssetsContextValue = {
  assets: AssetVerificationRecord[];
  updateAsset: (payload: AssetVerificationPayload) => void;
  blacklistAsset: (payload: BlacklistAssetPayload) => void;
};

const UserPortfolioAssetsContext = React.createContext<UserPortfolioAssetsContextValue | null>(null);

export function UserPortfolioAssetsProvider({
  portfolioId,
  children,
}: {
  portfolioId: string;
  children: React.ReactNode;
}) {
  const [assets, setAssets] = React.useState<AssetVerificationRecord[]>(
    () => mockPortfolioAssetsByPortfolioId[portfolioId] ?? [],
  );

  const updateAsset = React.useCallback((payload: AssetVerificationPayload) => {
    setAssets((previous) =>
      previous.map((asset) =>
        asset.id === payload.assetId
          ? {
              ...asset,
              status: payload.targetStatus,
              rejectionReason: payload.rejectionReason,
              loanOfferAmount: payload.loanOfferAmount,
              submittedDateLabel: payload.submittedDateLabel,
              examinationDateLabel: payload.examinationDateLabel,
              examinationOfficerEmail: payload.examinationOfficerEmail,
              remarks: payload.remarks,
              certificationPapersAvailable: payload.certificationPapersAvailable,
              boxPackaged: payload.boxPackaged,
              preOwned: payload.preOwned,
              anyPhysicalDefects: payload.anyPhysicalDefects,
              proofFileName: payload.proofFileName,
              lastUpdatedAtLabel: new Date().toLocaleString(),
            }
          : asset,
      ),
    );
  }, []);

  const blacklistAsset = React.useCallback((payload: BlacklistAssetPayload) => {
    setAssets((previous) =>
      previous.map((asset) => (asset.id === payload.assetId ? { ...asset, isBlacklisted: true } : asset)),
    );
  }, []);

  const value = React.useMemo(
    () => ({ assets, updateAsset, blacklistAsset }),
    [assets, updateAsset, blacklistAsset],
  );

  return <UserPortfolioAssetsContext.Provider value={value}>{children}</UserPortfolioAssetsContext.Provider>;
}

export function useUserPortfolioAssetsContext() {
  const context = React.useContext(UserPortfolioAssetsContext);

  if (!context) {
    throw new Error("useUserPortfolioAssetsContext must be used within UserPortfolioAssetsProvider");
  }

  return context;
}
