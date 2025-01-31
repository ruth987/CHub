"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Share, BookmarkPlus, MoreVertical } from "lucide-react"
import Image from "next/image"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface PostDetailProps {
  postId: string
}

export function PostDetail({ postId }: PostDetailProps) {
  // Replace with your data fetching logic
  const post = {
    id: postId,
    title: "Example Post",
    content: "Post content...",
    author: {
      name: "John Doe",
      image: "/avatars/john.jpg",
      isAnonymous: false,
    },
    createdAt: "2024-01-01",
    imageUrl: "/images/post1.jpg",
    linkUrl: "https://example.com",
    tags: ["Prayer", "Faith"],
    likes: 42,
    comments: 12,
    isLiked: false,
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar>
            {post.author.isAnonymous ? (
              <AvatarFallback className="bg-yellow-500/10 text-yellow-500">AN</AvatarFallback>
            ) : (
              <>
                <AvatarImage src={post.author.image} />
                <AvatarFallback>{post.author.name[0]}</AvatarFallback>
              </>
            )}
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-white">
              {post.author.isAnonymous ? "Anonymous" : post.author.name}
            </p>
            <p className="text-xs text-gray-400">{post.createdAt}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-gray-800 border-gray-700">
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              Report Post
            </DropdownMenuItem>
            <DropdownMenuItem className="text-white hover:bg-gray-700">
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="space-y-4">
        <h1 className="text-2xl font-bold text-white">{post.title}</h1>
        <p className="text-gray-300 whitespace-pre-wrap">{post.content}</p>

        {post.imageUrl && (
          <div className="relative h-96 w-full rounded-lg overflow-hidden">
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {post.linkUrl && (
          <a
            href={post.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
          >
            <div className="text-sm text-yellow-400">View Bible Plan →</div>
          </a>
        )}

        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
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
            <Heart className={`w-4 h-4 mr-1 ${post.isLiked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
            <MessageCircle className="w-4 h-4 mr-1" />
            {post.comments}
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