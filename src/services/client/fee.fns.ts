import apiHandler from "@/services/api-handler";
import FeeRoute from "@/services/route/fee.route";
import type { SettingsTeamMembersResponseType } from "@/types/settings.type";
import type {
  Fee,
  FeeBeneficiaryUser,
  FeeOptionsResponse,
  FeeQuoteResponse,
  FeeResponse,
  FeesResponse,
  QuoteFeePayload,
} from "@/types/fee.type";

function asId(value: unknown): string {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "_id" in value) {
    const id = (value as { _id?: unknown })._id;
    return id == null ? "" : String(id);
  }
  return "";
}

function normalizeBeneficiary(value: unknown): FeeBeneficiaryUser | null {
  if (!value || typeof value !== "object") return null;
  const user = value as FeeBeneficiaryUser;
  return {
    _id: asId(user._id),
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  };
}

export function normalizeFee(raw: Fee): Fee {
  return {
    ...raw,
    bands: raw.bands ?? [],
    scopeRefs: raw.scopeRefs ?? [],
    value: raw.value ?? 0,
    graceDays: raw.graceDays ?? 0,
    isActive: raw.isActive === true,
    beneficiary: asId(raw.beneficiary) || asId(raw.beneficiaryUser?._id),
    beneficiaryUser: normalizeBeneficiary(raw.beneficiaryUser),
  };
}

export const fetchFees = async (query = "") => {
  const { data } = await apiHandler.get<FeesResponse>(`${FeeRoute.fees}${query ? `?${query}` : ""}`);
  return {
    ...data,
    data: (data.data ?? []).map(normalizeFee),
  };
};

export const fetchFee = async (feeId: string) => {
  const { data } = await apiHandler.get<FeeResponse>(FeeRoute.fee(feeId));
  return {
    ...data,
    data: normalizeFee(data.data),
  };
};

export const fetchFeeOptions = async () => {
  const { data } = await apiHandler.get<FeeOptionsResponse>(FeeRoute.options);
  return data;
};

export const quoteFees = async (payload: QuoteFeePayload) => {
  const { data } = await apiHandler.post<FeeQuoteResponse>(FeeRoute.quote, payload);
  return data.data;
};

export const fetchFeeBeneficiaries = async (query: string) => {
  const { data } = await apiHandler.get<SettingsTeamMembersResponseType>(`/v1/users?${query}`);
  return data;
};
