import { AlertTriangle, CheckCircle } from "lucide-react"
import {cva, type VariantProps} from "class-variance-authority"
import { cn } from "@/lib/utils"

const bannerVariants = cva("border text-center p-4 text-sm flex items-center justify-center gap-2 rounded-md md:text-base", {
    variants: {
        variant: {
            warning: "bg-yellow-200/80 text-yellow-800 border-yellow-300 dark:bg-yellow-900/50 dark:text-yellow-200 dark:border-yellow-800",
            success: "bg-green-200/80 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-200 dark:border-green-800",
        },
    },
    defaultVariants: {
        variant: "warning",
    },
})

interface BannerProps extends VariantProps<typeof bannerVariants> {
    label: string;
}

const iconMap = {
    warning: AlertTriangle,
    success: CheckCircle,
}

export default function Banner({ label, variant }: BannerProps) {
  const Icon = iconMap[variant || "warning"];
  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="h-5 w-5 flex-shrink-0" />
      <span>{label}</span>
    </div>
  );
}