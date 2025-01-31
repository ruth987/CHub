"use client"

import { useState } from "react"
import { CommentList } from "@/components/comments/comment-list"
import { CommentForm } from "@/components/comments/comment-form"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"

interface CommentSectionProps {
  postId: string
}

export function CommentSection({ postId }: CommentSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Comments</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white"
        >
          {isExpanded ? (
            <ArrowUp className="w-4 h-4 mr-2" />
          ) : (
            <ArrowDown className="w-4 h-4 mr-2" />
          )}
          {isExpanded ? "Hide Comments" : "Show Comments"}
        </Button>
      </div>

      {isExpanded && (
        <>
          <CommentForm postId={postId} />
          <CommentList postId={postId} />
        </>
      )}
    </div>
  )
}