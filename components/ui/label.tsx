import React from "react";
import { cn } from "./utils";

export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-sm font-medium text-[#2a2a2a]", className)} {...props} />
  ),
);

Label.displayName = "Label";
