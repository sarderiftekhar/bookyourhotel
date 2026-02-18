import { cn } from "@/lib/utils";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
}

export default function Card({ className, children, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-border overflow-hidden",
        hover && "transition-shadow duration-300 hover:shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
