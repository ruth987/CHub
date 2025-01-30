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
  import Image from "next/image"
  
  const features = [
    {
      title: "Bible Reading Plans",
      description: "Follow structured Bible reading plans tailored to your spiritual journey.",
      icon: BookPlus,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Community Support",
      description: "Connect with fellow believers and share your faith journey together.",
      icon: Users,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Ask & Answer",
      description: "Get biblical answers to your spiritual questions from the community.",
      icon: MessageCircle,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Daily Devotionals",
      description: "Start each day with inspiring devotionals and Scripture readings.",
      icon: BookOpen,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Prayer Requests",
      description: "Share prayer requests and pray for others in the community.",
      icon: Grab,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Study Groups",
      description: "Join virtual study groups to dive deeper into God's Word.",
      icon: BookMarked,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Event Calendar",
      description: "Stay updated with community events and Bible study schedules.",
      icon: Calendar,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    },
    {
      title: "Encouraging Community",
      description: "Experience a supportive environment focused on spiritual growth.",
      icon: Heart,
      color: "text-yellow-400",
      bgColor: "bg-gray-800"
    }
  ]
  
  export function Features() {
    return (
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
        <Image
          src="/images/worship.jpg" 
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/95 via-gray-900/90 to-gray-900/95" />
      </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-white">
              Everything You Need to Grow in Faith
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Discover tools and resources designed to support your spiritual journey
              and connect you with a community of believers.
            </p>
          </div>
  
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="relative p-6 bg-gray-800 rounded-2xl border border-gray-700 hover:border-yellow-400/50 transition-colors"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 border border-gray-700`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }