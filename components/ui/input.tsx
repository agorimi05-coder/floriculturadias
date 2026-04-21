import React from "react";
import { cn } from "./utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-10 w-full rounded-xl border border-[#decac3] bg-white px-3 py-2 text-sm text-[#2a2a2a] outline-none transition placeholder:text-[#9b8a80] focus:border-[#5a7c59]",
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = "Input";
