"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/helpers/utils";
import { INPUT } from "./fortune-colors";

/** Input styled to match the fortune card — rounded-xl, frosted glass, subtle borders */
const FortuneInput = forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type = "text", ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        data-slot="fortune-input"
        className={cn(
          "w-full px-4 py-3 rounded-xl text-base text-foreground placeholder:text-muted-foreground",
          "backdrop-blur-sm border shadow-sm",
          "focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40",
          "transition-colors duration-200",
          "disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
        style={{
          background: INPUT.bg,
          borderColor: INPUT.border,
        }}
        {...props}
      />
    );
  },
);

FortuneInput.displayName = "FortuneInput";

export { FortuneInput };
