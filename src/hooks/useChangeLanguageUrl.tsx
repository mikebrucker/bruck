import { usePathname, useSearchParams } from "next/navigation";
import type { Language } from "@/i18n/config";

export function useChangeLanguageUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (nextLang: Language) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) {
      window.history.replaceState(null, "", `/${nextLang}`);
      return;
    }
    if (segments[0] === nextLang) return;
    segments[0] = nextLang;

    const query = searchParams.toString();
    const nextUrl = `/${segments.join("/")}${query ? `?${query}` : ""}`;

    window.history.replaceState(null, "", nextUrl);
  };
}
