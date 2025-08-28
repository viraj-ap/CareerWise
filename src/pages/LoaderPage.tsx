import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

const LoaderPage = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center h-screen w-screen bg-transparent z-50",
        className
      )}
    >
      <img src="/logo.png"  alt="logo" className="dark:invert h-96" />
      <p className="text-xl">CareerWise</p>
      <p className="text-sm">Crack your next interview with CareerWise!</p>

      <h1 className="text-md mb-2">Hang on tight while we load the page for you...</h1>
      <Loader className="w-12 h-12 min-w-6 animate-spin min-h-6 text-green-300" />
    </div>
  );
};

export default LoaderPage;
