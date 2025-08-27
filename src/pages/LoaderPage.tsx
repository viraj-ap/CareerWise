import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const LoaderPage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex justify-center items-center h-screen w-screen bg-transparent z-50",
        className
      )}
    >
      <Loader className="w-6 h-6 min-w-6 animate-spin min-h-6" />
    </div>
  );
};

export default LoaderPage;
