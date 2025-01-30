import { BiblePlansList } from "@/components/bible-plans/bible-plans-list"
import { BiblePlansHeader } from "@/components/bible-plans/bible-plans-header"
import Image from "next/image"

export default function ExploreBiblePlans() {
  return (
    <div className="min-h-screen bg-gray-900 py-12 ">
      <BiblePlansHeader />
      <BiblePlansList />
    </div>
  )
}