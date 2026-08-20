"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserRound } from "lucide-react";
import Storage from "@/util/storage";
import { getFullName } from "@/util/helper";

export function DashboardTopHeader() {
  const [user] = useState(() => Storage.getUser());
  const displayName = user ? getFullName(user) : "—";
  const displayEmail = user?.email ?? "—";
  const profileUrl = user?.profileUrl;

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-0 py-0 md:flex-nowrap">
      <div className="flex w-full items-center gap-3 md:max-w-xl">
        <Logo variant="gold" asLink width={80} height={80} className="shrink-0" />
        <div className="w-full">
          <Input
            placeholder="Search"
            startAdornment={<Search className="h-4 w-4 text-[#1d2742]" />}
            className="rounded-2xl h-12"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-2xl bg-[#f5f5f5] p-1.5">
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#d9d9d9]">
          {profileUrl ? (
            <Image
              src={profileUrl}
              alt={displayName}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <UserRound className="h-5 w-5 text-text-grey" />
          )}
        </div>
        <div className="max-w-[180px] text-sm leading-tight">
          <p className="truncate font-semibold text-primary-black">{displayName}</p>
          <p className="truncate text-text-grey">{displayEmail}</p>
        </div>
        <Badge variant="active">Online</Badge>
      </div>
    </header>
  );
}
