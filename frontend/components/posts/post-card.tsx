import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageCircle, Heart, Share, BookmarkPlus } from "lucide-react"
import { Post } from "@/types/posts"
import { formatDistanceToNow } from "date-fns"
import { usePostInteractions } from "@/hooks/post-interactions"
import { useSavedPosts } from "@/hooks/saved-posts"
import { useState } from "react"
import Image from "next/image"

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const { likePost, unlikePost } = usePostInteractions()
  const { savePost, unsavePost } = useSavedPosts()
  const [isLiked, setIsLiked] = useState(post.is_liked)
  const [isSaved, setIsSaved] = useState(post.is_saved)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      // Optimistically update UI
      if (isLiked) {
        setIsLiked(false)
        setLikeCount(prev => prev - 1)
        await unlikePost(post.id)
      } else {
        setIsLiked(true)
        setLikeCount(prev => prev + 1)
        await likePost(post.id)
      }
    } catch (error) {
      // Revert on error
      setIsLiked(post.is_liked)
      setLikeCount(post.likes)
      console.error('Like action failed:', error)
    }
  }

  const handleSaveClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    console.log("save clicked", isSaved)
    if (isSaved) {
      setIsSaved(false)
      await unsavePost(post.id)
    } else {
      setIsSaved(true)
      await savePost(post.id)
    }
  }

  return (
    <Card className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-8 w-8">
          {/* check if user is anonymous */}
          {false  ? (
            <AvatarFallback className="bg-yellow-500/10 text-yellow-500">AN</AvatarFallback>
          ) : (
            <>
              <AvatarImage src={post.user.avatarUrl || ''} />
              <AvatarFallback>{post.user.username[0].toUpperCase()}</AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-sm font-medium text-white">
            {post.user.username.charAt(0).toUpperCase() + post.user.username.slice(1)}
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}

          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Link href={`/posts/${post.id}`}>
          <h3 className="text-xl font-semibold text-white hover:text-yellow-400">
            {post.title}
          </h3>
        </Link>
        
        <div className="mt-2">
        <p className="text-gray-300 whitespace-pre-wrap">
          {post.content}
        </p>
        </div>
        
        {post.image_url && (
          <div className="mt-4">
            <Image
              src={post.image_url}
              alt={post.title}
              width={800}
              height={600}
              className="rounded-lg w-full"
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
          {post?.tags?.map((tag) => (
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
          <Button variant="ghost" size="sm" 
          onClick={handleLikeClick} 
          className="text-gray-400 hover:text-gray-800 ">
            <Heart
              className={`w-4 h-4 mr-1 ${isLiked ? 'fill-yellow-500 text-yellow-500' : ''}`} />
            {likeCount}
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-800">
            <MessageCircle className="w-4 h-4 mr-1" />
            {post.comment_count}
          </Button>
          <div className="ml-auto flex gap-2">
            <Button variant="ghost" size="sm" 
            onClick={handleSaveClick}
            className={`text-gray-400 hover:text-gray-800 ${isSaved ? 'text-yellow-500' : ''}`}>
              <BookmarkPlus className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-800">
              <Share className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}