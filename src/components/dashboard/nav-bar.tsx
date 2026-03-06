import Logo from "@/components/ui/logo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, UserRound } from "lucide-react";

export function DashboardTopHeader() {
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
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9d9d9]">
          <UserRound className="h-5 w-5 text-text-grey" />
        </div>
        <div className="text-sm leading-tight">
          <p className="font-semibold text-primary-black">Zen Ikoku</p>
          <p className="text-text-grey">Admin@pawnshoppyblu.com</p>
        </div>
        <Badge variant="active">Online</Badge>
      </div>
    </header>
  );
}
