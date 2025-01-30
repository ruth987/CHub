import { 
    BookPlus, 
    Users, 
    MessageCircle, 
    BookOpen, 
    Grab, 
    Heart,
    Calendar,
    BookMarked
  } from "lucide-react"
  
  const features = [
    {
      title: "Bible Reading Plans",
      description: "Follow structured Bible reading plans tailored to your spiritual journey.",
      icon: BookPlus,
      color: "text-blue-500",
      bgColor: "bg-blue-50"
    },
    {
      title: "Community Support",
      description: "Connect with fellow believers and share your faith journey together.",
      icon: Users,
      color: "text-green-500",
      bgColor: "bg-green-50"
    },
    {
      title: "Ask & Answer",
      description: "Get biblical answers to your spiritual questions from the community.",
      icon: MessageCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      title: "Daily Devotionals",
      description: "Start each day with inspiring devotionals and Scripture readings.",
      icon: BookOpen,
      color: "text-red-500",
      bgColor: "bg-red-50"
    },
    {
      title: "Prayer Requests",
      description: "Share prayer requests and pray for others in the community.",
      icon: Grab,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50"
    },
    {
      title: "Study Groups",
      description: "Join virtual study groups to dive deeper into God's Word.",
      icon: BookMarked,
      color: "text-indigo-500",
      bgColor: "bg-indigo-50"
    },
    {
      title: "Event Calendar",
      description: "Stay updated with community events and Bible study schedules.",
      icon: Calendar,
      color: "text-pink-500",
      bgColor: "bg-pink-50"
    },
    {
      title: "Encouraging Community",
      description: "Experience a supportive environment focused on spiritual growth.",
      icon: Heart,
      color: "text-orange-500",
      bgColor: "bg-orange-50"
    }
  ]
  
  export function Features() {
    return (
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything You Need to Grow in Faith
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover tools and resources designed to support your spiritual journey
              and connect you with a community of believers.
            </p>
          </div>
  
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }