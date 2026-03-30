import type { ReactNode } from "react";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import authCoverImg from "@/asset/auth-cover-img.jpg";

interface AuthFormLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
  footerText?: string;
}

function AuthFormLayout({
  title,
  description,
  children,
  footerText = `Waverok Technologies © ${new Date().getFullYear()}`,
}: AuthFormLayoutProps) {
  return (
    <div className="h-full w-full bg-alertSoft-disabled px-6 py-8 lg:px-8 lg:py-10">
      <div className="mx-auto grid h-full w-full max-w-[1440px] gap-6 min-[721px]:grid-cols-2 lg:gap-10 min-[1025px]:grid-cols-[0.92fr_1.08fr]">
        <div className="flex h-full min-h-0 flex-col">
          <div className="mb-8 flex items-center gap-5">
            <Logo variant="gold" width={70} height={60} className="shrink-0" />
            <div>
              <h1 className="text-[32px] font-bold leading-none text-text-black">{title}</h1>
              <p className="mt-1 text-base leading-snug text-text-black">{description}</p>
            </div>
          </div>

          <div className="flex-1 rounded-3xl bg-primary-white p-8 shadow-[0_16px_36px_rgba(0,0,0,0.06)]">
            {children}
          </div>

          <p className="mt-5 text-center text-base">{footerText}</p>
        </div>

        <div className="relative hidden h-full overflow-hidden rounded-3xl bg-[#1a1a1a] min-[721px]:flex">
          <Image
            src={authCoverImg}
            alt="auth cover image"
            fill
            priority
            sizes="(min-width: 1025px) 55vw, (min-width: 721px) 50vw, 0vw"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
          />

          <div className="relative z-10 flex w-[calc(100%-3rem)] flex-1 flex-col items-center p-6">
            <span className="rounded-full bg-[#C8A15940] px-8 py-3 text-base text-white backdrop-blur-sm font-semibold">
              BACK OFFICE ADMIN PORTAL
            </span>

            <div className="relative z-10 flex w-full flex-1 flex-col items-center justify-center rounded-2xl bg-black/20 mt-5">
              <Logo variant="white" width={150} height={150} />

              <p className="text-center text-2xl leading-snug text-white font-medium">
                <span className="font-bold">Luxury Capital Financing</span> at the Best Possible
                Rates
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export { AuthFormLayout };
