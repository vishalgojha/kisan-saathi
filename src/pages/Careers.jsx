import React from 'react';
import { Briefcase, Brain, Zap, Users, Mail } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Careers() {
    const roles = [
        {
            title: 'AI/ML Engineer',
            type: 'Full-time',
            location: 'Remote',
            description: 'Build and optimize AI models for agricultural applications. Work with LLMs, computer vision, and predictive analytics.',
            skills: ['Python', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision']
        },
        {
            title: 'Full Stack Developer',
            type: 'Full-time',
            location: 'Remote',
            description: 'Develop scalable web applications using React, Node.js, and cloud technologies. Build features that impact millions of farmers.',
            skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'API Design']
        },
        {
            title: 'Product Designer',
            type: 'Contract',
            location: 'Remote',
            description: 'Design intuitive interfaces for farmers with varying levels of digital literacy. Focus on mobile-first, multilingual experiences.',
            skills: ['Figma', 'Mobile Design', 'User Research', 'Accessibility']
        },
        {
            title: 'Agricultural Domain Expert',
            type: 'Part-time',
            location: 'Hybrid',
            description: 'Guide our AI with domain expertise in crops, diseases, and farming practices. Help us build accurate and contextual recommendations.',
            skills: ['Agronomy', 'Crop Science', 'Pest Management', 'Soil Science']
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 py-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Briefcase className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Join Our Team</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Build AI solutions that transform agriculture and impact millions of farmers
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    <Card className="border-0 shadow-lg text-center">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Brain className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">AI-First Culture</h3>
                            <p className="text-sm text-gray-600">Work with cutting-edge AI technology daily</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg text-center">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Zap className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">High Impact</h3>
                            <p className="text-sm text-gray-600">Your work directly helps millions of farmers</p>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg text-center">
                        <CardContent className="p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Remote-Friendly</h3>
                            <p className="text-sm text-gray-600">Work from anywhere in the world</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Open Positions</h2>
                    <div className="space-y-6">
                        {roles.map((role, idx) => (
                            <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{role.title}</h3>
                                            <div className="flex gap-2">
                                                <Badge variant="outline">{role.type}</Badge>
                                                <Badge variant="outline">{role.location}</Badge>
                                            </div>
                                        </div>
                                        <Button className="mt-4 md:mt-0 bg-indigo-600 hover:bg-indigo-700 rounded-xl">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Apply
                                        </Button>
                                    </div>
                                    <p className="text-gray-600 mb-4">{role.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.skills.map((skill, skillIdx) => (
                                            <Badge key={skillIdx} className="bg-gray-100 text-gray-700 border-0">
                                                {skill}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Card className="border-0 shadow-2xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
                    <CardContent className="p-10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Don't see a perfect fit?</h2>
                        <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
                            We're always looking for talented, passionate people. Send us your resume and tell us 
                            how you'd like to contribute to our mission.
                        </p>
                        <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100 rounded-xl">
                            <Mail className="w-5 h-5 mr-2" />
                            Get in Touch
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}