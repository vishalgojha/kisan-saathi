import React from 'react';
import { Linkedin, Twitter, Mail, Code2, Sparkles, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Creator() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
                        VO
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">Vishal Ojha</h1>
                    <p className="text-xl text-gray-600 mb-6">Founder & Creator, Chaos Craft Labs</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <Linkedin className="w-4 h-4 mr-2" />
                            LinkedIn
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <Twitter className="w-4 h-4 mr-2" />
                            Twitter
                        </Button>
                        <Button variant="outline" size="sm" className="rounded-xl">
                            <Mail className="w-4 h-4 mr-2" />
                            Contact
                        </Button>
                    </div>
                </div>

                <div className="space-y-6">
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">About Vishal</h2>
                            <p className="text-gray-600 leading-relaxed mb-4">
                                Vishal is a technology entrepreneur and AI enthusiast passionate about using artificial intelligence 
                                to solve real-world problems in emerging markets. With a background in computer science and years of 
                                experience building scalable systems, he founded Chaos Craft Labs to bridge the gap between 
                                cutting-edge AI and practical applications.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Growing up in India, Vishal witnessed firsthand the challenges farmers face in accessing timely 
                                information and expert advice. This inspired him to create Kisan Saathi, an AI-powered platform 
                                that democratizes agricultural knowledge and empowers farmers to make better decisions.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Code2 className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Tech Innovator</h3>
                                <p className="text-sm text-gray-600">Building AI solutions that scale</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Sparkles className="w-6 h-6 text-pink-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Creative Thinker</h3>
                                <p className="text-sm text-gray-600">Finding elegant solutions to complex problems</p>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg">
                            <CardContent className="p-6 text-center">
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">Mission-Driven</h3>
                                <p className="text-sm text-gray-600">Impact over everything</p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <CardContent className="p-8">
                            <h3 className="text-2xl font-bold mb-3">Philosophy</h3>
                            <p className="text-purple-50 leading-relaxed italic">
                                "Technology should be a force for good, accessible to everyone, and designed with empathy. 
                                The best innovations don't just solve problems—they transform lives and create opportunities 
                                for those who need them most."
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}