"use client"

import { useState } from "react"
import { CommentForm } from "@/components/comments/comment-form"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Comment } from "@/types/comment"

interface CommentSectionProps {
  postId: string
  onNewComment: (comment: Comment) => void
}

export function CommentSection({ postId, onNewComment }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Comments</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white hover:bg-gray-700"
        >
          {isExpanded ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          {isExpanded ? "Hide" : "Show"}
        </Button>
      </div>

      {isExpanded && (
        <>
          <CommentForm postId={parseInt(postId)} onNewComment={onNewComment} />
        </>
      )}
    </div>
  )
}