import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const COMMUNITY_MEMBERS = [
  {
    name: "Ruth Wossen",
    role: "Biblical Scholar",
    image: "/avatars/michael.jpg",
    initials: "RW",
    description: "PhD in Biblical Studies, helping members understand scripture deeply."
  },
  {
    name: "Yidnekachew Tebeje",
    role: "Biblical Scholar",
    image: "/avatars/michael.jpg",
    initials: "YT",
    description: "PhD in Biblical Studies, helping members understand scripture deeply."
  },
  {
    name: "Yohannes Getachew",
    role: "Biblical Scholar",
    image: "/avatars/michael.jpg",
    initials: "YG",
    description: "PhD in Biblical Studies, helping members understand scripture deeply."
  },
  {
    name: "Saron Meseret",
    role: "Biblical Scholar",
    image: "/avatars/michael.jpg",
    initials: "SM",
    description: "PhD in Biblical Studies, helping members understand scripture deeply."
  },
  {
    name: "Samuel Mulugheta",
    role: "Biblical Scholar",
    image: "/avatars/michael.jpg",
    initials: "SM",
    description: "PhD in Biblical Studies, helping members understand scripture deeply."
  },

]

export function CommunitySection() {
  return (
    <section className="py-20 bg-gray-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
            Meet Our Community
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Learn from and connect with our diverse community of believers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {COMMUNITY_MEMBERS.map((member) => (
            <Card key={member.name} className="text-center p-6 bg-gray-800 border-gray-700 hover:border-yellow-400/50">
              <CardContent className="pt-4">
                <Avatar className="w-24 h-24 mx-auto mb-4">
                  <AvatarImage src={member.image} alt={member.name} />
                  <AvatarFallback className="text-lg bg-gray-700 text-yellow-400">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-xl mb-1 text-white">{member.name}</h3>
                <div className="text-yellow-400 mb-3">{member.role}</div>
                <p className="text-gray-400">{member.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}