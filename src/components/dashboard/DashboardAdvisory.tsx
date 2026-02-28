import React, { useState, useEffect } from 'react';
import { Leaf, Calendar, Loader2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { appClient } from '@/api/appClient';
import dayjs from 'dayjs';
import TextToSpeech from '../TextToSpeech';

export default function DashboardAdvisory({ crops, state, language }) {
    const [advisories, setAdvisories] = useState([]);
    const [loading, setLoading] = useState(true);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'फसल सलाह', en: 'Crop Advisory' },
        thisMonth: { hi: 'इस महीने के लिए', en: 'For this month' }
    };

    useEffect(() => {
        if (crops?.length > 0) fetchAdvisories();
    }, [crops, state]);

    const fetchAdvisories = async () => {
        setLoading(true);
        try {
            const results = [];
            const currentMonth = dayjs().format('MMMM');
            
            for (const crop of crops.slice(0, 2)) {
                const res = await appClient.functions.invoke('getCropCalendar', { 
                    crop, 
                    state,
                    month: currentMonth 
                });
                if (res.data.data) {
                    results.push({ crop, ...res.data.data });
                }
            }
            setAdvisories(results);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getActivityColor = (type) => {
        const colors = {
            sowing: 'bg-emerald-100 text-emerald-700 border-emerald-200',
            irrigation: 'bg-blue-100 text-blue-700 border-blue-200',
            fertilizer: 'bg-amber-100 text-amber-700 border-amber-200',
            pest_control: 'bg-red-100 text-red-700 border-red-200',
            harvesting: 'bg-purple-100 text-purple-700 border-purple-200'
        };
        return colors[type] || 'bg-gray-100 text-gray-700 border-gray-200';
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <Leaf className="w-5 h-5 text-emerald-500" />
                            {getText(content.title)}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="w-3 h-3" />
                            {getText(content.thisMonth)}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {advisories.map((advisory, idx) => (
                        <div key={idx} className="space-y-2">
                            <h4 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                {language === 'hi' ? advisory.crop_name_hi : advisory.crop}
                            </h4>
                            
                            {advisory.activities?.slice(0, 3).map((activity, aIdx) => (
                                <div 
                                    key={aIdx} 
                                    className={`p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">
                                                {language === 'hi' ? activity.title_hi : activity.title_en}
                                            </p>
                                            <p className="text-xs mt-1 opacity-80">
                                                {language === 'hi' ? activity.description_hi : activity.description_en}
                                            </p>
                                        </div>
                                        <TextToSpeech 
                                            text={`${language === 'hi' ? activity.title_hi : activity.title_en}. ${language === 'hi' ? activity.description_hi : activity.description_en}`}
                                            language={language}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {advisories.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                        {language === 'hi' ? 'कोई सलाह नहीं मिली' : 'No advisories found'}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}


