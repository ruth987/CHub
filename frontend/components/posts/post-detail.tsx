"use client"

import { useState, useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, Share, BookmarkPlus, MoreVertical } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { formatDistanceToNow } from 'date-fns'
import { useUser } from "@/hooks/auth"
import { CommentCard } from "@/components/comments/comment-card"
import api from "@/lib/axios"
import { CommentSection } from "../comments/comment-section"
import { Comment } from "@/types/comment"

interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  link_url?: string
  created_at: string
  likes: number
  comment_count: number
  tags?: string[]
  comments?: Comment[]
  user: {
    id: number
    username: string
    avatarUrl?: string
  }
}

interface PostDetailProps {
  postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
  const { user } = useUser()
  const [showComments, setShowComments] = useState(true)
  const [token, setToken] = useState<string | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const response = await api.get(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    },
    enabled: !!token
  })

  const handleNewComment = (newComment: Comment) => {
    queryClient.setQueryData<Post>(['posts', postId], (oldData) => {
      if (!oldData) return oldData
      return {
        ...oldData,
        comments: [...(oldData.comments || []), newComment],
        comment_count: (oldData.comment_count || 0) + 1
      }
    })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        Loading...
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="text-center py-8 text-gray-400">
        Failed to load post. Please try again later.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gray-800 border-gray-700">
        {/* Post Header */}
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={post.user.avatarUrl || ''} />
            <AvatarFallback>
              {post.user.username.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-white">
              {post.user.username.charAt(0).toUpperCase() + post.user.username.slice(1)}
            </p>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </div>
          {user?.id === post.user.id && (
            <div className="ml-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="text-white hover:bg-gray-700">
                    Edit Post
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500 hover:bg-red-500/10">
                    Delete Post
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </CardHeader>
        
        {/* Post Content */}
        <CardContent className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <p className="text-gray-300 whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
          
          {post.image_url && (
            <div className="relative h-[400px] w-full rounded-lg overflow-hidden">
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          
          {post.link_url && (
            <a
              href={post.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
            >
              <div className="text-sm text-yellow-400">View Bible Plan →</div>
            </a>
          )}
          
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
        
        {/* Post Footer */}
        <CardFooter className="border-t border-gray-700 pt-4">
          <div className="flex items-center gap-4 w-full">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
            >
              <Heart 
                className={`w-4 h-4 mr-1 ${
                  post.likes > 0 ? 'fill-yellow-500 text-yellow-500' : ''
                }`} 
              />
              {post.likes}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-400 hover:text-white"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comment_count || 0}
            </Button>
            <div className="ml-auto flex gap-2">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <BookmarkPlus className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Share className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>

      Comments Section
      <CommentSection postId={postId} onNewComment={handleNewComment} />
      {showComments && post.comments && post.comments.length > 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-6">
            Comments ({post.comments.length})
          </h2>
          {post.comments.map((comment: Comment) => (
            <CommentCard key={comment.id} comment={comment} postId={post.id} />
          ))}
        </div>
      )}
    </div>
  )
}