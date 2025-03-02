"use client"

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";
import NDotsLoader from "../../loader/n-dots";

const buttonVariants = cva(styles.baseClass, {
  variants: {
    variant: {
      destructive: styles.destructive,
      outline: styles.outline,
      secondary: styles.secondary,
      ghost: styles.ghost,
      link: styles.link,
      primary: styles.primary,
      noStyle: "",
    },
    size: {
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-10 rounded-md px-8",
      icon: "h-9 w-9",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "lg",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const StyledButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={
          variant !== "noStyle"
            ? cn(
                buttonVariants({ variant, size, className }),
                loading ? styles.blur : "",
              )
            : className
        }
        ref={ref}
        {...props}
      >
        {loading ? (
          <NDotsLoader numOfDots={5} dotClass={styles.loadingDots} />
        ) : (
          children
        )}
      </Comp>
    );
  },
);
StyledButton.displayName = "Button";

export { buttonVariants };
export default StyledButton;
