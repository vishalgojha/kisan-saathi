import React from 'react';
import { Rocket, CheckCircle2, Smartphone, MessageCircle, BarChart3, Bell } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function GettingStarted() {
    const steps = [
        {
            icon: Smartphone,
            title: 'Set Up Your Profile',
            description: 'Tell us about your location, crops, and farming preferences. This helps us personalize your experience.',
            action: 'Complete Profile',
            time: '2 min',
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: MessageCircle,
            title: 'Connect on WhatsApp',
            description: 'Get instant answers to your farming questions via WhatsApp. Available 24/7 in Hindi and English.',
            action: 'Connect WhatsApp',
            time: '1 min',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: BarChart3,
            title: 'Explore Your Dashboard',
            description: 'Check weather, mandi prices, crop advisories, and government schemes - all in one place.',
            action: 'View Dashboard',
            time: '5 min',
            color: 'from-purple-500 to-pink-600'
        },
        {
            icon: Bell,
            title: 'Enable Notifications',
            description: 'Get alerts for price changes, weather warnings, and important farming updates.',
            action: 'Setup Alerts',
            time: '2 min',
            color: 'from-amber-500 to-orange-600'
        }
    ];

    const features = [
        {
            title: 'AI Crop Doctor',
            description: 'Upload a photo of your crop and get instant disease diagnosis with treatment recommendations.',
            icon: '🌱'
        },
        {
            title: 'Live Mandi Prices',
            description: 'Check real-time prices for 50+ crops across 500+ mandis. Set alerts for your favorite crops.',
            icon: '💰'
        },
        {
            title: 'Weather Forecasts',
            description: '5-day weather predictions with irrigation and spray recommendations based on conditions.',
            icon: '🌤️'
        },
        {
            title: 'Government Schemes',
            description: 'Discover subsidies, loans, and schemes you qualify for. Get step-by-step application guidance.',
            icon: '🏛️'
        },
        {
            title: 'Renewable Energy Advisor',
            description: 'Calculate solar and wind energy potential for your farm. Estimate costs and savings.',
            icon: '☀️'
        },
        {
            title: 'Crop Calendar',
            description: 'Get timely reminders for sowing, fertilizing, pest control, and harvesting based on your crops.',
            icon: '📅'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Rocket className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Getting Started with Kisan Saathi</h1>
                    <p className="text-xl text-gray-600">Your personalized farming assistant in 4 simple steps</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {steps.map((step, idx) => (
                        <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-all">
                            <CardContent className="p-8">
                                <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center mb-4`}>
                                    <step.icon className="w-7 h-7 text-white" />
                                </div>
                                <div className="flex items-center gap-3 mb-3">
                                    <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                        {step.time}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">{step.description}</p>
                                <Button className={`bg-gradient-to-r ${step.color} hover:opacity-90 rounded-xl w-full`}>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    {step.action}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">What You Can Do with Kisan Saathi</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, idx) => (
                            <Card key={idx} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="text-4xl mb-3">{feature.icon}</div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <Card className="mt-12 border-0 shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <CardContent className="p-10 text-center">
                        <h2 className="text-3xl font-bold mb-4">Need Help?</h2>
                        <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                            Our AI assistant is available 24/7 on WhatsApp to answer your questions in Hindi or English.
                        </p>
                        <a 
                            href={base44.agents.getWhatsAppConnectURL('KisanSaathi')} 
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 rounded-xl">
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Chat on WhatsApp
                            </Button>
                        </a>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}