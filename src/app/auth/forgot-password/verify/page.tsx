import VerifyResetPinForm from "@/module/auth/reset-account/verify-reset-pin-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Reset PIN",
};

const Page = () => {
  return <VerifyResetPinForm />;
};

export default Page;
