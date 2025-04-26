import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/posts/post-card"
import { CreatePostButton } from "@/components/posts/create-post-button"
import { Post, SavedPost } from "@/types/posts"
import { Loader2 } from "lucide-react"

interface FeedTabsProps {
  allPosts: Post[] | undefined
  userPosts: Post[] | undefined
  savedPosts: SavedPost[] | undefined
  isLoading: boolean
}

export function FeedTabs({ allPosts, userPosts, savedPosts, isLoading }: FeedTabsProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <Tabs defaultValue="feed" className="w-full">
      <TabsList className="bg-gray-800">
        <TabsTrigger value="feed">Feed</TabsTrigger>
        <TabsTrigger value="my-posts">My Posts</TabsTrigger>
        <TabsTrigger value="saved">Saved</TabsTrigger>
      </TabsList>
      
      <div className="mb-4 mt-6">
        <CreatePostButton />
      </div>

      <TabsContent value="feed" className="space-y-4">
        {allPosts?.length === 0 ? (
          <p className="text-center text-gray-400">No posts yet</p>
        ) : (
          allPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </TabsContent>
      
      <TabsContent value="my-posts" className="space-y-4">
        {userPosts?.length === 0 ? (
          <p className="text-center text-gray-400">You haven&apos;t created any posts yet</p>
        ) : (
          userPosts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </TabsContent>
      
      <TabsContent value="saved" className="space-y-4">
        {savedPosts?.length === 0 ? (
          <p className="text-center text-gray-400">No saved posts yet</p>
        ) : (
          savedPosts?.map((savedPost) => (
            <PostCard key={savedPost.post_id} post={savedPost.post} />
          ))
        )}
      </TabsContent>
    </Tabs>
  )
}