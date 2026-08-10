import Loader from "@/components/ui/loader";

export default function Loading() {
  return (
    <div className="flex flex-1 w-full items-center justify-center">
      <Loader className="text-theme-500" isOpen />
    </div>
  );
}
