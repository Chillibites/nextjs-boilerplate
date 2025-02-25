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
import { Pencil, PlusCircle, ImageIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface ImageFormProps {
  initialData: {
    imageUrl: string | null;
  };
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is required",
  }),
})

// Cast Next.js Image to a React.FC so that TypeScript recognizes its props.
const NextImage = Image as unknown as React.FC<React.ComponentProps<typeof Image>>;

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [uploading, setUploading] = useState(false)
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((current) => !current)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData.imageUrl || ""
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
    <div className="mt-6 border rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-2xl">Course Image</h1>
          <span className="text-sm">
          </span>
        </div>
        <Button variant="ghost" size="sm" className="flex items-center gap-x-2" onClick={toggleEdit}>
            {isEditing && (
                    <>Cancel</>
            )}
            {!isEditing && !initialData.imageUrl && (
                    <>
                    <PlusCircle className="h-4 w-4" />
                    Upload image
                    </>
            )}
            {!isEditing && initialData.imageUrl && (
                <>
                    <Pencil className="h-4 w-4" />
                    Edit image
                </>
            )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.imageUrl ? (
            <div className="flex items-center justify-center h-96 bg-slate-200">
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          ) : (
            <div className="relative aspect-video mt-2">
                <NextImage 
                src={initialData.imageUrl} 
                alt="Course image" 
                fill
                className="object-cover" />
            </div>
        )
      )}

      {isEditing && (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            try {
                                                setUploading(true);
                                                const res = await fetch(
                                                    `/api/courses/upload-image?filename=${encodeURIComponent(
                                                        file.name
                                                    )}`,
                                                    {
                                                        method: "POST",
                                                        body: file,
                                                    }
                                                );
                                                if (!res.ok) {
                                                    throw new Error("Upload failed");
                                                }
                                                const blob = await res.json();
                                                toast.success("Image uploaded!");
                                                field.onChange(blob.url);
                                            } catch (error) {
                                                console.error(error);
                                                toast.error("Failed to upload image");
                                            } finally {
                                                setUploading(false);
                                            }
                                        }
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {uploading && (
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                )}
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
