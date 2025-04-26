"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export function PrayerRequestForm() {
  const [request, setRequest] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!request.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/prayer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: request })
      })

      if (!response.ok) throw new Error('Failed to submit prayer request')

      toast({
        title: "Prayer Request Submitted",
        description: "Your prayer request has been submitted anonymously.",
        variant: "default",
      })

      setRequest("")
    } catch {
      toast({
        title: "Error",
        description: "Failed to submit prayer request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Share your prayer request here..."
        value={request}
        onChange={(e) => setRequest(e.target.value)}
        className="min-h-[150px] bg-gray-900 border-gray-700 text-white placeholder:text-gray-400"
      />
      <Button 
        type="submit" 
        className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-400"
        disabled={isSubmitting || !request.trim()}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Prayer Request"
        )}
      </Button>
    </form>
  )
} 