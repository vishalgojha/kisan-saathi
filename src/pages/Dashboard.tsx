import React, { useState, useEffect, useRef } from 'react';
import { Sprout, Settings, Loader2, MapPin, Wheat, MessageCircle, Bell, Bot } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { appClient } from '@/api/appClient';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';

import WeatherForecast from '../components/WeatherForecast';
import GovtSchemes from '../components/GovtSchemes';
import DashboardAdvisory from '../components/dashboard/DashboardAdvisory';
import DashboardNutrient from '../components/dashboard/DashboardNutrient';
import DashboardEnergy from '../components/dashboard/DashboardEnergy';
import ProfileSetup from '../components/dashboard/ProfileSetup';
import NotificationCenter from '../components/dashboard/NotificationCenter';
import NotificationSettings from '../components/dashboard/NotificationSettings';
import DiseaseDiagnosis from '../components/DiseaseDiagnosis';
import MarketPrices from '../components/MarketPrices';
import CropRecommendation from '../components/CropRecommendation';

function DashboardContent() {
    const { language } = useLanguage();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotificationSettings, setShowNotificationSettings] = useState(false);
    const dashboardRef = useRef(null);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'मेरा डैशबोर्ड', en: 'My Dashboard' },
        welcome: { hi: 'नमस्ते', en: 'Hello' },
        location: { hi: 'स्थान', en: 'Location' },
        crops: { hi: 'फसलें', en: 'Crops' },
        edit: { hi: 'बदलें', en: 'Edit' },
        whatsapp: { hi: 'व्हाट्सएप पर पूछें', en: 'Ask on WhatsApp' },
        notificationSettings: { hi: 'सूचना सेटिंग्स', en: 'Notification Settings' },
        aiChatTitle: { hi: 'AI कृषि चैट', en: 'AI Advisory Chat' },
        aiChatDesc: {
            hi: 'रोग, मंडी भाव, मौसम और योजनाओं पर बातचीत करें',
            en: 'Chat for disease, mandi prices, weather, and schemes'
        },
        aiChatButton: { hi: 'चैट शुरू करें', en: 'Start Chat' }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    // Check for alerts when profile loads
    useEffect(() => {
        if (profile?.id) {
            checkForAlerts();
        }
    }, [profile?.id]);

    const checkForAlerts = async () => {
        try {
            await appClient.functions.invoke('checkAlerts', {
                profile_id: profile.id,
                check_type: 'all'
            });
        } catch (err) {
            console.error('Failed to check alerts:', err);
        }
    };

    useEffect(() => {
        if (profile && dashboardRef.current) {
            gsap.from('.dashboard-card', {
                y: 40,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }, [profile]);

    const loadProfile = async () => {
        setLoading(true);
        try {
            const isAuth = await appClient.auth.isAuthenticated();
            if (!isAuth) {
                setLoading(false);
                appClient.auth.redirectToLogin(window.location.href);
                return;
            }
            const profiles = await appClient.entities.FarmerProfile.list();
            if (profiles.length > 0) {
                setProfile(profiles[0]);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const saveProfile = async (data) => {
        try {
            if (profile?.id) {
                await appClient.entities.FarmerProfile.update(profile.id, data);
            } else {
                await appClient.entities.FarmerProfile.create(data);
            }
            await loadProfile();
            setShowSettings(false);
        } catch (err) {
            console.error(err);
        }
    };

    const saveNotificationPreferences = async (prefs) => {
        if (!profile) return;
        await appClient.entities.FarmerProfile.update(profile.id, { notification_preferences: prefs });
        setProfile(prev => ({ ...prev, notification_preferences: prefs }));
        setShowNotificationSettings(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link to={createPageUrl('Home')} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                                <Sprout className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">{getText(content.title)}</h1>
                        </Link>
                        <div className="flex items-center gap-2 md:gap-3">
                            {profile && <NotificationCenter language={language} />}
                            <LanguageToggle />
                            {profile && (
                                <>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => setShowNotificationSettings(true)}
                                        className="rounded-xl hidden md:flex"
                                        title={getText(content.notificationSettings)}
                                    >
                                        <Bell className="w-5 h-5" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => setShowSettings(true)}
                                        className="rounded-xl"
                                    >
                                        <Settings className="w-5 h-5" />
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <ProfileSetup 
                            onSave={saveProfile} 
                            language={language}
                        />
                        <div className="p-4 border-t">
                            <Button variant="outline" onClick={() => setShowSettings(false)} className="w-full rounded-xl">
                                {language === 'hi' ? 'बंद करें' : 'Cancel'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Notification Settings Modal */}
            {showNotificationSettings && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="max-w-lg w-full">
                        <NotificationSettings 
                            preferences={profile?.notification_preferences}
                            onSave={saveNotificationPreferences}
                            language={language}
                        />
                        <Button 
                            variant="outline" 
                            onClick={() => setShowNotificationSettings(false)} 
                            className="w-full mt-3 rounded-xl bg-white"
                        >
                            {language === 'hi' ? 'बंद करें' : 'Cancel'}
                        </Button>
                    </div>
                </div>
            )}

            <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
                {profile ? (
                    <div ref={dashboardRef}>
                        {/* Profile Summary */}
                        <Card className="dashboard-card border-0 shadow-lg mb-6 overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <p className="text-emerald-100">{getText(content.welcome)}! 👋</p>
                                        <div className="flex items-center gap-3 mt-2">
                                            <MapPin className="w-5 h-5" />
                                            <span className="text-lg font-semibold">{profile.location}, {profile.state}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.crops?.map(crop => (
                                            <Badge key={crop} className="bg-white/20 text-white border-0 px-3 py-1">
                                                <Wheat className="w-3 h-3 mr-1" />
                                                {crop}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Dashboard Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {/* Weather */}
                            <div className="dashboard-card md:col-span-2 lg:col-span-3">
                                <WeatherForecast defaultLocation={`${profile.location}, ${profile.state}`} />
                            </div>

                            {/* Market Prices */}
                            <div
                                id="market-prices"
                                data-testid="dashboard-market-prices"
                                className="dashboard-card md:col-span-2 lg:col-span-2 scroll-mt-24"
                            >
                                <MarketPrices
                                    crops={profile.crops}
                                    defaultState={profile.state}
                                />
                            </div>

                            {/* Energy Potential */}
                            <div className="dashboard-card">
                                <DashboardEnergy 
                                    location={profile.location}
                                    state={profile.state}
                                    language={language}
                                />
                            </div>

                            {/* Nutrient Tips */}
                            <div className="dashboard-card">
                                <DashboardNutrient 
                                    crops={profile.crops}
                                    state={profile.state}
                                    language={language}
                                />
                            </div>

                            {/* Schemes */}
                            <div className="dashboard-card md:col-span-2 lg:col-span-2">
                                <GovtSchemes
                                    defaultState={profile.state}
                                    crops={profile.crops}
                                />
                            </div>

                            {/* Crop Recommendation */}
                            <div className="dashboard-card md:col-span-2 lg:col-span-2">
                                <CropRecommendation defaultState={profile.state} />
                            </div>

                            {/* Advisory */}
                            <div className="dashboard-card md:col-span-2 lg:col-span-2">
                                <DashboardAdvisory 
                                    crops={profile.crops}
                                    state={profile.state}
                                    language={language}
                                />
                            </div>

                            {/* Disease Diagnosis */}
                            <div
                                id="disease-diagnosis"
                                data-testid="dashboard-disease-diagnosis"
                                className="dashboard-card md:col-span-2 lg:col-span-2 scroll-mt-24"
                            >
                                <DiseaseDiagnosis crops={profile.crops} />
                            </div>

                            {/* WhatsApp CTA */}
                            <Card className="dashboard-card border-0 shadow-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
                                <CardContent className="p-5 text-center">
                                    <Bot className="w-8 h-8 mx-auto mb-2" />
                                    <h3 className="font-bold mb-2">{getText(content.aiChatTitle)}</h3>
                                    <p className="text-sm text-emerald-100 mb-4">
                                        {getText(content.aiChatDesc)}
                                    </p>
                                    <Link to={createPageUrl('AIHelp')}>
                                        <Button className="bg-white text-emerald-700 hover:bg-gray-100 rounded-xl w-full">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            {getText(content.aiChatButton)}
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>

                            {/* WhatsApp CTA */}
                            <Card className="dashboard-card border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                                <CardContent className="p-5 text-center">
                                    <MessageCircle className="w-8 h-8 mx-auto mb-2" />
                                    <h3 className="font-bold mb-2">{getText(content.whatsapp)}</h3>
                                    <a 
                                        href={appClient.agents.getWhatsAppConnectURL('KisanSaathi')} 
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Button className="bg-white text-emerald-600 hover:bg-gray-100 rounded-xl w-full">
                                            <MessageCircle className="w-4 h-4 mr-2" />
                                            WhatsApp
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <ProfileSetup onSave={saveProfile} language={language} />
                )}
            </main>
        </div>
    );
}

export default function Dashboard() {
    return (
        <LanguageProvider>
            <DashboardContent />
        </LanguageProvider>
    );
}


