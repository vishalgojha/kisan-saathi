import React, { useState } from 'react';
import { Book, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function Glossary() {
    const [searchQuery, setSearchQuery] = useState('');

    const terms = [
        {
            term: 'Modal Price',
            category: 'Mandi',
            definition: 'The most common or average price at which a commodity is sold in a mandi. This is the price most transactions occur at.',
            hindiTerm: 'मॉडल प्राइस'
        },
        {
            term: 'Kharif',
            category: 'Season',
            definition: 'Monsoon season crops sown from June-July and harvested in September-October. Examples: Rice, Cotton, Soybean.',
            hindiTerm: 'खरीफ'
        },
        {
            term: 'Rabi',
            category: 'Season',
            definition: 'Winter season crops sown from October-December and harvested in March-April. Examples: Wheat, Mustard, Gram.',
            hindiTerm: 'रबी'
        },
        {
            term: 'NPK Ratio',
            category: 'Fertilizer',
            definition: 'The ratio of Nitrogen (N), Phosphorus (P), and Potassium (K) in fertilizer. Example: 19:19:19 means equal parts of each nutrient.',
            hindiTerm: 'एनपीके अनुपात'
        },
        {
            term: 'Integrated Pest Management (IPM)',
            category: 'Pest Control',
            definition: 'A holistic approach to pest control using biological, cultural, and chemical methods to minimize crop damage and environmental impact.',
            hindiTerm: 'एकीकृत कीट प्रबंधन'
        },
        {
            term: 'Minimum Support Price (MSP)',
            category: 'Policy',
            definition: 'Government-guaranteed minimum price for agricultural commodities to protect farmers from price fluctuations.',
            hindiTerm: 'न्यूनतम समर्थन मूल्य'
        },
        {
            term: 'Soil pH',
            category: 'Soil',
            definition: 'Measure of soil acidity or alkalinity. Most crops grow best in soil with pH 6-7. Below 6 is acidic, above 7 is alkaline.',
            hindiTerm: 'मृदा पीएच'
        },
        {
            term: 'Drip Irrigation',
            category: 'Water',
            definition: 'Efficient irrigation method that delivers water directly to plant roots, reducing water waste by 30-50%.',
            hindiTerm: 'ड्रिप सिंचाई'
        },
        {
            term: 'Crop Rotation',
            category: 'Practice',
            definition: 'Growing different crops in sequence on the same land to improve soil health and reduce pest buildup.',
            hindiTerm: 'फसल चक्र'
        },
        {
            term: 'Organic Farming',
            category: 'Method',
            definition: 'Farming without synthetic chemicals, using natural fertilizers and pest control methods. Certified organic products fetch premium prices.',
            hindiTerm: 'जैविक खेती'
        },
        {
            term: 'Solar Irradiance',
            category: 'Energy',
            definition: 'Amount of solar energy received per unit area. Measured in kWh/m²/day. Higher values mean better solar energy potential.',
            hindiTerm: 'सौर विकिरण'
        },
        {
            term: 'Windspeed',
            category: 'Energy',
            definition: 'Speed of wind measured in meters per second (m/s). Wind speeds above 3 m/s are suitable for small wind turbines.',
            hindiTerm: 'पवन गति'
        }
    ];

    const filteredTerms = terms.filter(term =>
        term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        term.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const categories = [...new Set(terms.map(t => t.category))];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Book className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">AI Terms Glossary</h1>
                    <p className="text-xl text-gray-600 mb-8">Understand agricultural and technical terms used in Kisan Saathi</p>
                    
                    <div className="max-w-2xl mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search terms..."
                                className="pl-12 h-14 rounded-2xl border-2 text-lg"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-8 flex-wrap justify-center">
                    {categories.map((cat, idx) => (
                        <Badge key={idx} variant="outline" className="px-4 py-2 cursor-pointer hover:bg-gray-100">
                            {cat}
                        </Badge>
                    ))}
                </div>

                <div className="space-y-4">
                    {filteredTerms.map((term, idx) => (
                        <Card key={idx} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">{term.term}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{term.hindiTerm}</p>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700 border-0">
                                        {term.category}
                                    </Badge>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{term.definition}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredTerms.length === 0 && (
                    <Card className="border-0 shadow-lg">
                        <CardContent className="p-12 text-center">
                            <p className="text-gray-500 text-lg">No terms found matching "{searchQuery}"</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

