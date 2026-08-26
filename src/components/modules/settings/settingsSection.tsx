import type { ReactNode } from "react";

interface SettingsSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

function SettingsSection({ id, title, children }: SettingsSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className="flex flex-col gap-2 rounded-primary bg-card border border-border py-3"
    >
      <h2 id={id} className="text-lg font-semibold text-foreground px-4">
        {title}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

export { SettingsSection };
