import { PostDetail } from "@/components/posts/post-detail"
import { CommentSection } from "@/components/comments/comment-section"

export default function PostDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PostDetail postId={params.id} />
      </div>
    </div>
  )
}
