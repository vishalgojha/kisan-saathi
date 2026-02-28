import React from 'react';
import { Lightbulb, Rocket, Shield, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Vision() {
    const principles = [
        {
            icon: Lightbulb,
            title: 'AI for Good',
            description: 'We believe AI should solve real problems for real people, especially those in underserved communities.',
            color: 'from-yellow-500 to-orange-500'
        },
        {
            icon: Rocket,
            title: 'Innovation at Scale',
            description: 'Build once, impact millions. Our technology is designed to scale without compromising quality or accessibility.',
            color: 'from-blue-500 to-indigo-500'
        },
        {
            icon: Shield,
            title: 'Trust & Transparency',
            description: 'We operate with complete transparency, ensuring our users understand how AI works and what data we use.',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Heart,
            title: 'Human-Centered',
            description: 'Technology should enhance human capabilities, not replace them. We design with empathy and cultural sensitivity.',
            color: 'from-pink-500 to-rose-500'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Vision</h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        To create an AI-powered future where every farmer, regardless of location or resources, 
                        has access to world-class agricultural intelligence
                    </p>
                </div>

                <div className="mb-16">
                    <Card className="border-0 shadow-2xl">
                        <CardContent className="p-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">The Future We're Building</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                                <p>
                                    Imagine a world where a farmer in rural India can instantly diagnose a crop disease, 
                                    get personalized treatment recommendations, check real-time market prices, and plan 
                                    for optimal harvest—all through a simple WhatsApp message in their native language.
                                </p>
                                <p>
                                    This isn't science fiction. This is what we're building today at Chaos Craft Labs.
                                </p>
                                <p>
                                    By 2030, we envision Kisan Saathi becoming the primary agricultural advisor for 50 million 
                                    farmers across India and beyond, reducing crop losses by 30%, increasing farmer income by 40%, 
                                    and promoting sustainable farming practices at scale.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Guiding Principles</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        {principles.map((principle, idx) => (
                            <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className={`w-14 h-14 bg-gradient-to-br ${principle.color} rounded-2xl flex items-center justify-center mb-4`}>
                                        <principle.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">{principle.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{principle.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

