"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState } from "react"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
interface ChapterAccessFormProps {
  initialData: {
    isFree: boolean;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  isFree: z.boolean().default(false)
})

export const ChapterAccessForm = ({ initialData, courseId, chapterId }: ChapterAccessFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  // refresh the page when the course is updated
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isFree: !!initialData.isFree
    },
  })


  const { isSubmitting, isValid } = form.formState;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success("Chapter updated");
      toggleEdit();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }



  return (
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl">Chapter access </h1>
          <span className="text-sm">
          </span>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-x-2" onClick={toggleEdit}>
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
        <p className={cn(
          "mt-2 text-sm md:text-base",
          !initialData.isFree && "text-slate-500 italic"
        )}>
          {initialData.isFree ? "This chapter is free" 
          : "This chapter is paid"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                    control={form.control}
                    name="isFree"
                    render={({ field }) => (
                       <FormItem className="flex flex-row items-center justify-between gap-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="flex flex-col gap-y-1">
                          <FormDescription>
                            Check this box if you want to make the chapter free for preview.
                          </FormDescription>
                        </div>
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