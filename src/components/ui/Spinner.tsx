import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: number;
  className?: string;
}

export default function Spinner({ size = 24, className }: SpinnerProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2 size={size} className="animate-spin text-accent" />
    </div>
  );
}
