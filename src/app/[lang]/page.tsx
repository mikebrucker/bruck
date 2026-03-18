import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-4 min-h-dvh items-center flex-start font-sans px-4 py-4">
      <header className="w-full">
        <div className="bg-emerald-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
          <div className="bg-emerald-200 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
            <div className="bg-emerald-300 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
              <div className="bg-emerald-400 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                <div className="bg-emerald-500 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                  <div className="bg-emerald-600 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                    <div className="bg-emerald-700 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                      <div className="bg-emerald-800 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                        <div className="bg-emerald-900 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline font-size] duration-1000 py-2 rounded font-bold text-xl sm:text-3xl md:text-4xl text-center">
                          <h1 className="font-asimovian text-shadow-lg text-shadow-zinc-900">
                            Mike Brucker
                          </h1>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <nav className="w-full">
        <div className="bg-emerald-600 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
          <div className="bg-emerald-700 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
            <div className="bg-emerald-800 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded flex flex-col sm:flex-row gap-4 items-center justify-around">
              <Link
                href="/mike-brucker-cv.html"
                className="bg-emerald-900 hover:bg-emerald-600 transition-bg-color duration-333 text-white font-bold py-2 px-4 rounded text-shadow-lg text-shadow-zinc-900"
              >
                Resume/CV as HTML
              </Link>
              <Link
                href="/mike-brucker-cv.pdf"
                className="bg-emerald-900 hover:bg-emerald-600 transition-bg-color duration-333 text-white font-bold py-2 px-4 rounded text-shadow-lg text-shadow-zinc-900"
              >
                Resume/CV as PDF
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex flex-col flex-grow items-center w-full">
        <div className="flex flex-col flex-grow bg-zinc-700 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded w-full">
          <div className="flex flex-col flex-grow bg-zinc-600 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded w-full">
            <div className="flex flex-col flex-grow bg-zinc-500 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded justify-center">
              <p className="w-full text-center text-shadow-sm text-shadow-zinc-900">
                Website Under Construction...
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
