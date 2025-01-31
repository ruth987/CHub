"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/posts/image-upload"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().optional(),
  linkUrl: z.string().url().optional(),
  isAnonymous: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
})

export function CreatePostForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      isAnonymous: false,
      tags: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Replace with your API call
      const response = await fetch("/api/posts", {
        method: "POST",
        body: JSON.stringify(values),
      })
      
      if (!response.ok) throw new Error("Failed to create post")
      
      // Handle success (close dialog, show toast, etc.)
    } catch (error) {
      console.error(error)
      // Handle error (show toast, etc.)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Title</FormLabel>
              <FormControl>
                <Input 
                  placeholder="What's on your mind?" 
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts..." 
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Image (optional)</FormLabel>
              <FormControl>
                <ImageUpload 
                  value={field.value || ""} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="linkUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Bible Plan Link (optional)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="https://..." 
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isAnonymous"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-gray-600 data-[state=checked]:bg-yellow-500"
                />
              </FormControl>
              <FormLabel className="text-white text-sm font-normal">
                Post anonymously
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" className="border-gray-600 text-white">
            Cancel
          </Button>
          <Button type="submit" className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
            Create Post
          </Button>
        </div>
      </form>
    </Form>
  )
}