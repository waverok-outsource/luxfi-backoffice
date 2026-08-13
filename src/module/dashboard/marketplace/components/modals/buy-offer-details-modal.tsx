"use client";

import Image from "next/image";
import { Watch } from "lucide-react";

import { ModalDetailRow, ModalShell } from "@/components/modal";
import { formatDateLabel } from "@/module/dashboard/marketplace/components/modals/asset-panels";
import { OfferReviewModal } from "@/module/dashboard/marketplace/components/modals/offer-review-modal";
import { ModalStatusBadge } from "@/module/dashboard/marketplace/components/modals/offer-panels";
import { resolveOrderStatusVariant } from "@/module/dashboard/marketplace/components/tabs/offer-table-helpers";
import useMarketplaceFns from "@/services/functions/marketplace.fns";
import { useOrderById } from "@/services/queries/marketplace.queries";
import { formatCurrency } from "@/util/format-currency";

type BuyOfferDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
};

export function BuyOfferDetailsModal({ open, onOpenChange, orderId }: BuyOfferDetailsModalProps) {
  const { data: response, isLoading } = useOrderById(orderId);
  const { reviewOrder, loading } = useMarketplaceFns();
  const order = response?.data;

  if (isLoading || !order) {
    return (
      <ModalShell.Root
        open={open}
        onOpenChange={onOpenChange}
        showCloseButton={false}
        closeOnBackdropClick
        shellClassName="max-w-[680px] p-4 sm:p-6"
      >
        <div className="space-y-5">
          <ModalShell.Header
            title="Buy Offer Details"
            showBackButton
            onBack={() => onOpenChange(false)}
          />
          <div className="flex items-center justify-center py-16 text-sm text-text-grey">
            {isLoading ? "Loading order details..." : "Order not found."}
          </div>
        </div>
      </ModalShell.Root>
    );
  }

  const isPending = order.statusRaw === "pending";

  return (
    <OfferReviewModal
      open={open}
      onOpenChange={onOpenChange}
      title="Buy Offer Details"
      isPending={isPending}
      pending={loading.REVIEW_ORDER}
      rejectLabel="Reject Buy Offer"
      approveLabel="Approve Buy Offer"
      approveDialog={{
        title: "Approve Offer?",
        description: (
          <>
            You are about to approve this buy offer{" "}
            <span className="font-semibold text-text-black">{order.reference}</span> from{" "}
            <span className="font-semibold text-text-black">{order.buyer.name}</span>.
          </>
        ),
      }}
      rejectDialog={{
        offerTypeLabel: "buy offer",
        assetName: order.reference,
        assetId: order.orderId,
        partyName: order.buyer.name,
      }}
      approveSuccess={{
        title: "Offer Approved",
        description: "This buy offer has been approved.",
      }}
      rejectSuccess={{
        title: "Offer Rejected",
        description: "This buy offer has been rejected.",
      }}
      onApprove={(onSuccess) => reviewOrder(order.orderId, { status: "approved" }, onSuccess)}
      onReject={(values, onSuccess) =>
        reviewOrder(order.orderId, { status: "rejected", note: values.rejectionReason }, onSuccess)
      }
    >
      <div className="space-y-3">
        <div className="space-y-3 rounded-2xl bg-primary-white p-4">
          <ModalDetailRow
            label="Status"
            value={
              <ModalStatusBadge
                variant={resolveOrderStatusVariant(order.statusRaw)}
                label={order.status}
              />
            }
          />
          <ModalDetailRow label="Order ID:" value={order.orderId} copyText={order.orderId} />
          <ModalDetailRow label="Reference:" value={order.reference} />
          <ModalDetailRow label="Buyer Name:" value={order.buyer.name} />
          <ModalDetailRow label="Buyer Email:" value={order.buyer.email} />
          <ModalDetailRow label="Payment Method:" value={order.paymentMethod} />
          <ModalDetailRow label="Payment Channel:" value={order.paymentChannel} />
          <ModalDetailRow label="Order Date:" value={formatDateLabel(order.transactionDate)} />

          <div className="space-y-3 border-t border-primary-grey-stroke pt-3">
            <ModalDetailRow label="Item Cost" value={formatCurrency(order.saleValue)} />
            <ModalDetailRow label="Fee" value={formatCurrency(order.fee)} />
            <ModalDetailRow label="Total Cost" value={formatCurrency(order.totalCost)} />
          </div>
        </div>

        <div className="rounded-2xl bg-primary-white p-4">
          <h3 className="border-b border-primary-grey-stroke pb-3 font-semibold text-text-black">
            Items ({order.items.length})
          </h3>

          <div className="space-y-3 pt-4">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex gap-3 rounded-xl border border-primary-grey-stroke p-3"
              >
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-primary-grey-undertone">
                  {item.image ? (
                    <Image src={item.image} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-text-grey">
                      <Watch className="size-5" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-text-black">{item.title}</p>
                      <p className="text-xs capitalize text-text-grey">{item.itemType}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-sm font-semibold text-text-black">
                        {formatCurrency(item.subtotal, item.currencyCode)}
                      </p>
                      <p className="text-xs text-text-grey">
                        {formatCurrency(item.price, item.currencyCode)} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                    <span className="text-text-grey">
                      Item ID: <span className="text-text-black">{item.itemId}</span>
                    </span>
                    <span className="text-text-grey">
                      Asset Ref: <span className="text-text-black">{item.assetRefId}</span>
                    </span>
                    <span className="text-text-grey">
                      Listing ID: <span className="text-text-black">{item.listingId}</span>
                    </span>
                    <span className="text-text-grey">
                      Added:{" "}
                      <span className="text-text-black">{formatDateLabel(item.createdAt)}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-primary-grey-stroke pt-2 text-xs">
                    <span className="text-text-grey">
                      Seller: <span className="text-text-black">{item.seller.name}</span>
                    </span>
                    <span className="text-text-grey">
                      Seller Email: <span className="text-text-black">{item.seller.email}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OfferReviewModal>
  );
}
