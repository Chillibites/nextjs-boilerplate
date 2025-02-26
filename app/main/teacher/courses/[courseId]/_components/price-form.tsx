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
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/format"

interface PriceFormProps {
  initialData: {
    price: number | null;
  };
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
})

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  // refresh the page when the course is updated
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData.price || 0
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



  return (
    <div className="mt-6 border rounded-md p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="font-medium flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl font-bold text-gray-800">Course price</h1>
          <span className="text-sm text-gray-500">
            Set the right price for your course content
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-x-2 hover:bg-gray-100 transition" 
          onClick={toggleEdit}
        >
            {isEditing ? (
                    <>Cancel</>
            ) : (
                <>
                    <Pencil className="h-4 w-4" />
                    Edit
                </>
            )}
        </Button>
      </div>
      {!isEditing && (
        <div className="mt-4">
          <p className={cn(
            "text-lg md:text-xl font-semibold text-gray-900",
            !initialData.price && "text-slate-500 italic"
          )}>
              {formatPrice(initialData.price || 0)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {initialData.price ? "Price includes all taxes and fees" : "Set a price for your course"}
          </p>
        </div>
      )}
      {isEditing && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500">$</span>
                                    </div>
                                    <Input
                                        type="number"
                                        disabled={isSubmitting}
                                        placeholder="Set the price for your course"
                                        className="pl-7 focus:ring-2 focus:ring-blue-500"
                                        {...field}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center gap-x-2 pt-2">
                    <Button 
                        type="submit" 
                        disabled={!isValid || isSubmitting}
                        className="bg-blue-600 hover:bg-blue-700 transition"
                    >
                        {isSubmitting ? "Saving..." : "Save"}
                    </Button>
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={toggleEdit}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
      )}
    </div>
  )
}