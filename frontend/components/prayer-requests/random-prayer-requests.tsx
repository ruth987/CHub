"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface PrayerRequest {
  id: number
  content: string
  created_at: string
}

export function RandomPrayerRequests() {
  const [prayers, setPrayers] = useState<PrayerRequest[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const fetchRandomPrayers = useCallback(async () => {
    if (!token) return

    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8080/api/prayer-requests/random?limit=3', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      console.log("prayer requests", response)

      if (!response.ok) throw new Error('Failed to fetch prayer requests')

      const data = await response.json()
      setPrayers(data.prayer_requests)
    } catch {
      toast({
        title: "Error",
        description: "Failed to fetch prayer requests. Please try again. ",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast, token])

  // Fetch prayers on component mount
  useEffect(() => {
    fetchRandomPrayers()
  }, [fetchRandomPrayers])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-gray-400">Pray for these requests from our community</p>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchRandomPrayers}
          disabled={isLoading}
          className="border-yellow-500/50 hover:bg-yellow-500/10"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
          ) : (
            <RefreshCw className="h-4 w-4 text-yellow-500" />
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
        </div>
      ) : prayers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No prayer requests available at the moment
        </div>
      ) : (
        <div className="space-y-4">
          {prayers.map((prayer) => (
            <Card 
              key={prayer.id} 
              className="p-4 bg-gray-800/30 border-gray-700 hover:border-yellow-500/50 transition-colors"
            >
              <p className="text-gray-300">{prayer.content}</p>
              <p className="text-sm text-gray-500 mt-2">
                Posted {new Date(prayer.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}