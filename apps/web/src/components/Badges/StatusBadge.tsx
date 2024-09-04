import type { FC } from "react";
import { cva } from "class-variance-authority";
import type { VariantProps } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

import { Badge } from "./Badge";
import type { BadgeProps } from "./Badge";

const statusBadgeVariants = cva(
  `
    rounded-lg
    font-medium
    text-xs
    px-[6px]
    py-[3px]
    bg-opacity-10
    dark:bg-opacity-10

    border
    border-opacity-30
    dark:border-opacity-30
  `,
  {
    variants: {
      variant: {
        green: `
          bg-green-600 
          text-green-600 
          border-green-600 
  
          dark:bg-green-500 
          dark:text-green-500 
          dark:border-green-500 
          `,
        gray: `
          bg-contentTertiary-light
          text-warmGray-500
          border-contentTertiary-light
          
          dark:bg-contentTertiary-dark
          dark:text-contentTertiary-dark
          dark:border-contentTertiary-dark
          `,
      },
    },
    defaultVariants: {
      variant: "green",
    },
  }
);

type StatusBadgeProps = BadgeProps & VariantProps<typeof statusBadgeVariants>;

export const StatusBadge: FC<StatusBadgeProps> = ({
  className,
  variant,
  ...props
}) => {
  return (
    <Badge
      className={twMerge(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  );
};
