import type { ReactNode } from "react";

interface SettingsRowProps {
  label: string;
  value: string;
  children: ReactNode;
}

function SettingsRow({ label, value, children }: SettingsRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-sm font-medium text-muted-foreground">{value}</p>
      </div>
      {children}
    </div>
  );
}

export { SettingsRow };
