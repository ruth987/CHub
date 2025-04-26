"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { PrayerRequestForm } from "@/components/prayer-requests/prayer-request-form"
import { RandomPrayerRequests } from "@/components/prayer-requests/random-prayer-requests"

export default function PrayerRequestsPage() {
  const router = useRouter()

  // Protect the route
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Prayer Requests</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Share your prayer requests anonymously and join in praying for others. 
            Together, we can lift each other up in prayer.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submit Prayer Request Section */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Submit a Prayer Request</h2>
              <PrayerRequestForm />
            </Card>
          </div>

          {/* Get Prayer Requests Section */}
          <div className="space-y-6">
            <Card className="bg-gray-800/50 border-gray-700 p-6">
              <h2 className="text-2xl font-semibold text-white mb-4">Pray for Others</h2>
              <RandomPrayerRequests />
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
} 