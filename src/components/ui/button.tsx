import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-coral)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Square corners by design system v5 default
        default:
          "bg-[var(--color-ink)] text-[var(--color-paper)] hover:bg-[var(--color-ink-soft)]",
        coral:
          "bg-[var(--color-coral)] text-[var(--color-paper)] hover:bg-[var(--color-coral-deep)]",
        outline:
          "border border-[var(--color-ink)] bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-cream-deep)]",
        ghost:
          "bg-transparent text-[var(--color-ink)] hover:bg-[var(--color-cream-deep)]",
        link:
          "bg-transparent text-[var(--color-coral-deep)] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
