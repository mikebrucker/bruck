import { cn } from "@/lib/utils";

type NoteProps = {
  text: string;
  className?: string;
};

export function Note({ text, className }: NoteProps) {
  return (
    <p
      className={cn(
        "bg-accent border border-border border-l-4 border-l-theme-500 rounded-primary p-3 text-sm leading-relaxed italic whitespace-pre-line",
        className,
      )}
    >
      {text}
    </p>
  );
}
