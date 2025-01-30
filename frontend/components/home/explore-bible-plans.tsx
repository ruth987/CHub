import { BiblePlansList } from "@/components/bible-plans/bible-plans-list"
import { BiblePlansHeader } from "@/components/bible-plans/bible-plans-header"

export default function ExploreBiblePlans() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <BiblePlansHeader />
      <BiblePlansList />
    </div>
  )
}