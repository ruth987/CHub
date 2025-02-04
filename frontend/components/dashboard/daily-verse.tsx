import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface DailyVerseProps {
  verse: string
  reference: string
}

export function DailyVerse({ verse, reference }: DailyVerseProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg text-white">Daily Verse</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300 italic">{verse}</p>
        <p className="text-sm text-gray-400 mt-2">{reference}</p>
      </CardContent>
    </Card>
  )
}