import { cn } from "@/lib/utils";

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header className={cn("w-full bg-card px-4 py-3 border-b border-border", className)} {...props}>
      <h1 className="font-bold text-xl sm:text-3xl md:text-4xl font-asimovian text-shadow-lg text-shadow-zinc-900 transition-[font-size] duration-1000">
        Mike Brucker
      </h1>
    </header>
  );
}

export { Header };
