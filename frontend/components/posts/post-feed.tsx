"use client"

import { PostCard } from "./post-card"
import { useState } from "react"

// Dummy data with more realistic content
const dummyPosts = Array.from({ length: 10 }, (_, index) => ({
  id: `${index + 1}`,
  title: [
    "Understanding the Book of Psalms",
    "Daily Prayer Routine",
    "Bible Study Tips for Beginners",
    "Finding Peace in Scripture",
    "Community Fellowship Ideas",
    "Worship Song Recommendations",
    "Faith Journey Reflections",
    "Bible Verse of the Day",
    "Christian Book Reviews",
    "Prayer Request Support"
  ][index],
  content: [
    "I've been studying Psalms lately and wanted to share some insights...",
    "Here's my morning prayer routine that has helped me stay consistent...",
    "As a new believer, these study methods have really helped me...",
    "During difficult times, these verses have brought me comfort...",
    "Looking for fellowship ideas? Here's what works in our community...",
    "These worship songs have been blessing me lately...",
    "Reflecting on my faith journey over the past year...",
    "Today's verse is from John 3:16. Let's discuss its meaning...",
    "Just finished reading 'Mere Christianity'. Here are my thoughts...",
    "Please keep my family in your prayers as we..."
  ][index],
  author: {
    name: [
      "Sarah Johnson",
      "Michael Chen",
      "Anonymous",
      "Rachel Smith",
      "David Wilson",
      "Maria Garcia",
      "Anonymous",
      "James Lee",
      "Emma Davis",
      "John Miller"
    ][index],
    image: index % 3 === 2 ? undefined : `/avatars/avatar${(index % 3) + 1}.jpg`,
    isAnonymous: index % 3 === 2
  },
  createdAt: new Date(Date.now() - index * 86400000).toLocaleDateString(),
  imageUrl: index % 3 === 0 ? `/images/psalm-post.jpg` : undefined,
  linkUrl: index % 4 === 0 ? "https://example.com/bible-study" : undefined,
  tags: [
    ["Prayer", "Psalms", "Bible Study"],
    ["Daily Devotion", "Prayer"],
    ["Bible Study", "Beginner"],
    ["Peace", "Scripture", "Faith"],
    ["Community", "Fellowship"],
    ["Worship", "Music"],
    ["Testimony", "Faith Journey"],
    ["Bible Verse", "Discussion"],
    ["Books", "Review"],
    ["Prayer Request", "Support"]
  ][index],
  likes: Math.floor(Math.random() * 50),
  comments: Math.floor(Math.random() * 20),
  isLiked: Math.random() > 0.5
}))

export function PostFeed() {
  const [posts, setPosts] = useState(dummyPosts)
  const [loading, setLoading] = useState(false)

  const loadMore = () => {
    setLoading(true)
    // Simulate loading delay
    setTimeout(() => {
      setPosts([...posts, ...dummyPosts])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      
      {loading && (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500" />
        </div>
      )}
      
      <div className="flex justify-center">
        <button
          onClick={loadMore}
          className="px-4 py-2 bg-yellow-500 text-gray-900 rounded-md hover:bg-yellow-400 transition-colors"
        >
          Load More
        </button>
      </div>
    </div>
  )
}