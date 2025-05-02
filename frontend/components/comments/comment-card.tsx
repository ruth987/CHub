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
import { useDeleteComment, useLikeComment, useUnlikeComment } from "@/hooks/comments"
import { Comment } from "@/types/comment"
import { formatDistanceToNow } from 'date-fns'
import { useUser } from "@/hooks/auth"

interface CommentCardProps {
  comment: Comment
  postId: number
  isReply?: boolean
}

export function CommentCard({ comment, postId, isReply = false }: CommentCardProps) {
  const [isReplying, setIsReplying] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const { mutate: deleteComment } = useDeleteComment()
  const { mutate: likeComment } = useLikeComment()
  const { mutate: unlikeComment } = useUnlikeComment()
  const { user } = useUser()

  const handleLike = () => {
    if (!user) return // Add authentication check
    if (comment.is_liked) {
      unlikeComment(comment.id)
    } else {
      likeComment(comment.id)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(comment.id)
    }
  }

  const formattedDate = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })

  return (
    <Card className={`bg-gray-800 border-gray-700 ${isReply ? 'ml-8' : ''}`}>
      <CardContent className="pt-4">
        <div className="flex items-start gap-4">
          <Avatar className="w-8 h-8">
            <AvatarImage src={comment.user.avatarUrl || ''} alt={comment.user.username} />
            <AvatarFallback className="bg-yellow-500 text-gray-900">
              {comment.user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  {comment.user.username}
                </p>
                <p className="text-xs text-gray-400">{formattedDate}</p>
              </div>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                    {user.id === comment.user_id && (
                      <>
                        <DropdownMenuItem 
                          onClick={() => {/* Add edit handler */}}
                          className="text-white hover:bg-gray-700 cursor-pointer"
                        >
                          Edit Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={handleDelete}
                          className="text-white hover:bg-gray-700 cursor-pointer"
                        >
                          Delete Comment
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                      Report Comment
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
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
              className={`w-4 h-4 mr-1 ${comment.is_liked ? 'fill-yellow-500 text-yellow-500' : ''}`}
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

          {comment.reply_count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-gray-400 hover:text-white"
            >
              {showReplies ? 'Hide' : 'Show'} Replies ({comment.reply_count})
            </Button>
          )}
        </div>
      </CardFooter>

      {isReplying && (
        <div className="px-4 pb-4">
          <CommentForm
            postId={postId}
            parentId={comment.id}
            onNewComment={() => setIsReplying(false)}
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