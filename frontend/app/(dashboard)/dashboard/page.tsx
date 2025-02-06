"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { FeedTabs } from "@/components/dashboard/feed-tabs"
import { DailyVerse } from "@/components/dashboard/daily-verse"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { usePosts, useUserPosts } from "@/hooks/posts"
import { useUser } from "@/hooks/auth"
import  { useRouter } from "next/navigation"
import { useEffect } from "react"

// Mock data - move to a separate file later
const mockData = {
  username: "John",
  events: [
    {
      id: "1",
      title: "Bible Study Group",
      date: "Tomorrow, 7:00 PM",
      attendees: 12,
    },
  ],
  dailyVerse: {
    verse: "For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.",
    reference: "Jeremiah 29:11",
  },
}


export default function DashboardPage() {
  const router = useRouter()
  const { user } = useUser()
  
  // Protect the dashboard route
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

    // Fetch posts with the user's ID
    const { data: posts = [], isLoading } = usePosts()
    const { data: userPosts = [], isLoading: isLoadingUserPosts } = useUserPosts(user?.id)

    console.log("userPosts", userPosts)
    console.log("posts", posts)
  
    // Show loading state while checking authentication
    if (!user) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          Loading...
        </div>
      )
    }
  

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader username={user?.username} />
        <StatsGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FeedTabs allPosts={posts} userPosts={userPosts} isLoading={isLoading || isLoadingUserPosts} />
          </div>
          
          <div className="space-y-6">
            <DailyVerse 
              verse={mockData.dailyVerse.verse} 
              reference={mockData.dailyVerse.reference} 
            />
            <UpcomingEvents events={mockData.events} />
          </div>
        </div>
      </div>
    </div>
  )
}