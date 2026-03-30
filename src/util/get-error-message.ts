import axios from "axios";

type ApiErrorPayload = {
  details?: string[];
  message?: string;
};

export default function getErrorMessage(error: unknown) {
  if (axios.isAxiosError<ApiErrorPayload>(error)) {
    if (error.response?.status === 500) {
      return "An error occured. Please try again!!!";
    }

    if (error.code === "ERR_NETWORK") {
      return "Network error. Please check your internet connection!!!";
    }

    return (
      error.response?.data?.details?.at(0) ||
      error.response?.data?.message ||
      error.message ||
      "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong";
}
