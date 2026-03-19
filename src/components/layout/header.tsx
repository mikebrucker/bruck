import { cn } from "@/lib/utils";

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header className={cn("w-full", className)} {...props}>
      <div className="bg-emerald-100 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
        <div className="bg-emerald-200 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
          <div className="bg-emerald-300 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
            <div className="bg-emerald-400 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
              <div className="bg-emerald-500 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                <div className="bg-emerald-600 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                  <div className="bg-emerald-700 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                    <div className="bg-emerald-800 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded">
                      <div className="bg-emerald-900 px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 transition-[padding-inline] duration-1000 py-2 rounded ">
                        <h1 className="font-bold text-xl sm:text-3xl md:text-4xl text-center font-asimovian text-shadow-lg text-shadow-zinc-900 transition-[font-size] duration-1000">
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
  );
}

export { Header };
