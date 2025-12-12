import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Terms() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                    <p className="text-gray-600">Last updated: December 12, 2025</p>
                </div>

                <Card className="border-0 shadow-xl">
                    <CardContent className="p-8 prose prose-gray max-w-none">
                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using Kisan Saathi ("Service"), you agree to be bound by these Terms of Service. 
                        If you do not agree, please discontinue use immediately.</p>

                        <h2>2. Service Description</h2>
                        <p>Kisan Saathi is an AI-powered agricultural advisory platform providing:</p>
                        <ul>
                            <li>Crop disease diagnosis and treatment recommendations</li>
                            <li>Real-time mandi price information</li>
                            <li>Weather forecasts and farming advisories</li>
                            <li>Government scheme information</li>
                            <li>WhatsApp-based query assistance</li>
                        </ul>

                        <h2>3. User Responsibilities</h2>
                        <p>You agree to:</p>
                        <ul>
                            <li>Provide accurate and up-to-date profile information</li>
                            <li>Use the Service only for lawful agricultural purposes</li>
                            <li>Not misuse or attempt to hack the platform</li>
                            <li>Not share your account credentials with others</li>
                            <li>Respect intellectual property rights</li>
                        </ul>

                        <h2>4. AI Advice Disclaimer</h2>
                        <p><strong>IMPORTANT:</strong> Kisan Saathi uses AI to provide farming advice. While we strive for accuracy:</p>
                        <ul>
                            <li>AI recommendations are suggestions, not guarantees</li>
                            <li>Always consult local agricultural experts for critical decisions</li>
                            <li>We are not liable for crop losses or financial damages</li>
                            <li>Disease diagnosis accuracy is approximately 90% for common issues</li>
                        </ul>

                        <h2>5. Pricing Information</h2>
                        <p>Mandi prices are provided for informational purposes:</p>
                        <ul>
                            <li>Prices may vary from actual market rates</li>
                            <li>Data is sourced from public APIs and may have delays</li>
                            <li>We are not responsible for trading decisions based on our data</li>
                        </ul>

                        <h2>6. Intellectual Property</h2>
                        <p>All content, features, and functionality of Kisan Saathi are owned by Chaos Craft Labs and protected 
                        by copyright, trademark, and other intellectual property laws.</p>

                        <h2>7. Prohibited Activities</h2>
                        <p>You may NOT:</p>
                        <ul>
                            <li>Scrape or extract data systematically</li>
                            <li>Reverse engineer our AI models</li>
                            <li>Use the Service for commercial resale</li>
                            <li>Upload malicious content or viruses</li>
                            <li>Impersonate others or provide false information</li>
                        </ul>

                        <h2>8. Service Availability</h2>
                        <p>We aim for 99.9% uptime but cannot guarantee uninterrupted service. We may suspend the Service 
                        for maintenance or updates without prior notice.</p>

                        <h2>9. Limitation of Liability</h2>
                        <p>To the maximum extent permitted by law, Chaos Craft Labs shall not be liable for:</p>
                        <ul>
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Loss of profits, crops, or business opportunities</li>
                            <li>Damages arising from third-party content or services</li>
                        </ul>

                        <h2>10. Indemnification</h2>
                        <p>You agree to indemnify Chaos Craft Labs from any claims arising from your use of the Service 
                        or violation of these Terms.</p>

                        <h2>11. Termination</h2>
                        <p>We may terminate or suspend your account at any time for violating these Terms. 
                        You may delete your account at any time through profile settings.</p>

                        <h2>12. Governing Law</h2>
                        <p>These Terms are governed by the laws of India. Disputes shall be resolved in courts of [City], India.</p>

                        <h2>13. Changes to Terms</h2>
                        <p>We may modify these Terms at any time. Continued use after changes constitutes acceptance.</p>

                        <h2>14. Contact</h2>
                        <p>For questions about these Terms, contact us at:</p>
                        <ul>
                            <li>Email: legal@chaoscraftlabs.com</li>
                            <li>Website: www.chaoscraftlabs.com</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}