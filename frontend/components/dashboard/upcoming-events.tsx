import { Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Event {
  id: string
  title: string
  date: string
  attendees: number
}

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg text-white">Upcoming Events</CardTitle>
        <Calendar className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-white">{event.title}</p>
                <p className="text-sm text-gray-400">{event.date}</p>
              </div>
              <Button variant="outline" size="sm">
                Join
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}