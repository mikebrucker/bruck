import "@/components/ui/loader/style.css";
import { cn } from "@/lib/utils";

type LoaderProps = {
  isOpen: boolean;
  /** Tailwind text color utilities, e.g. "text-cyan-400" */
  className?: string;
  /** Center the loader over a full-page overlay */
  fullScreen?: boolean;
  /** With fullScreen, skip the dimmed backdrop so the page shows through */
  transparentBg?: boolean;
  /** Makes the wrapper a keyboard-accessible button you can click */
  onClick?: () => void;
};

export default function Loader({
  isOpen,
  className,
  fullScreen,
  transparentBg,
  onClick,
}: LoaderProps) {
  if (!isOpen) return null;

  const backdropClassName = transparentBg ? null : "bg-black/50";
  const wrapperClassName = fullScreen
    ? cn("fixed inset-0 z-1000 flex items-center justify-center", backdropClassName)
    : undefined;

  const bars = <span className={`loader ${className ?? ""}`.trim()} />;

  const label = (
    <span role="status" aria-live="polite" className="sr-only" lang="en">
      Loading
    </span>
  );

  return onClick ? (
    <button type="button" onClick={onClick} className={wrapperClassName}>
      {bars}
      {label}
    </button>
  ) : (
    <div className={wrapperClassName}>
      {bars}
      {label}
    </div>
  );
}
