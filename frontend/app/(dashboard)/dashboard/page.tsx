"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { FeedTabs } from "@/components/dashboard/feed-tabs"
import { DailyVerse } from "@/components/dashboard/daily-verse"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { usePosts, useUserPosts } from "@/hooks/posts"
import { useSavedPosts } from "@/hooks/saved-posts"
import { useUser } from "@/hooks/auth"
import  { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

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
  const [showScrollTop, setShowScrollTop] = useState(false)
  
  // Protect the dashboard route
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }


  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

    // Fetch all types of posts
    const { data: posts = [], isLoading } = usePosts()
    const { data: userPosts = [], isLoading: isLoadingUserPosts } = useUserPosts(user?.id)
    const { savedPosts, isLoadingSavedPosts } = useSavedPosts()

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
            <FeedTabs 
              allPosts={posts} 
              userPosts={userPosts} 
              savedPosts={savedPosts}
              isLoading={isLoading || isLoadingUserPosts || isLoadingSavedPosts}
            />
          </div>
          
          <div className="space-y-6">
            <DailyVerse 
              verse={mockData.dailyVerse.verse} 
              reference={mockData.dailyVerse.reference} 
            />
            <UpcomingEvents events={mockData.events} />
          </div>
        </div>
        {/* Scroll to Top Button */}
        <Button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-8 right-8 rounded-full p-3 bg-gray-600 hover:border-yellow-600 hover:border-2 border-1 border-yellow-500 shadow-lg transition-all duration-300 z-50 h-14 w-14",
            showScrollTop ? "translate-y-0 opacity-100" : "translate-y-16 opacity-0"
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="h-10 w-10 text-yellow-500" />
        </Button>
      </div>
    </div>
  )
}
