import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { Navbar } from "../layout/navbar"

export function Hero() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/landingpage.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl max-w-4xl mx-auto">
          Grow Your Faith
          <span className="block text-yellow-400">Together in Christ</span>
        </h1>
        
        <p className="mx-auto mb-12 max-w-2xl text-lg text-gray-200">
          Join our community of believers sharing Bible plans, seeking wisdom,
          and growing together in their spiritual journey.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="bg-yellow-500 text-black hover:bg-yellow-400"
          >
            <Link href="/register">Start Your Journey</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white text-gray-600 hover:bg-white hover:text-black"
          >
            <Link href="/bible-plans">Explore Bible Plans</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}