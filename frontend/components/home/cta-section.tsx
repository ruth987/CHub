import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-yellow-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
          Join Our Growing Community
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Connect with fellow believers, access Bible study resources, and grow in your faith journey.
          Start your spiritual journey with ChristianHub today.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-yellow-500 text-black hover:bg-yellow-400">
            <Link href="/register">Join Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}