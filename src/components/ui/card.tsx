import * as React from "react";
import { cn } from "@/core/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("admin-card p-6", className)} // Usamos la clase del nuevo CSS
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
