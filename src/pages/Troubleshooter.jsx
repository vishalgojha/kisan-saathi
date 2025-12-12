import React, { useState } from 'react';
import { Wrench, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function Troubleshooter() {
    const [selectedIssue, setSelectedIssue] = useState(null);

    const issues = [
        {
            title: 'WhatsApp Not Connecting',
            severity: 'high',
            symptoms: ['Messages not sending', 'Connection timeout', 'QR code not working'],
            solutions: [
                'Check your internet connection and try again',
                'Make sure you\'re using the latest version of WhatsApp',
                'Clear WhatsApp cache: Settings → Storage → Clear Cache',
                'Restart your phone and try connecting again',
                'If issue persists, contact support with your phone number'
            ]
        },
        {
            title: 'Crop Diagnosis Not Working',
            severity: 'medium',
            symptoms: ['Image upload fails', 'Slow diagnosis', 'Incorrect results'],
            solutions: [
                'Ensure your image is clear and well-lit',
                'Take photos during daytime with good lighting',
                'Make sure the diseased part is clearly visible and in focus',
                'Image size should be under 5MB',
                'Try taking multiple photos from different angles'
            ]
        },
        {
            title: 'No Mandi Prices Showing',
            severity: 'medium',
            symptoms: ['Empty price list', 'Old prices', 'Missing mandis'],
            solutions: [
                'Check if you\'ve selected your state and crops in profile',
                'Refresh the page to load latest prices',
                'Some mandis may not have data on weekends/holidays',
                'Try selecting different nearby mandis',
                'Price data updates daily at 9 AM'
            ]
        },
        {
            title: 'Weather Forecast Inaccurate',
            severity: 'low',
            symptoms: ['Wrong location', 'Old forecast', 'Incorrect predictions'],
            solutions: [
                'Verify your location is set correctly in profile',
                'Weather updates every 6 hours - check timestamp',
                'Forecasts are predictions and may vary by 10-20%',
                'For critical decisions, cross-check with local meteorological dept',
                'Report consistently wrong forecasts to support'
            ]
        },
        {
            title: 'Profile Changes Not Saving',
            severity: 'high',
            symptoms: ['Changes revert', 'Save button not working', 'Data lost'],
            solutions: [
                'Check your internet connection before saving',
                'Don\'t close the page immediately after clicking Save',
                'Clear browser cache and cookies',
                'Try using a different browser (Chrome recommended)',
                'If problem persists, screenshot your settings and contact support'
            ]
        },
        {
            title: 'Notifications Not Received',
            severity: 'medium',
            symptoms: ['No alerts', 'Delayed notifications', 'Missing price alerts'],
            solutions: [
                'Check notification settings in your profile',
                'Enable browser notifications when prompted',
                'Verify email address is correct in profile',
                'Check spam/junk folder for email notifications',
                'For WhatsApp alerts, ensure bot is not blocked'
            ]
        }
    ];

    const getSeverityColor = (severity) => {
        return {
            high: 'bg-red-100 text-red-700 border-red-200',
            medium: 'bg-amber-100 text-amber-700 border-amber-200',
            low: 'bg-blue-100 text-blue-700 border-blue-200'
        }[severity];
    };

    const getSeverityIcon = (severity) => {
        return {
            high: XCircle,
            medium: AlertCircle,
            low: AlertCircle
        }[severity];
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
            <div className="container mx-auto px-6 max-w-5xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Wrench className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Smart Troubleshooter</h1>
                    <p className="text-xl text-gray-600">AI-powered solutions to common issues</p>
                </div>

                <div className="space-y-4">
                    {issues.map((issue, idx) => {
                        const isSelected = selectedIssue === idx;
                        const SeverityIcon = getSeverityIcon(issue.severity);

                        return (
                            <Card key={idx} className="border-0 shadow-lg">
                                <CardContent className="p-6">
                                    <button
                                        onClick={() => setSelectedIssue(isSelected ? null : idx)}
                                        className="w-full text-left"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getSeverityColor(issue.severity)} border`}>
                                                    <SeverityIcon className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">{issue.title}</h3>
                                            </div>
                                            <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                                {issue.severity.toUpperCase()}
                                            </Badge>
                                        </div>
                                        
                                        {!isSelected && (
                                            <div className="flex gap-2 flex-wrap ml-13">
                                                {issue.symptoms.map((symptom, sIdx) => (
                                                    <span key={sIdx} className="text-xs text-gray-500">
                                                        • {symptom}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </button>

                                    {isSelected && (
                                        <div className="mt-6 pt-6 border-t border-gray-100">
                                            <h4 className="font-semibold text-gray-900 mb-3">Common Symptoms:</h4>
                                            <ul className="space-y-1 mb-6">
                                                {issue.symptoms.map((symptom, sIdx) => (
                                                    <li key={sIdx} className="text-gray-600 flex items-start gap-2">
                                                        <span className="text-gray-400 mt-1">•</span>
                                                        {symptom}
                                                    </li>
                                                ))}
                                            </ul>

                                            <h4 className="font-semibold text-gray-900 mb-3">Solutions:</h4>
                                            <div className="space-y-3">
                                                {issue.solutions.map((solution, solIdx) => (
                                                    <div key={solIdx} className="flex items-start gap-3 bg-green-50 p-4 rounded-xl border border-green-100">
                                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                        <p className="text-gray-700">{solution}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Card className="mt-12 border-0 shadow-xl bg-gradient-to-r from-orange-600 to-red-600 text-white">
                    <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold mb-3">Still Need Help?</h2>
                        <p className="text-orange-100 mb-4">
                            Our support team is here to assist you. Contact us via WhatsApp or email.
                        </p>
                        <div className="flex gap-3 justify-center flex-wrap">
                            <Button className="bg-white text-orange-600 hover:bg-gray-100 rounded-xl">
                                WhatsApp Support
                            </Button>
                            <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-xl">
                                Email Us
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}