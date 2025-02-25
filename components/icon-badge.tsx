import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";


const backgroundVariants = cva(
  "rounded-full flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        success: "bg-success/10 text-success",
        warning: "bg-warning/10 text-warning",
        danger: "bg-danger/10 text-danger",
      },
      size: {
        default: "h-10 w-10",
        sm: "h-8 w-8",
        lg: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const iconVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        success: "text-success",
        warning: "text-warning",
        danger: "text-danger",
      },
      size: {
        default: "size-6",
        sm: "size-4",
        lg: "size-8",
      },
      defaultVariants: {
        variant: "default",
        size: "default",
      },
    },
  }
)


type BackgroundVariants = VariantProps<typeof backgroundVariants>
type IconVariants = VariantProps<typeof iconVariants>

interface IconBadgeProps extends BackgroundVariants, IconVariants {
  icon: LucideIcon
}

export const IconBadge = ({
  icon: Icon,
  variant,
  size,
}: IconBadgeProps) => {
  return (
    <div className={cn(backgroundVariants({ variant, size }))}>
      <Icon className={cn(iconVariants({ variant, size }))} />
    </div>
  )
}