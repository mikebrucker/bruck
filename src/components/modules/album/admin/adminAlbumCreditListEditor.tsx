"use client";

import { Add01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type CreditForm, emptyCredit } from "./adminAlbumFormTypes";

function AdminAlbumCreditListEditor({
  credits,
  onChange,
  disabled,
}: {
  credits: Array<CreditForm>;
  onChange: (next: Array<CreditForm>) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const update = (index: number, patch: Partial<CreditForm>) => {
    onChange(credits.map((credit, i) => (i === index ? { ...credit, ...patch } : credit)));
  };
  const remove = (index: number) => {
    onChange(credits.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2">
      {credits.map((credit, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: list has no stable id, reordering not supported
        <div key={index} className="flex flex-col gap-2 rounded-lg border border-border p-2">
          <div className="flex gap-2">
            <Input
              placeholder={t(($) => $.admin.placeholder.name)}
              disabled={disabled}
              value={credit.name}
              onChange={(e) => update(index, { name: e.target.value })}
            />
            <Input
              placeholder={t(($) => $.admin.placeholder.roles)}
              disabled={disabled}
              value={credit.roles}
              onChange={(e) => update(index, { roles: e.target.value })}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={disabled}
              aria-label={t(($) => $.ariaLabels.remove_credit)}
              onClick={() => remove(index)}
            >
              <HugeiconsIcon icon={Delete02Icon} className="size-5" />
            </Button>
          </div>
          <Input
            placeholder={t(($) => $.admin.placeholder.notes)}
            disabled={disabled}
            value={credit.notes}
            onChange={(e) => update(index, { notes: e.target.value })}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        className="self-start"
        onClick={() => onChange([...credits, emptyCredit()])}
      >
        <HugeiconsIcon icon={Add01Icon} className="size-4" />
        {t(($) => $.admin.button.add_credit)}
      </Button>
    </div>
  );
}

export { AdminAlbumCreditListEditor };
