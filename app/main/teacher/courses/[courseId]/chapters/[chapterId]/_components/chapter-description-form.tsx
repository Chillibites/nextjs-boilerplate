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
import { Editor } from "@/components/editor"
import { Preview } from "@/components/preview"
interface ChapterDescriptionFormProps {
  initialData: {
    description: string | null;
  };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  description: z.string().min(1)
})

export const ChapterDescriptionForm = ({ initialData, courseId, chapterId }: ChapterDescriptionFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  // refresh the page when the course is updated
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData.description || ""
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
          <h1 className="text-2xl">Chapter description</h1>
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
        <div className={cn(
          "mt-2 text-sm md:text-base",
          !initialData.description && "text-slate-500 italic"
        )}>
            <Preview value={initialData.description || ""} />
        </div>
      )}
      {isEditing && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Editor
                                    value={field.value}
                                    onChange={field.onChange}
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