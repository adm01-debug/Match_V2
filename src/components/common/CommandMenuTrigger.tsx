import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CommandMenuTriggerProps {
  className?: string;
  variant?: "default" | "compact";
}

export function CommandMenuTrigger({
  className,
  variant = "default",
}: CommandMenuTriggerProps) {
  const handleClick = () => {
    // Dispatch keyboard event to open command menu
    const event = new KeyboardEvent("keydown", {
      key: "k",
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  if (variant === "compact") {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={handleClick}
        className={cn("h-9 w-9", className)}
        title="Busca rápida (⌘K)"
      >
        <Search className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      className={cn(
        "relative h-10 w-full justify-start text-sm text-muted-foreground sm:w-64 sm:pr-12",
        className
      )}
    >
      <Search className="mr-2 h-4 w-4" />
      <span className="hidden lg:inline-flex">Buscar...</span>
      <span className="inline-flex lg:hidden">Buscar</span>
      <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}

CommandMenuTrigger.displayName = "CommandMenuTrigger";
