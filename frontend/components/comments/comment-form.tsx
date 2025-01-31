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
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

const formSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
  isAnonymous: z.boolean().default(false),
})

interface CommentFormProps {
  postId: string
  parentId?: string
  onSuccess?: () => void
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
      isAnonymous: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Replace with your API call
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify(values),
      })
      
      if (!response.ok) throw new Error("Failed to post comment")
      
      form.reset()
      // Handle success (show toast, update comments list, etc.)
    } catch (error) {
      console.error(error)
      // Handle error
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mb-6">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts..." 
                  {...field}
                  className="bg-gray-700 border-gray-600 text-white min-h-[100px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-between">
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
                <label className="text-sm text-white">
                  Post anonymously
                </label>
              </FormItem>
            )}
          />

          <Button type="submit" className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
            Post Comment
          </Button>
        </div>
      </form>
    </Form>
  )
}