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
import { useCreateComment } from "@/hooks/comments"

const formSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty"),
})

interface CommentFormProps {
  postId: number
  parentId?: number
  onSuccess?: () => void
}

export function CommentForm({ postId, parentId, onSuccess }: CommentFormProps) {
  const { mutate: createComment, isPending } = useCreateComment()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    createComment({
      content: values.content,
      postId,
      parentId
    }, {
      onSuccess: () => {
        form.reset()
        onSuccess?.()
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea 
                  placeholder="Share your thoughts..." 
                  {...field}
                  className="bg-gray-700 border-gray-700 text-white min-h-[100px]"
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button 
            type="submit" 
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
            disabled={isPending}
          >
            {isPending ? "Posting..." : "Post Comment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}