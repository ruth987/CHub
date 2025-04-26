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
import { Checkbox } from "@/components/ui/checkbox"
import { useCreatePost } from "@/hooks/posts"

// Update schema to match your API types
const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  image_url: z.string().optional(), // Changed from imageUrl to match API
  link_url: z.string().url().optional().or(z.literal("")), // Changed from linkUrl to match API
  is_anonymous: z.boolean().default(false), // Changed from isAnonymous to match API
  tags: z.string().optional(), // Changed to string for comma-separated input
})

interface CreatePostFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function CreatePostForm({ onSuccess, onCancel }: CreatePostFormProps) {
  const createPost = useCreatePost()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      image_url: "",
      link_url: "",
      is_anonymous: false,
      tags: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Transform the form data to match the API expectations
      const postData = {
        ...values,
        // Convert comma-separated string to array and trim whitespace
        tags: values.tags ? values.tags.split(',').map(tag => tag.trim()) : [],
        // Only include optional fields if they have values
        image_url: values.image_url || undefined,
        link_url: values.link_url || undefined,
      }

      await createPost.mutateAsync(postData)
      form.reset()
      onSuccess?.()
    } catch (error) {
      console.error(error)
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
                  disabled={createPost.isPending}
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
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Image URL (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Tags (comma-separated)</FormLabel>
              <FormControl>
                <Input
                  placeholder="faith, prayer, bible..."
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Bible Plan Link (optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://..."
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white"
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_anonymous"
          render={({ field }) => (
            <FormItem className="flex items-center space-x-2">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="border-gray-600 data-[state=checked]:bg-yellow-500"
                  disabled={createPost.isPending}
                />
              </FormControl>
              <FormLabel className="text-white text-sm font-normal">
                Post anonymously
              </FormLabel>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            className="border-gray-600 text-gray-500"
            disabled={createPost.isPending}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
            disabled={createPost.isPending}
          >
            {createPost.isPending ? (
              <>
            
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}