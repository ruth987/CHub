"use client"

import { useQuery } from "@tanstack/react-query"
import { CommentCard } from "@/components/comments/comment-card"
import { CommentForm } from "@/components/comments/comment-form"
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { Comment } from "@/types/comment"

interface CommentListProps {
  postId: number
}

export function CommentList({ postId }: CommentListProps) {
  const {
    data: comments,
    isLoading,
  } = useQuery({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await api.get(`/posts/${postId}/comments`)
      return response.data.comments as Comment[]
    },
  })

  return (
    <div className="space-y-6">
      <CommentForm postId={postId} />

      <div className="space-y-4">
        {comments?.map((comment) => (
          <CommentCard 
            key={comment.id} 
            comment={comment}
            postId={postId}
          />
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      )}

      {!isLoading && !comments?.length && (
        <div className="text-center py-8">
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}