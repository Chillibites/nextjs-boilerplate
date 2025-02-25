"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";


const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required",
  }),
});

export default function CreateCoursePage() {
  
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values, {
        withCredentials: true,
      });
      router.push(`/main/teacher/courses/${response.data.id}`);
      toast.success("Course created successfully");
    } catch {
      toast.error("Something went wrong");
    }
  };

  return <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
    <div className="space-y-4 w-full">
      <div>
        <h1 className="text-2xl">
          Name your course
        </h1>
        <p className="text-sm text-muted-foreground">
          What would you like to name your course? Don&apos;t worry, you can change
          it later.
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course Title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="e.g. 'Advanced Web Development'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What will you teach in this course?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            <Link href="/main/teacher/courses">
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={!isValid || isSubmitting}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  </div>;
}
