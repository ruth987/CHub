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
        <DialogContent className="sm:max-w-[625px] bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">{plan.title}</DialogTitle>
            <DialogDescription className="text-yellow-400">
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
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <div className="mt-4">
            <p className="text-gray-300">{plan.longDescription}</p>
            <div className="mt-4">
              <h4 className="font-semibold mb-2 text-white">Topics covered:</h4>
              <div className="flex flex-wrap gap-2">
                {plan.topics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-gray-700 text-yellow-400 rounded-full text-sm border border-gray-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="bg-yellow-500 text-gray-900 hover:bg-yellow-400">
              Start This Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }