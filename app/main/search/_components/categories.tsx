"use client"

import { Category } from "@prisma/client";
import { FcEngineering, FcMusic, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";


interface CategoriesProps {
  items: {
    Category: {
      id: string;
      name: string;
    }
  }[];
}

const iconMap: Record<Category["name"], IconType> = {
  "Computer Science": FcEngineering,
  "Math": FcSalesPerformance,
  "Physics": FcOldTimeCamera,
  "Chemistry": FcMusic,
  "Biology": FcSportsMode,
  "History": FcOldTimeCamera,
  "English": FcMusic,
  "Spanish": FcSalesPerformance,
}

export const Categories = ({ items }: CategoriesProps) => {
  return (
  <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
    {items.map((item) => (
      <CategoryItem
        key={item.Category.id}
        label={item.Category.name}
        icon={iconMap[item.Category.name]}
        value={item.Category.id}
      />

    ))}
  </div>
)
}

