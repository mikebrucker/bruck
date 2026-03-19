"use client";

import { useTranslation } from "react-i18next";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 min-h-dvh items-center flex-start font-sans px-4 py-4">
      <Header />
      <nav className="w-full">
        <div className="bg-emerald-600 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
          <div className="bg-emerald-700 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
            <div className="bg-emerald-800 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded flex flex-col gap-2 items-center justify-around">
              <h6 className="font-bold py-2 px-4 text-xl text-shadow-lg text-shadow-zinc-900">
                {t(($) => $.home.resume)}
              </h6>
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-around">
                <Button
                  variant="outline"
                  className="bg-emerald-900 hover:bg-emerald-600 transition-bg-color duration-333 text-white font-bold py-2 px-4 text-shadow-lg text-shadow-zinc-900"
                  asChild
                >
                  <a
                    href="/mike-brucker-cv.html"
                    target="_blank"
                    rel="noopener"
                  >
                    HTML
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="bg-emerald-900 hover:bg-emerald-600 transition-bg-color duration-333 text-white font-bold py-2 px-4 text-shadow-lg text-shadow-zinc-900"
                  asChild
                >
                  <a href="/mike-brucker-cv.pdf" target="_blank" rel="noopener">
                    PDF
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex flex-col flex-grow items-center w-full">
        <div className="flex flex-col flex-grow bg-zinc-700 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded w-full">
          <div className="flex flex-col flex-grow bg-zinc-600 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded w-full">
            <div className="flex flex-col flex-grow bg-zinc-500 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded justify-center">
              <p className="w-full text-center text-shadow-sm text-shadow-zinc-900">
                {t(($) => $.home.under_construction)}
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
