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
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full">
        <Image
          src={plan.image}
          alt={plan.title}
          fill
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">{plan.description}</p>
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <span>Duration: {plan.duration}</span>
        </div>
      </CardContent>
      <CardFooter>
        <BiblePlanDialog plan={plan}>
          <Button className="w-full">Learn More</Button>
        </BiblePlanDialog>
      </CardFooter>
    </Card>
  )
}