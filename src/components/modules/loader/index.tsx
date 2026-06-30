import "@/components/modules/loader/style.css";

type LoaderProps = {
  isOpen: boolean;
  /** Tailwind text color utilities, e.g. "text-cyan-400" */
  className?: string;
  /** Any CSS color string for dynamic/runtime values, e.g. "#f00" */
  color?: string;
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
  color,
  fullScreen,
  transparentBg,
  onClick,
}: LoaderProps) {
  if (!isOpen) return null;

  const wrapperClassName = fullScreen
    ? `fixed inset-0 z-1000 flex items-center justify-center ${transparentBg ? "" : "bg-black/50"}`.trim()
    : undefined;

  const bars = (
    <span className={`loader ${className ?? ""}`.trim()} style={color ? { color } : undefined} />
  );

  return onClick ? (
    <button type="button" aria-label="Loading" onClick={onClick} className={wrapperClassName}>
      {bars}
    </button>
  ) : (
    <div className={wrapperClassName}>{bars}</div>
  );
}
