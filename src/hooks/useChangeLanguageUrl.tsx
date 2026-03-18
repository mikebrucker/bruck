import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Language } from "@/i18n/config";

export function useChangeLanguageUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (nextLang: Language) => {
    const segments = pathname.split("/").filter(Boolean);
    console.log(nextLang);
    if (segments.length === 0) {
      router.replace(`/${nextLang}`);
      return;
    }
    if (segments[0] === nextLang) return;
    segments[0] = nextLang;

    const query = searchParams.toString();
    const nextUrl = `/${segments.join("/")}${query ? `?${query}` : ""}`;

    router.replace(nextUrl);
  };
}
