import { BookOpen, Users, TrendingUp, Hand } from "lucide-react"
import { StatsCard } from "./stats-card"

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="Daily Bible Streak"
        value="7 days"
        description="Keep it up!"
        icon={BookOpen}
      />
      <StatsCard
        title="Prayer Partners"
        value={24}
        description="Active connections"
        icon={Users}
      />
      <StatsCard
        title="Community Impact"
        value={156}
        description="Lives touched this month"
        icon={TrendingUp}
      />
      <StatsCard
        title="Prayer Requests"
        value={12}
        description="Active requests"
        icon={Hand}
      />
    </div>
  )
}