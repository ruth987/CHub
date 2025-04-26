import { use } from "react"
import { PostDetail } from "@/components/posts/post-detail"

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostDetail postId={id} />
      </div>
    </div>
  )
}
