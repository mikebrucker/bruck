import { cn } from "@/lib/utils";

type ChipProps = {
  text: string;
  className?: string;
};

export function Chip({ text, className }: ChipProps) {
  return (
    <span className={cn("bg-muted rounded px-1.5 py-0.5 text-sm font-medium", className)}>
      {text}
    </span>
  );
}
