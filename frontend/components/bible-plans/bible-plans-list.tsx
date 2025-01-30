import { BiblePlanCard } from "./bible-plan-card"

const BIBLE_PLANS = [
  {
    id: "1",
    title: "21 Days of Prayer",
    description: "A journey through powerful prayers in the Bible",
    longDescription: "This 21-day prayer journey will guide you through some of the most powerful prayers in the Bible. Each day includes a biblical prayer, commentary, and reflection questions to deepen your prayer life.",
    duration: "21 days",
    image: "/images/bible-plan1.jpg",
    topics: ["Prayer", "Spiritual Growth", "Biblical Study"]
  },
  {
    id: "2",
    title: "Understanding Grace",
    description: "Explore God's amazing grace through Scripture",
    longDescription: "Dive deep into the concept of God's grace through this comprehensive study. Discover how grace transforms our lives and relationships with God and others.",
    duration: "14 days",
    image: "/images/bible-plan2.jpeg",
    topics: ["Grace", "Salvation", "Faith"]
  },
  {
    id: "3",
    title: "The Gospel of John",
    description: "A journey through the Gospel of John",
    longDescription: "This 14-day journey through the Gospel of John will guide you through the life of Jesus Christ, from his birth to his resurrection. Each day includes a biblical reading, commentary, and reflection questions to deepen your understanding of the Gospel.",
    duration: "365 days",
    image: "/images/bible-plan3.jpeg",
    topics: ["Gospel", "Jesus", "Christianity"]
  },
  {
    id: "4",
    title: "21 Days of Prayer",
    description: "A journey through powerful prayers in the Bible",
    longDescription: "This 21-day prayer journey will guide you through some of the most powerful prayers in the Bible. Each day includes a biblical prayer, commentary, and reflection questions to deepen your prayer life.",
    duration: "21 days",
    image: "/images/bible-plan1.jpg",
    topics: ["Prayer", "Spiritual Growth", "Biblical Study"]
  },
  {
    id: "5",
    title: "Understanding Grace",
    description: "Explore God's amazing grace through Scripture",
    longDescription: "Dive deep into the concept of God's grace through this comprehensive study. Discover how grace transforms our lives and relationships with God and others.",
    duration: "14 days",
    image: "/images/bible-plan2.jpeg",
    topics: ["Grace", "Salvation", "Faith"]
  },
  {
    id: "6",
    title: "The Gospel of John",
    description: "A journey through the Gospel of John",
    longDescription: "This 14-day journey through the Gospel of John will guide you through the life of Jesus Christ, from his birth to his resurrection. Each day includes a biblical reading, commentary, and reflection questions to deepen your understanding of the Gospel.",
    duration: "365 days",
    image: "/images/bible-plan3.jpeg",
    topics: ["Gospel", "Jesus", "Christianity"]
  },
]

export function BiblePlansList() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BIBLE_PLANS.map((plan) => (
          <BiblePlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  )
}