"use client"

import { AnonymousLoginForm } from "@/components/auth/anonymous-login-form"
import { LoginForm } from "@/components/auth/login-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Cross } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative">
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
            <div className="relative">
                {/* Background Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-yellow-400/20 blur-3xl -z-10" />

                <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl border border-gray-700 p-6 w-full max-w-md">
                    <div className="flex flex-col items-center space-y-2 mb-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-white">
                                Chris<span className="text-yellow-400 inline-flex w-6 h-6 mb-1"><Cross /></span>
                                ian<span className="text-yellow-400">Hub</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm text-center">
                            Welcome back! Please sign in to continue.
                        </p>
                    </div>

                    <Tabs defaultValue="credentials" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                            <TabsTrigger value="credentials" className="data-[state=active]:bg-gray-400">
                                Account
                            </TabsTrigger>
                            <TabsTrigger value="anonymous" className="data-[state=active]:bg-gray-400">
                                Anonymous
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="credentials">
                            <LoginForm />
                        </TabsContent>
                        <TabsContent value="anonymous">
                            <AnonymousLoginForm />
                        </TabsContent>
                    </Tabs>

                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-400">Don&apos;t have an account? </span>
                        <Link href="/signup" className="text-yellow-400 hover:text-yellow-300">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
