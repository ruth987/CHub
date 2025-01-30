import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const FEATURED_QUESTIONS = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      image: "/avatars/sarah.jpg",
      initials: "SJ"
    },
    question: "How do you maintain faith during difficult times?",
    comments: 12,
    preview: "In times of hardship, I've found it challenging to...",
    tags: ["Faith", "Encouragement"]
  },
  // Add more questions...
]

export function QuestionsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Community Discussions
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join meaningful discussions about faith, scripture, and life's challenges.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURED_QUESTIONS.map((q) => (
            <Card key={q.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <Avatar>
                  <AvatarImage src={q.user.image} alt={q.user.name} />
                  <AvatarFallback>{q.user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{q.user.name}</CardTitle>
                  <div className="flex gap-2 mt-1">
                    {q.tags.map((tag) => (
                      <span key={tag} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <h3 className="font-semibold mb-2">{q.question}</h3>
                <p className="text-gray-600 text-sm">{q.preview}</p>
                <div className="mt-4 text-sm text-gray-500">
                  {q.comments} comments
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}