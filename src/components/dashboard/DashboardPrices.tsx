import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Minus, Loader2, Star, StarOff } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function DashboardPrices({ crops, state, favoriteMandis, onToggleFavorite, language }) {
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(true);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'मंडी भाव', en: 'Mandi Prices' },
        viewAll: { hi: 'सभी देखें', en: 'View All' },
        perQuintal: { hi: 'रु/क्विं', en: 'Rs/Q' }
    };

    useEffect(() => {
        if (crops?.length > 0) fetchPrices();
    }, [crops, state]);

    const fetchPrices = async () => {
        setLoading(true);
        try {
            const results = [];
            for (const crop of crops.slice(0, 3)) {
                const res = await appClient.functions.invoke('getMandiPrices', { crop, state });
                if (res.data.data?.prices) {
                    results.push(...res.data.data.prices.slice(0, 2).map(p => ({ ...p, crop })));
                }
            }
            setPrices(results.slice(0, 6));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend) => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-600" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
        return <Minus className="w-4 h-4 text-gray-400" />;
    };

    if (loading) {
        return (
            <Card className="border-0 shadow-lg">
                <CardContent className="p-6 flex items-center justify-center h-48">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-amber-500" />
                        {getText(content.title)}
                    </h3>
                    <Link to={createPageUrl('MandiPrices')}>
                        <Button variant="ghost" size="sm" className="text-amber-600 hover:text-amber-700">
                            {getText(content.viewAll)}
                        </Button>
                    </Link>
                </div>

                <div className="space-y-3">
                    {prices.map((price, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-amber-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={() => onToggleFavorite(price.mandi)}
                                    className="text-amber-500 hover:scale-110 transition-transform"
                                >
                                    {favoriteMandis?.includes(price.mandi) 
                                        ? <Star className="w-4 h-4 fill-amber-500" /> 
                                        : <StarOff className="w-4 h-4" />}
                                </button>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm">{price.crop}</p>
                                    <p className="text-xs text-gray-500">{price.mandi}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-amber-600">₹{price.modal_price?.toLocaleString()}</span>
                                {getTrendIcon(price.trend)}
                            </div>
                        </div>
                    ))}
                </div>

                {prices.length === 0 && (
                    <p className="text-center text-gray-500 py-4">
                        {language === 'hi' ? 'कोई भाव नहीं मिला' : 'No prices found'}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}


