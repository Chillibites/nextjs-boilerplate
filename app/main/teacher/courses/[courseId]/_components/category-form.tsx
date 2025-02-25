"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Combobox } from "@/components/ui/combobox"
interface CategoryFormProps {
  initialData: {
    categoryId: string | null;
  };
  courseId: string;
  options: {
    label: string;
    value: string;
  }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1, {
    message: "Category is required",
  }),
})

export const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  // refresh the page when the course is updated
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || ""
    },
  })


  const { isSubmitting, isValid } = form.formState;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  const selectedOption = options.find((option) => option.value === initialData.categoryId);

  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl">Course category</h1>
          <span className="text-sm">
          </span>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-x-2" onClick={toggleEdit}>
            {isEditing ? (
                    <>Cancel</>
            ) : (
                <>
                    <Pencil className="h-4 w-4" />
                    Edit category
                </>
            )}
        </Button>
      </div>
      {!isEditing && (
        <p className={cn(
          "mt-2 text-sm md:text-base",
          !initialData.categoryId && "text-slate-500 italic"
        )}>
            {selectedOption?.label || "No category selected"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Combobox
                                    {...field}
                                    options={options}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-x-2">
                    <Button type="submit" disabled={!isValid || isSubmitting}>
                        Save
                    </Button>
                </div>
            </form>
        </Form>
      )}
    </div>
  )
}