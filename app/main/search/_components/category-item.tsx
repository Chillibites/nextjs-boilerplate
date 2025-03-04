"use client"

import { cn } from "@/lib/utils"
import { IconType } from "react-icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import qs from "query-string"
interface CategoryItemProps {
  label: string
  value?: string
  icon?: IconType
}

export const CategoryItem = ({ label, value, icon: Icon }: CategoryItemProps) => {
    const pathname = usePathname()
    const router = useRouter()
    const searchParams = useSearchParams()

    const categoryId = searchParams.get("categoryId")
    const currentTitle = searchParams.get("title")

    const isSelected = categoryId === value

    const onClick = () => {
        const url = qs.stringifyUrl({
            url: pathname,
            query: {
                title: currentTitle,
                categoryId: isSelected ? undefined : value,
            },
        }, { skipNull: true, skipEmptyString: true })

        router.push(url)
    }

  return (
    <button
      onClick={onClick}
      type="button"
      aria-label={`Select category ${label}`}
      className={cn(
        "flex items-center gap-2 py-2 px-4 text-sm font-medium border rounded-md transition-colors duration-200",
        "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] border-[hsl(var(--border))]",
        "hover:bg-[hsl(var(--secondary))] hover:text-[hsl(var(--secondary-foreground))]",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[hsl(var(--ring))]",
        "active:scale-95",
        isSelected && "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] border-[hsl(var(--primary))] shadow-md"
      )}
    >
      {Icon && <Icon size={20} aria-hidden="true" />}
      <span className="truncate">{label}</span>
    </button>
  )
}