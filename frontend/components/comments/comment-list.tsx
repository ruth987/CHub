"use client"

import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { CommentCard } from "@/components/comments/comment-card"
import { Button } from "@/components/ui/button"

interface CommentListProps {
  postId: string
}

export function CommentList({ postId }: CommentListProps) {
  const { data, isLoading, hasNextPage, fetchNextPage } = useInfiniteScroll({
    queryKey: ['comments', postId],
    queryFn: async ({ pageParam = 1 }) => {
      // Replace with your API call
      const response = await fetch(
        `/api/posts/${postId}/comments?page=${pageParam}&limit=10`
      )
      return response.json()
    },
    getNextPageParam: (lastPage, pages) => {
      return lastPage.hasMore ? pages.length + 1 : undefined
    },
  })

  return (
    <div className="space-y-4">
      {data?.pages.map((page, i) => (
        <div key={i} className="space-y-4">
          {page.comments.map((comment: any) => (
            <CommentCard 
              key={comment.id} 
              comment={comment}
              postId={postId}
            />
          ))}
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            className="text-yellow-400 border-yellow-400/20 hover:bg-yellow-400/10"
          >
            Load More Comments
          </Button>
        </div>
      )}

      {!isLoading && data?.pages[0]?.comments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  )
}