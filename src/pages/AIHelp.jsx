import React, { useState } from 'react';
import { Search, BookOpen, Sprout, TrendingUp, CloudRain, HelpCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AIHelp() {
    const [searchQuery, setSearchQuery] = useState('');

    const helpCategories = [
        {
            icon: Sprout,
            title: 'Getting Started',
            articles: [
                'How to set up your farmer profile',
                'Understanding your personalized dashboard',
                'Connecting via WhatsApp for instant support',
                'Selecting your crops and location'
            ],
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: BookOpen,
            title: 'Crop Diagnosis',
            articles: [
                'How to take a good crop photo for diagnosis',
                'Understanding disease severity levels',
                'Organic vs chemical treatment options',
                'Following up on treatment recommendations'
            ],
            color: 'from-blue-500 to-indigo-600'
        },
        {
            icon: TrendingUp,
            title: 'Mandi Prices',
            articles: [
                'How to read mandi price trends',
                'Setting up price alerts for your crops',
                'Finding the best mandi near you',
                'Understanding modal vs min/max prices'
            ],
            color: 'from-amber-500 to-orange-600'
        },
        {
            icon: CloudRain,
            title: 'Weather & Advisory',
            articles: [
                'Understanding weather forecasts for farming',
                'Irrigation recommendations explained',
                'When to spray pesticides based on weather',
                'Seasonal crop calendar guidance'
            ],
            color: 'from-sky-500 to-blue-600'
        }
    ];

    const faqs = [
        {
            q: 'Is Kisan Saathi free to use?',
            a: 'Yes! All core features including crop diagnosis, mandi prices, weather forecasts, and WhatsApp support are completely free for farmers.'
        },
        {
            q: 'Which crops are supported?',
            a: 'We support 50+ major crops including wheat, rice, cotton, sugarcane, and all major vegetables. Our database is constantly expanding.'
        },
        {
            q: 'How accurate is the AI crop diagnosis?',
            a: 'Our AI has been trained on millions of crop images and achieves 90%+ accuracy for common diseases. For complex cases, we recommend consulting local agricultural experts.'
        },
        {
            q: 'Can I use Kisan Saathi offline?',
            a: 'You need internet to access our services. However, once you\'ve viewed content, it stays cached in your browser for quick access.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 py-20">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <HelpCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Help Center</h1>
                    <p className="text-xl text-gray-600 mb-8">Get instant answers to your questions</p>
                    
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for help articles..."
                                className="pl-12 h-14 rounded-2xl border-2 text-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-16">
                    {helpCategories.map((category, idx) => (
                        <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className={`w-12 h-12 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <category.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{category.title}</h3>
                                <ul className="space-y-2">
                                    {category.articles.map((article, articleIdx) => (
                                        <li key={articleIdx}>
                                            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm flex items-start gap-2">
                                                <span className="text-green-500 mt-1">→</span>
                                                {article}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <Card key={idx} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
                                    <p className="text-gray-600">{faq.a}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}