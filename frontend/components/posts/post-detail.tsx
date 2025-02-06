"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Heart, Share, BookmarkPlus } from "lucide-react"
import Image from "next/image"
import { formatDistanceToNow } from 'date-fns'
import { useUser } from "@/hooks/auth"
import api from "@/lib/axios"

interface PostDetailProps {
  postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
  const { user } = useUser()

  const { data: post, isLoading, error } = useQuery({
    queryKey: ['posts', postId],
    queryFn: async () => {
      const response = await api.get(`/posts/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return response.data
    }
  })

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
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar>
          {post.is_anonymous ? (
            <AvatarFallback className="bg-yellow-500/10 text-yellow-500">
              AN
            </AvatarFallback>
          ) : (
            <>
              <AvatarImage src={post.user.avatarUrl || ''} />
              <AvatarFallback>
                {post.user.username[0].toUpperCase()}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-white">
            {post.is_anonymous 
              ? 'Anonymous' 
              : post.user.username.charAt(0).toUpperCase() + post.user.username.slice(1)
            }
          </p>
          <p className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </p>
        </div>
        {user?.id === post.user.id && (
          <div className="ml-auto">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-600 hover:text-white">
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-red-200/25 hover:text-white">
              Delete
            </Button>
          </div>
        )}
      </CardHeader>
      
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
      </CardContent>
      
      <CardFooter className="border-t border-gray-700 pt-4">
        <div className="flex items-center gap-4 w-full">
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <Heart className={`w-4 h-4 mr-1 ${post.likes > 0 ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
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
  )
}