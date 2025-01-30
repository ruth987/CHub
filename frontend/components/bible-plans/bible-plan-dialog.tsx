import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { Button } from "@/components/ui/button"
  import Image from "next/image"
  
  interface BiblePlanDialogProps {
    children: React.ReactNode
    plan: {
      title: string
      image: string
      longDescription: string
      duration: string
      topics: string[]
    }
  }
  
  export function BiblePlanDialog({ children, plan }: BiblePlanDialogProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{plan.title}</DialogTitle>
            <DialogDescription>
              Duration: {plan.duration}
            </DialogDescription>
          </DialogHeader>
          <div className="relative h-48 w-full mt-4">
            <Image
              src={plan.image}
              alt={plan.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          <div className="mt-4">
            <p className="text-gray-700">{plan.longDescription}</p>
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Topics covered:</h4>
              <div className="flex flex-wrap gap-2">
                {plan.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button>Start This Plan</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }