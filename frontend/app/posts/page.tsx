import { PostFeed } from "@/components/posts/post-feed"
import { CreatePostButton } from "@/components/posts/create-post-button"

export default function PostsPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-white">Community Posts</h1>
          <CreatePostButton />
        </div>
        <PostFeed />
      </div>
    </div>
  )
}