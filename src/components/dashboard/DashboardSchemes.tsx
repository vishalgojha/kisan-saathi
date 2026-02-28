import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2, Star, StarOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DashboardSchemes({ state, crops, favoriteSchemes, onToggleFavorite, language }) {
    const [schemes, setSchemes] = useState([]);
    const [loading, setLoading] = useState(true);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'सरकारी योजनाएं', en: 'Govt Schemes' },
        viewAll: { hi: 'सभी देखें', en: 'View All' }
    };

    useEffect(() => {
        if (state) fetchSchemes();
    }, [state, crops]);

    const fetchSchemes = async () => {
        setLoading(true);
        try {
            const res = await appClient.functions.invoke('getGovtSchemes', { 
                state, 
                crop: crops?.[0] 
            });
            setSchemes(res.data.data?.schemes?.slice(0, 3) || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getCategoryColor = (type) => {
        const colors = {
            subsidy: 'bg-emerald-100 text-emerald-700',
            loan: 'bg-blue-100 text-blue-700',
            insurance: 'bg-purple-100 text-purple-700'
        };
        return colors[type?.toLowerCase()] || 'bg-gray-100 text-gray-700';
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-violet-500" />
                        {getText(content.title)}
                    </h3>
                    <Link to={createPageUrl('GovtSchemes')}>
                        <Button variant="ghost" size="sm" className="text-violet-600 hover:text-violet-700">
                            {getText(content.viewAll)}
                        </Button>
                    </Link>
                </div>

                <div className="space-y-3">
                    {schemes.map((scheme, idx) => (
                        <div key={idx} className="p-3 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className={`text-xs ${getCategoryColor(scheme.type)}`}>
                                            {scheme.type}
                                        </Badge>
                                        <button 
                                            onClick={() => onToggleFavorite(scheme.name_en)}
                                            className="text-violet-500 hover:scale-110 transition-transform"
                                        >
                                            {favoriteSchemes?.includes(scheme.name_en) 
                                                ? <Star className="w-4 h-4 fill-violet-500" /> 
                                                : <StarOff className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    <h4 className="font-medium text-gray-900 text-sm">
                                        {language === 'hi' ? scheme.name_hi : scheme.name_en}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                        {language === 'hi' ? scheme.benefit_hi : scheme.benefit_en}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {schemes.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                        {language === 'hi' ? 'कोई योजना नहीं मिली' : 'No schemes found'}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}


