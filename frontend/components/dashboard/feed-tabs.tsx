import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/posts/post-card"
import { CreatePostButton } from "@/components/posts/create-post-button"

interface Post {
  id: string
  title: string
  content: string
  author: {
    name: string
    image: string
  }
  createdAt: string
  tags: string[]
  likes: number
  comments: number
}

interface FeedTabsProps {
  posts: Post[]
}

export function FeedTabs({ posts }: FeedTabsProps) {
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
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </TabsContent>
      
      <TabsContent value="my-posts">
        <p className="text-gray-400">Your posts will appear here</p>
      </TabsContent>
      
      <TabsContent value="saved">
        <p className="text-gray-400">Your saved posts will appear here</p>
      </TabsContent>
    </Tabs>
  )
}