import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium shadow-sm backdrop-blur-sm transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-admin-success/30 bg-admin-success/20 text-admin-success hover:bg-admin-success/30 hover:shadow-md",
        secondary:
          "border-secondary/30 bg-secondary/20 text-secondary hover:bg-secondary/30 hover:shadow-md",
        destructive:
          "border-red-500/30 bg-red-500/20 text-red-600 hover:bg-red-500/30 hover:shadow-md",
        outline:
          "border-gray-700/30 bg-primary/20 text-dark-secondary hover:bg-primary/30 hover:text-dark-primary",
        warning:
          "border-admin-warning/30 bg-admin-warning/20 text-warning-DEFAULT hover:bg-admin-warning/30 hover:shadow-md",
        info: "border-admin-info/30 bg-admin-info/20 text-admin-info hover:bg-admin-info/30 hover:shadow-md",
        accent:
          "border-admin-accent/30 bg-admin-accent/20 text-admin-accent hover:bg-admin-accent/30 hover:shadow-md",
        purple:
          "border-purple-500/30 bg-purple-500/20 text-purple-600 hover:bg-purple-500/30 hover:shadow-md",
        teal: "border-teal-500/30 bg-teal-500/20 text-teal-600 hover:bg-teal-500/30 hover:shadow-md",
        indigo:
          "border-indigo-500/30 bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/30 hover:shadow-md",
        pink: "border-pink-500/30 bg-pink-500/20 text-pink-600 hover:bg-pink-500/30 hover:shadow-md",
      },
      size: {
        default: "px-3 py-1",
        sm: "px-2.5 py-0.5 text-[0.65rem]",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
