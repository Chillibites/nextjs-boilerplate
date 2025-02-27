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
import { PlusCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

interface ChaptersFormProps {
  initialData: {
    title: string | null;
    chapters: { id: string }[];
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1),
})

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false)
  // const [isUpdating, setIsUpdating] = useState(false)
  // refresh the page when the course is updated
  const router = useRouter();
  const toggleCreate = () => {
    setIsCreating((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
    },
  })

  const { isSubmitting, isValid } = form.formState;
  
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values);
      toast.success("Chapter created");
      toggleCreate();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="mt-6 border border-gray-200 bg-white rounded-md p-6 shadow-sm">
      <div className="font-medium flex items-center justify-between border-b pb-2 mb-4">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl font-semibold text-gray-800">Course Chapters</h1>
          <span className="text-sm text-gray-600">
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-x-2 hover:bg-gray-100 transition-colors" 
          onClick={toggleCreate}
        >
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              disabled={!isValid || isSubmitting}
              className="bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          !initialData.chapters.length && "text-slate-500 italic"
        )}
        >
          {!initialData.chapters.length && "No chapters yet"}
          {/* TODO: a list of chapters */}
        </div>
      )}
      {!isCreating && (
        <p className="text-gray-400 text-sm mt-2">
          Drag and drop to reorder chapters
        </p>
      )}
    </div>
  )
}