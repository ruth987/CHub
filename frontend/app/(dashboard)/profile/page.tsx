"use client"

import { useUser } from "@/hooks/auth"
import { useUserPosts } from "@/hooks/posts"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Mail, ScrollText, Grid } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useUser()
  const { data: userPosts = [], isLoading } = useUserPosts(user?.id)

  // Protect the profile route
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-yellow-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 space-y-8">
        {/* Profile Header */}
        <Card className="p-8 bg-gray-800/50 border-gray-700">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Avatar className="h-32 w-32 border-2 border-yellow-500">
              <AvatarFallback className="text-4xl bg-yellow-500 text-gray-900">
                {user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="space-y-4 text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-white">{user.username}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-yellow-500" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-yellow-500" />
                  <span>{user.postCount} Posts</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button className="text-red-500 font-semibold" onClick={() => {
                    localStorage.removeItem('token')
                    router.push('/login')
                  }}>Logout</Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Separator className="bg-gray-700" />

        {/* Posts Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Grid className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-white">Posts</h2>
          </div>

          {isLoading ? (
            <div className="text-center text-gray-400 py-8">Loading posts...</div>
          ) : userPosts.length === 0 ? (
            <div className="text-center text-gray-400 py-12 bg-gray-800/50 rounded-lg">
              <ScrollText className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <p className="text-lg">No posts yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userPosts.map((post) => (
                <Link href={`/posts/${post.id}`} key={post.id}>
                  <Card className="group hover:border-yellow-500 transition-all duration-300 overflow-hidden bg-gray-800/50 border-gray-700">
                    {post.image_url && (
                      <div className="aspect-square w-full overflow-hidden">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {post.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2 mt-1">
                        {post.content}
                      </p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

