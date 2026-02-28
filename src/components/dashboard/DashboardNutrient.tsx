import React, { useState, useEffect } from 'react';
import { Leaf, Loader2, Sparkles, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DashboardNutrient({ crops, state, language }) {
    const [nutrientData, setNutrientData] = useState(null);
    const [loading, setLoading] = useState(true);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'पोषक तत्व सलाह', en: 'Nutrient Recommendations' },
        loading: { hi: 'लोड हो रहा है...', en: 'Loading...' },
        noData: { hi: 'कोई डेटा नहीं', en: 'No data available' },
        viewMore: { hi: 'अधिक देखें', en: 'View More' }
    };

    useEffect(() => {
        if (crops?.length > 0) {
            fetchNutrientTips();
        } else {
            setLoading(false);
        }
    }, [crops?.join(',')]);

    const fetchNutrientTips = async () => {
        setLoading(true);
        try {
            const response = await appClient.integrations.Core.InvokeLLM({
                prompt: `Provide nutrient and fertilizer recommendations for these crops in ${state}, India: ${crops.slice(0, 2).join(', ')}

Include:
- NPK ratio needed for current season
- Micro-nutrients required
- Application timing
- Organic alternatives

Keep it brief and actionable. Return for current growth stage only.`,
                response_json_schema: {
                    type: "object",
                    properties: {
                        recommendations: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    crop: { type: "string" },
                                    npk_ratio: { type: "string" },
                                    stage: { type: "string" },
                                    tips_en: { type: "string" },
                                    tips_hi: { type: "string" },
                                    organic_option_en: { type: "string" },
                                    organic_option_hi: { type: "string" }
                                }
                            }
                        }
                    }
                }
            });
            setNutrientData(response);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 h-full">
            <CardContent className="p-4 md:p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                            <Leaf className="w-4 h-4 text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 text-sm md:text-base">{getText(content.title)}</h3>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={fetchNutrientTips}
                        disabled={loading}
                        className="h-7 text-xs"
                    >
                        {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
                    </Button>
                </div>

                {loading ? (
                    <div className="text-center py-6">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-green-600 mb-2" />
                        <p className="text-xs text-gray-500">{getText(content.loading)}</p>
                    </div>
                ) : nutrientData?.recommendations?.length > 0 ? (
                    <div className="space-y-3">
                        {nutrientData.recommendations.slice(0, 2).map((rec, idx) => (
                            <div key={idx} className="bg-white rounded-xl p-3 border border-green-100">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 text-sm">{rec.crop}</h4>
                                        <p className="text-xs text-gray-500">{rec.stage}</p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                        NPK: {rec.npk_ratio}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                                    {language === 'hi' ? rec.tips_hi : rec.tips_en}
                                </p>
                                <div className="flex items-start gap-1.5 bg-green-50 rounded-lg p-2">
                                    <Sparkles className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-gray-700">
                                        <span className="font-medium">{language === 'hi' ? 'जैविक:' : 'Organic:'}</span>{' '}
                                        {language === 'hi' ? rec.organic_option_hi : rec.organic_option_en}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 text-center py-6">{getText(content.noData)}</p>
                )}
            </CardContent>
        </Card>
    );
}


