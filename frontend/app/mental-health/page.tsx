"use client";

import { CalendlyEmbed } from "@/components/mental-health/calendly-embed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function MentalHealthPage() {
    return (
        <div className="min-h-screen bg-gray-900">
            <div className="container mx-auto py-12 space-y-12 px-4">
                <div className="text-center space-y-6">
                    <h1 className="text-5xl font-bold text-white tracking-tight">Mental Health Support</h1>
                    <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">
                        Your mental health matters. We&apos;re here to support you through your academic journey.
                        Schedule a confidential session with our trained counselors.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">One-on-One Counseling</CardTitle>
                            <CardDescription className="text-gray-400 text-base">
                                Confidential sessions with trained mental health professionals
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Academic stress management</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Anxiety and depression support</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Study-life balance guidance</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Personal development coaching</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm hover:border-orange-500/50 transition-colors">
                        <CardHeader>
                            <CardTitle className="text-2xl text-white">Group Support Sessions</CardTitle>
                            <CardDescription className="text-gray-400 text-base">
                                Connect with peers in a supportive environment
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-gray-300">
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Peer support groups</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Stress management workshops</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Mindfulness sessions</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="text-orange-500">•</span>
                                    <span>Study skills development</span>
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-12 bg-gray-800/30 p-4 rounded-xl border border-gray-700/50 w-full">
                    <CalendlyEmbed 
                        url="https://calendly.com/ruthwossen75/schedule-a-confidential-mental-health-session" 
                        title="Schedule a Confidential Mental Health Session"
                    />
                </div>

                <div className="mt-12 text-center bg-gray-800/30 p-8 rounded-xl border border-gray-700/50">
                    <h2 className="text-3xl font-semibold text-white mb-6">Emergency Support</h2>
                    <p className="text-gray-300 mb-6 text-lg">
                        If you&apos;re experiencing a mental health emergency, please contact:
                    </p>
                    <div className="space-y-4">
                        <p className="text-orange-500 font-semibold text-xl">National Crisis Hotline: 988</p>
                        <p className="text-orange-500 font-semibold text-xl">Crisis Text Line: Text HOME to 741741</p>
                    </div>
                </div>
            </div>
        </div>
    );
} 