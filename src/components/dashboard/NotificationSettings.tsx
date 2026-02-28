import React, { useState } from 'react';
import { Bell, CloudRain, TrendingUp, BookOpen, Save, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export default function NotificationSettings({ preferences, onSave, language }) {
    const [settings, setSettings] = useState(preferences || {
        weather_alerts: true,
        price_alerts: true,
        scheme_updates: true,
        price_threshold_percent: 5
    });
    const [saving, setSaving] = useState(false);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'सूचना सेटिंग्स', en: 'Notification Settings' },
        weatherAlerts: { hi: 'मौसम अलर्ट', en: 'Weather Alerts' },
        weatherDesc: { hi: 'भारी बारिश, पाला, तूफान की चेतावनी', en: 'Heavy rain, frost, storm warnings' },
        priceAlerts: { hi: 'भाव अलर्ट', en: 'Price Alerts' },
        priceDesc: { hi: 'पसंदीदा मंडियों में भाव बदलाव', en: 'Price changes in favorite mandis' },
        schemeUpdates: { hi: 'योजना अपडेट', en: 'Scheme Updates' },
        schemeDesc: { hi: 'सेव की गई योजनाओं में बदलाव', en: 'Updates to saved schemes' },
        priceThreshold: { hi: 'भाव बदलाव सीमा', en: 'Price Change Threshold' },
        priceThresholdDesc: { hi: 'इतने % बदलाव पर सूचना दें', en: 'Notify when price changes by' },
        save: { hi: 'सेटिंग्स सेव करें', en: 'Save Settings' }
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(settings);
        setSaving(false);
    };

    const settingItems = [
        {
            key: 'weather_alerts',
            icon: CloudRain,
            title: content.weatherAlerts,
            desc: content.weatherDesc,
            color: 'text-blue-500',
            bgColor: 'bg-blue-100'
        },
        {
            key: 'price_alerts',
            icon: TrendingUp,
            title: content.priceAlerts,
            desc: content.priceDesc,
            color: 'text-amber-500',
            bgColor: 'bg-amber-100'
        },
        {
            key: 'scheme_updates',
            icon: BookOpen,
            title: content.schemeUpdates,
            desc: content.schemeDesc,
            color: 'text-violet-500',
            bgColor: 'bg-violet-100'
        }
    ];

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <Bell className="w-5 h-5 text-gray-600" />
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg">{getText(content.title)}</h3>
                </div>

                <div className="space-y-4">
                    {settingItems.map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                                    <item.icon className={`w-5 h-5 ${item.color}`} />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{getText(item.title)}</p>
                                    <p className="text-xs text-gray-500">{getText(item.desc)}</p>
                                </div>
                            </div>
                            <Switch
                                checked={settings[item.key]}
                                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, [item.key]: checked }))}
                            />
                        </div>
                    ))}

                    {/* Price Threshold Slider */}
                    {settings.price_alerts && (
                        <div className="p-4 bg-amber-50 rounded-xl">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="font-medium text-gray-900">{getText(content.priceThreshold)}</p>
                                    <p className="text-xs text-gray-500">{getText(content.priceThresholdDesc)}</p>
                                </div>
                                <span className="text-xl font-bold text-amber-600">{settings.price_threshold_percent}%</span>
                            </div>
                            <Slider
                                value={[settings.price_threshold_percent]}
                                onValueChange={([val]) => setSettings(prev => ({ ...prev, price_threshold_percent: val }))}
                                min={1}
                                max={20}
                                step={1}
                                className="mt-2"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>1%</span>
                                <span>20%</span>
                            </div>
                        </div>
                    )}
                </div>

                <Button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full mt-6 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl"
                >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                    {getText(content.save)}
                </Button>
            </CardContent>
        </Card>
    );
}

