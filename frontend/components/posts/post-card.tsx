import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { MessageCircle, Heart, Share, BookmarkPlus } from "lucide-react"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    author: {
      name: string
      image?: string
      isAnonymous?: boolean
    }
    createdAt: string
    imageUrl?: string
    linkUrl?: string
    tags: string[]
    likes: number
    comments: number
    isLiked?: boolean
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="flex flex-row items-center gap-4">
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
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold text-white hover:text-yellow-400">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-300">{post.content}</p>
        
        {post.imageUrl && (
          <div className="relative h-80 w-full rounded-lg overflow-hidden">
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