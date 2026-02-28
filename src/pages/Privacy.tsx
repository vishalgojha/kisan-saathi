import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Shield className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
                    <p className="text-gray-600">Last updated: December 12, 2025</p>
                </div>

                <Card className="border-0 shadow-xl mb-8">
                    <CardContent className="p-8 prose prose-gray max-w-none">
                        <h2>1. Information We Collect</h2>
                        <p>We collect information you provide directly to us when using Kisan Saathi:</p>
                        <ul>
                            <li><strong>Profile Information:</strong> Name, location, crops grown, contact details</li>
                            <li><strong>Usage Data:</strong> Queries submitted, features used, time spent on platform</li>
                            <li><strong>Images:</strong> Crop photos uploaded for disease diagnosis</li>
                            <li><strong>Device Information:</strong> Browser type, IP address, operating system</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>Your information helps us provide and improve Kisan Saathi:</p>
                        <ul>
                            <li>Provide personalized crop advice and recommendations</li>
                            <li>Process and respond to your queries via AI and WhatsApp</li>
                            <li>Send relevant notifications about weather, prices, and schemes</li>
                            <li>Improve our AI models and service quality</li>
                            <li>Analyze usage patterns to enhance user experience</li>
                        </ul>

                        <h2>3. Data Sharing and Disclosure</h2>
                        <p>We do NOT sell your personal data. We may share information with:</p>
                        <ul>
                            <li><strong>AI Service Providers:</strong> For processing queries and generating responses</li>
                            <li><strong>Analytics Partners:</strong> For anonymized usage statistics</li>
                            <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
                        </ul>

                        <h2>4. Data Security</h2>
                        <p>We implement industry-standard security measures:</p>
                        <ul>
                            <li>Encrypted data transmission (HTTPS/SSL)</li>
                            <li>Secure cloud storage with access controls</li>
                            <li>Regular security audits and updates</li>
                            <li>Limited employee access to personal data</li>
                        </ul>

                        <h2>5. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access and download your personal data</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your account and data</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Withdraw consent for data processing</li>
                        </ul>

                        <h2>6. Data Retention</h2>
                        <p>We retain your data for as long as your account is active or as needed to provide services. 
                        After account deletion, we may retain anonymized data for analytics and legal compliance.</p>

                        <h2>7. Children's Privacy</h2>
                        <p>Kisan Saathi is intended for users 18 years and older. We do not knowingly collect 
                        information from children under 18.</p>

                        <h2>8. Changes to This Policy</h2>
                        <p>We may update this privacy policy periodically. Significant changes will be notified 
                        via email or platform notification.</p>

                        <h2>9. Contact Us</h2>
                        <p>For privacy concerns or questions, contact us at:</p>
                        <ul>
                            <li>Email: privacy@chaoscraftlabs.com</li>
                            <li>Website: www.chaoscraftlabs.com</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

