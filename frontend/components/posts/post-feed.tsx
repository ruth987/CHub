"use client"

import { useState } from "react"
import { PostCard } from "./post-card"
import { Button } from "@/components/ui/button"
import { CreatePostDialog } from "@/components/posts/create-post-dialog"
import { usePosts } from "@/hooks/posts"
import { useUser } from "@/hooks/auth"
import { Post } from "@/types/posts"

export function PostFeed() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false)
  const { user } = useUser()
  
  const { data: posts = [], isLoading } = usePosts()

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        Loading...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Create Post Button */}
      {user && (
        <div className="flex justify-end mb-6">
          <Button
            onClick={() => setIsCreatePostOpen(true)}
            className="bg-yellow-500 text-gray-900 hover:bg-yellow-400"
          >
            Create Post
          </Button>
        </div>
      )}

      {/* Posts List */}
      {posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post: Post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No posts yet. Be the first to share!</p>
        </div>
      )}

      {/* Create Post Dialog */}
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setIsCreatePostOpen}
      />
    </div>
  )
}