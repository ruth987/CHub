import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BiblePlanDialog } from "@/components/bible-plans/bible-plan-dialog"

interface BiblePlan {
  id: string
  title: string
  description: string
  duration: string
  image: string
  longDescription: string
  topics: string[]
}

interface BiblePlanCardProps {
  plan: BiblePlan
}

export function BiblePlanCard({ plan }: BiblePlanCardProps) {
  return (
    <Card className="overflow-hidden bg-gray-800 border-gray-700 hover:border-yellow-400/50 transition-colors">
      <div className="relative h-48 w-full">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay */}
      </div>
      <CardHeader>
        <CardTitle className="text-white">{plan.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">{plan.description}</p>
        <div className="mt-2 flex items-center text-sm text-yellow-400">
          <span>Duration: {plan.duration}</span>
        </div>
      </CardContent>
      <CardFooter>
        <BiblePlanDialog plan={plan}>
          <Button className="w-full bg-yellow-500 text-gray-900 hover:bg-yellow-400">
            Learn More
          </Button>
        </BiblePlanDialog>
      </CardFooter>
    </Card>
  )
}