import React from 'react';
import { Sprout, Target, Users, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Sprout className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">About Chaos Craft Labs</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Building AI-powered solutions that transform traditional industries
                    </p>
                </div>

                <div className="space-y-8 mb-16">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Chaos Craft Labs was founded with a singular mission: to harness the power of artificial intelligence 
                                to solve real-world problems in industries that need it most. We believe technology should be accessible, 
                                practical, and transformative.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Kisan Saathi is our flagship agricultural AI platform, designed to empower farmers across India with 
                                instant access to expert agricultural advice, market intelligence, and personalized crop management tools.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-2 gap-6">
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                                    <Target className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
                                <p className="text-gray-600">
                                    Democratize access to advanced AI technology for farmers, helping them increase yields, 
                                    reduce costs, and make data-driven decisions.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Our Impact</h3>
                                <p className="text-gray-600">
                                    Serving over 1 million farmers across India, providing real-time crop advice, 
                                    disease diagnosis, and market intelligence in their local language.
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                        <CardContent className="p-8">
                            <div className="flex items-center gap-4 mb-4">
                                <Globe className="w-8 h-8" />
                                <h3 className="text-2xl font-bold">Global Vision, Local Impact</h3>
                            </div>
                            <p className="text-green-50 leading-relaxed">
                                While we're proudly made in India, our technology and approach are designed to scale globally. 
                                We're building AI solutions that respect local contexts while leveraging global best practices.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}