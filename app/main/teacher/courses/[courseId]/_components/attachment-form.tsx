"use client"

import * as z from "zod"
import axios from "axios"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import { useState, useRef } from "react"
import {
  Form,
  FormItem,
} from "@/components/ui/form"

import { Button } from "@/components/ui/button"
import { Pencil, ImageIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"

// Import the upload helper from Vercel Blob.
import { upload } from "@vercel/blob/client"

interface AttachmentFormProps {
  initialData: {
    attachments: { id: string; name: string; url: string }[];
  }
  courseId: string
}

const formSchema = z.object({
  attachments: z.array(
    z.object({
      name: z.string().min(1, { message: "Attachment name is required" }),
      url: z.string().min(1, { message: "Attachment is required" }),
    })
  ),
})

export const AttachmentForm = ({
  initialData,
  courseId,
}: AttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const toggleEdit = () => {
    setIsEditing((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { attachments: initialData.attachments || [] },
  })
  const { control, handleSubmit, register } = form
  const { fields, append, remove } = useFieldArray({
    control,
    name: "attachments",
  })

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      setUploading(true)
      for (const file of Array.from(files)) {
        try {
          const blob = await upload(file.name, file, {
            access: "public",
            handleUploadUrl: "/api/courses/upload-attachments",
          })
          // Append with default name (file name without extension)
          append({
            name: file.name.replace(/\.[^/.]+$/, ""),
            url: blob.url,
          })
          toast.success(`Uploaded ${file.name}`)
        } catch (error) {
          console.error(error)
          toast.error(`Failed to upload ${file.name}`)
        }
      }
      setUploading(false)
      e.target.value = ""
    }
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, {
        attachments: values.attachments,
      })
      toast.success("Course updated")
      toggleEdit()
      router.refresh()
    } catch {
      toast.error("Something went wrong")
    }
  }

  return (
    <div className="mt-6 border rounded-md p-4 bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl font-semibold">
            Course Attachments
          </h1>
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            Manage the attachments for this course
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-x-2"
          onClick={toggleEdit}
          aria-label={
            isEditing ? "Cancel editing attachments" : "Edit attachments"
          }
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <Pencil className="h-4 w-4" />
              Edit Attachments
            </>
          )}
        </Button>
      </div>

      {/* View Mode */}
      {!isEditing &&
        (fields.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center h-64 bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] rounded-md border border-dashed border-[hsl(var(--border))] mt-4"
            role="status"
            aria-live="polite"
          >
            <ImageIcon className="h-12 w-12" aria-hidden="true" />
            <p className="mt-2">No attachments uploaded</p>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 mt-4">
            {fields.map((field) => (
              <li
                key={field.id}
                className="bg-[hsl(var(--card))] shadow rounded-md p-4 flex items-center justify-between text-[hsl(var(--card-foreground))]"
              >
                <div>
                  <p className="text-sm font-bold">
                    {field.name}
                  </p>
                  <a
                    href={field.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm underline text-[hsl(var(--primary))]"
                  >
                    View Attachment
                  </a>
                </div>
                <div>
                  <ImageIcon
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              </li>
            ))}
          </ul>
        ))}

      {/* Edit Mode */}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormItem>
              <label htmlFor="attachment-upload" className="block">
                <div
                  className="border-2 border-dashed border-[hsl(var(--border))] rounded-md p-4 text-center cursor-pointer transition hover:border-[hsl(var(--primary))] focus:border-[hsl(var(--primary))] focus:outline-none"
                  tabIndex={0}
                  role="button"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && fileInputRef.current) {
                      fileInputRef.current.click()
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon
                    className="mx-auto h-8 w-8 text-[hsl(var(--muted-foreground))]"
                    aria-hidden="true"
                  />
                  <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))]">
                    Drag and drop your attachments here or{" "}
                    <span className="underline text-[hsl(var(--primary))]">
                      click to select files
                    </span>
                  </p>
                  <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                    Only .zip files are accepted
                  </p>
                </div>
                <input
                  id="attachment-upload"
                  type="file"
                  multiple
                  accept=".zip,application/zip"
                  onChange={onFileChange}
                  ref={fileInputRef}
                  className="hidden"
                  aria-label="Upload attachments"
                />
              </label>
              {uploading && (
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">
                  Uploading...
                </p>
              )}
            </FormItem>
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-x-4 bg-[hsl(var(--secondary))] p-2 rounded-md shadow-sm"
              >
                <input
                  className="border rounded p-1 flex-1 outline-[hsl(var(--ring))]"
                  {...register(`attachments.${index}.name` as const)}
                  aria-label={`Attachment Name ${index + 1}`}
                />
                <span className="text-sm text-[hsl(var(--muted-foreground))] break-all">
                  {field.url}
                </span>
                <Button
                  variant="destructive"
                  onClick={() => remove(index)}
                  aria-label={`Remove attachment "${field.name}"`}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button type="submit" className="mt-4">
              Save Attachments
            </Button>
          </form>
        </Form>
      )}
    </div>
  )
}
