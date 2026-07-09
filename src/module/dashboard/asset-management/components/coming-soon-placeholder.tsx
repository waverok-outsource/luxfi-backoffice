import { Clock } from "lucide-react";

type ComingSoonPlaceholderProps = {
  title: string;
};

export function ComingSoonPlaceholder({ title }: ComingSoonPlaceholderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-primary-white py-24 text-center">
      <span className="inline-flex size-12 items-center justify-center rounded-full bg-primary-grey-undertone text-text-grey">
        <Clock className="size-5" />
      </span>
      <div>
        <p className="font-semibold text-text-black">{title}</p>
        <p className="text-sm text-text-grey">Coming soon</p>
      </div>
    </div>
  );
}
