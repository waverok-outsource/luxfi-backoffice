"use client";

import type { ReactElement } from "react";

import { AssetPurchaseHistoryTable } from "@/module/dashboard/payments-settlements/components/tables/asset-purchase-history-table";
import { AssetSalesHistoryTable } from "@/module/dashboard/payments-settlements/components/tables/asset-sales-history-table";
import { CustomerWalletDepositsTable } from "@/module/dashboard/payments-settlements/components/tables/customer-wallet-deposits-table";
import { InterestSettlementsTable } from "@/module/dashboard/payments-settlements/components/tables/interest-settlements-table";
import { LoanDisbursementHistoryTable } from "@/module/dashboard/payments-settlements/components/tables/loan-disbursement-history-table";
import { LoanRepaymentHistoryTable } from "@/module/dashboard/payments-settlements/components/tables/loan-repayment-history-table";
import type { PaymentsHistoryTabValue } from "@/module/dashboard/payments-settlements/data";

type PaymentsTabView = {
  slots: {
    content: () => ReactElement;
  };
};

export const PAYMENTS_TAB_COMPONENTS: Record<PaymentsHistoryTabValue, PaymentsTabView> = {
  "asset-sales": {
    slots: {
      content: AssetSalesHistoryTable,
    },
  },
  "asset-purchases": {
    slots: {
      content: AssetPurchaseHistoryTable,
    },
  },
  "loan-repayments": {
    slots: {
      content: LoanRepaymentHistoryTable,
    },
  },
  "loan-disbursements": {
    slots: {
      content: LoanDisbursementHistoryTable,
    },
  },
  "wallet-deposits": {
    slots: {
      content: CustomerWalletDepositsTable,
    },
  },
  "interest-settlements": {
    slots: {
      content: InterestSettlementsTable,
    },
  },
};
