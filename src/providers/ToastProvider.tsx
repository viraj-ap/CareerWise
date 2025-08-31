import { Toaster } from "@/components/ui/sonner";

const ToastProvider = () => {
  return (
    <div>
      <Toaster
        richColors
        position="bottom-left"
        theme={
          typeof window !== "undefined"
            ? window.document.documentElement.classList.contains("dark")
              ? "dark"
              : "light"
            : "light"
        }
      />
    </div>
  );
};

export default ToastProvider;
