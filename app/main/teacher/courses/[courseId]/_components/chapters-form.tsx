"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Loader2, PlusCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { ChaptersList } from "./chapters-list"
import { Chapter } from "@prisma/client"

interface ChaptersFormProps {
  initialData: {
    title: string | null;
    chapters: { id: string }[];
  };
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Chapter title is required"),
})

export const ChaptersForm = ({ initialData, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  const toggleCreate = () => {
    setIsCreating((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData.title || "",
    },
  })

  const { isSubmitting, isValid } = form.formState

  // When the creation form is shown, shift focus to the chapter title field.
  useEffect(() => {
    if (isCreating) {
      // Instead of using a ref, we target the element by its unique id.
      const inputElement = document.getElementById("chapter-title")
      inputElement?.focus()
    }
  }, [isCreating])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success("Chapter created")
      toggleCreate()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true)
      await axios.put(`/api/courses/${courseId}/chapters/reorder`, {
        list: updateData,
      })
      toast.success("Chapters reordered")
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/main/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 border border-border bg-card rounded-md p-6 shadow-sm">
      {isUpdating && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between border-b border-border pb-2 mb-4">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl font-semibold text-card-foreground">Course Chapters</h1>
          <span className="text-sm text-muted-foreground">
            Manage and arrange your course chapters
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-x-2 hover:bg-muted/20 transition-colors"
          onClick={toggleCreate}
          aria-label={isCreating ? "Cancel adding chapter" : "Add new chapter"}
        >
          {isCreating ? (
            "Cancel"
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
                      id="chapter-title"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      className="border border-input rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                      aria-label="Chapter title"
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
              className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label="Create chapter"
            >
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div className={cn(
          !initialData.chapters.length && "text-slate-500 italic"
        )}>
          {!initialData.chapters.length && "No chapters yet"}
          <ChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.chapters as Chapter[]}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-gray-400 text-sm mt-2" aria-live="polite">
          Drag and drop to reorder chapters
        </p>
      )}
    </div>
  )
}