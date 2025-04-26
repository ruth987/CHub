"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BiblePlansHeader } from "@/components/bible-plans/bible-plans-header"
import { BiblePlansList } from "@/components/bible-plans/bible-plans-list"

export default function BiblePlansPage() {
  const router = useRouter()

  // Protect the route
  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      {/* Header Section */}
      <BiblePlansHeader />
      
      {/* Plans Grid */}
      <BiblePlansList />
    </div>
  )
} 