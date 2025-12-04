import React, { useState, useEffect } from 'react';
import { Bell, X, CloudRain, TrendingUp, TrendingDown, BookOpen, Check, CheckCheck, Trash2, AlertTriangle, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { base44 } from '@/api/base44Client';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function NotificationCenter({ language }) {
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'सूचनाएं', en: 'Notifications' },
        markAllRead: { hi: 'सभी पढ़ा', en: 'Mark all read' },
        noNotifications: { hi: 'कोई नई सूचना नहीं', en: 'No new notifications' },
        clearAll: { hi: 'सभी हटाएं', en: 'Clear all' }
    };

    useEffect(() => {
        loadNotifications();
        const interval = setInterval(loadNotifications, 30000); // Poll every 30 seconds
        return () => clearInterval(interval);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await base44.entities.FarmerNotification.list('-created_date', 20);
            setNotifications(data);
        } catch (err) {
            console.error(err);
        }
    };

    const markAsRead = async (id) => {
        await base44.entities.FarmerNotification.update(id, { is_read: true });
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    };

    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.is_read);
        await Promise.all(unread.map(n => base44.entities.FarmerNotification.update(n.id, { is_read: true })));
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    };

    const deleteNotification = async (id) => {
        await base44.entities.FarmerNotification.delete(id);
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const clearAll = async () => {
        await Promise.all(notifications.map(n => base44.entities.FarmerNotification.delete(n.id)));
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getIcon = (type, severity) => {
        const iconClass = "w-5 h-5";
        if (type === 'weather_alert') {
            return severity === 'critical' 
                ? <AlertTriangle className={`${iconClass} text-red-500`} />
                : <CloudRain className={`${iconClass} text-blue-500`} />;
        }
        if (type === 'price_alert') {
            return <TrendingUp className={`${iconClass} text-amber-500`} />;
        }
        return <BookOpen className={`${iconClass} text-violet-500`} />;
    };

    const getSeverityStyle = (severity) => {
        const styles = {
            critical: 'border-l-4 border-l-red-500 bg-red-50',
            high: 'border-l-4 border-l-orange-500 bg-orange-50',
            medium: 'border-l-4 border-l-blue-500 bg-blue-50',
            low: 'border-l-4 border-l-gray-300 bg-gray-50'
        };
        return styles[severity] || styles.medium;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative rounded-xl">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 md:w-96 p-0" align="end">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">{getText(content.title)}</h3>
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7">
                                    <CheckCheck className="w-3 h-3 mr-1" />
                                    {getText(content.markAllRead)}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-80">
                    {notifications.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            <Bell className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                            <p>{getText(content.noNotifications)}</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div 
                                    key={notification.id} 
                                    className={`p-3 hover:bg-gray-50 transition-colors ${!notification.is_read ? 'bg-blue-50/50' : ''} ${getSeverityStyle(notification.severity)}`}
                                    onClick={() => !notification.is_read && markAsRead(notification.id)}
                                >
                                    <div className="flex gap-3">
                                        <div className="flex-shrink-0 mt-0.5">
                                            {getIcon(notification.type, notification.severity)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className={`text-sm font-medium text-gray-900 ${!notification.is_read ? 'font-semibold' : ''}`}>
                                                    {language === 'hi' ? notification.title_hi : notification.title_en}
                                                </p>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                {language === 'hi' ? notification.message_hi : notification.message_en}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-gray-400">
                                                    {dayjs(notification.created_date).fromNow()}
                                                </span>
                                                {notification.severity === 'critical' && (
                                                    <Badge className="text-xs bg-red-100 text-red-700 px-1.5 py-0">
                                                        {language === 'hi' ? 'अत्यावश्यक' : 'Critical'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {notifications.length > 0 && (
                    <div className="p-3 border-t border-gray-100">
                        <Button variant="ghost" size="sm" onClick={clearAll} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="w-4 h-4 mr-2" />
                            {getText(content.clearAll)}
                        </Button>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}