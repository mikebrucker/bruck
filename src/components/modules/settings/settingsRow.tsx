import type { ReactNode } from "react";

interface SettingsRowProps {
  label: string;
  value: string;
  stacked?: boolean;
  action?: ReactNode;
  children: ReactNode;
}

function SettingsRow({ label, value, stacked, action, children }: SettingsRowProps) {
  const text = (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-foreground">{label}</p>
      <p className="text-sm font-medium text-muted-foreground">{value}</p>
    </div>
  );

  return stacked ? (
    <div className="flex flex-col gap-3 px-4">
      <div className="flex items-center justify-between gap-4">
        {text}
        {action}
      </div>
      {children}
    </div>
  ) : (
    <div className="flex items-center justify-between gap-4 px-4">
      {text}
      {children}
    </div>
  );
}

export { SettingsRow };
