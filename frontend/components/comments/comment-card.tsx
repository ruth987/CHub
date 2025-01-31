"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Heart, Reply, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CommentForm } from "@/components/comments/comment-form"

interface CommentCardProps {
  comment: {
    id: string
    content: string
    author: {
      name: string
      image?: string
      isAnonymous?: boolean
    }
    createdAt: string
    likes: number
    isLiked?: boolean
    replies?: any[]
  }
  postId: string
  isReply?: boolean
}

export function CommentCard({ comment, postId, isReply = false }: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)

  const handleLike = async () => {
    try {
      // Replace with your API call
      const response = await fetch(`/api/comments/${comment.id}/like`, {
        method: "POST",
      })
      if (!response.ok) throw new Error("Failed to like comment")
      // Handle success (update UI, etc.)
    } catch (error) {
      console.error(error)
      // Handle error
    }
  }

  return (
    <Card className={`bg-gray-800 border-gray-700 ${isReply ? 'ml-8' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-8 h-8">
            {comment.author.isAnonymous ? (
              <AvatarFallback className="bg-yellow-500/10 text-yellow-500">AN</AvatarFallback>
            ) : (
              <>
                <AvatarImage src={comment.author.image} />
                <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
              </>
            )}
          </Avatar>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {comment.author.isAnonymous ? "Anonymous" : comment.author.name}
                </p>
                <p className="text-xs text-gray-400">{comment.createdAt}</p>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    Report Comment
                  </DropdownMenuItem>
                  {/* Add more menu items as needed */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="mt-2 text-gray-300">{comment.content}</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-2 pb-4">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleLike}
            className="text-gray-400 hover:text-white"
          >
            <Heart 
              className={`w-4 h-4 mr-1 ${comment.isLiked ? 'fill-yellow-500 text-yellow-500' : ''}`} 
            />
            {comment.likes}
          </Button>

          {!isReply && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="text-gray-400 hover:text-white"
            >
              <Reply className="w-4 h-4 mr-1" />
              Reply
            </Button>
          )}

          {comment.replies && comment.replies.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-400 hover:text-white"
            >
              {showReplies ? 'Hide' : 'Show'} Replies ({comment.replies.length})
            </Button>
          )}
        </div>
      </CardFooter>

      {isReplying && (
        <div className="px-4 pb-4">
          <CommentForm 
            postId={postId} 
            parentId={comment.id}
            onSuccess={() => setIsReplying(false)}
          />
        </div>
      )}

      {showReplies && comment.replies && (
        <div className="px-4 pb-4 space-y-4">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply.id}
              comment={reply}
              postId={postId}
              isReply={true}
            />
          ))}
        </div>
      )}
    </Card>
  )
}