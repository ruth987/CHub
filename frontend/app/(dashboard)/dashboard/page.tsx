"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { StatsGrid } from "@/components/dashboard/stats-grid"
import { FeedTabs } from "@/components/dashboard/feed-tabs"
import { DailyVerse } from "@/components/dashboard/daily-verse"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"

// Mock data - move to a separate file later
const mockData = {
  username: "John",
  posts: [
    {
      id: "1",
      title: "Finding Peace in Daily Prayer",
      content: "Today I wanted to share my experience with...",
      author: {
        name: "John Doe",
        image: "/avatars/john.jpg",
      },
      createdAt: "2 hours ago",
      tags: ["Prayer", "Devotional"],
      likes: 24,
      comments: 5,
    },
    {
        id: "2",
        title: "Finding Peace in Daily Prayer",
        content: "Today I wanted to share my experience with...",
        author: {
          name: "John Doe",
          image: "/avatars/john.jpg",
        },
        createdAt: "2 hours ago",
        tags: ["Prayer", "Devotional"],
        likes: 24,
        comments: 5,
      },
      {
        id: "3",
        title: "Finding Peace in Daily Prayer",
        content: "Today I wanted to share my experience with...",
        author: {
          name: "John Doe",
          image: "/avatars/john.jpg",
        },
        createdAt: "2 hours ago",
        tags: ["Prayer", "Devotional"],
        likes: 24,
        comments: 5,
      },
  ],
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
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto p-6 space-y-8">
        <DashboardHeader username={mockData.username} />
        <StatsGrid />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <FeedTabs posts={mockData.posts} />
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