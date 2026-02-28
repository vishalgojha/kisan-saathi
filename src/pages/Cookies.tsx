import React from 'react';
import { Cookie } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Cookies() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Cookie className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
                    <p className="text-gray-600">Last updated: December 12, 2025</p>
                </div>

                <Card className="border-0 shadow-xl">
                    <CardContent className="p-8 prose prose-gray max-w-none">
                        <h2>1. What Are Cookies?</h2>
                        <p>Cookies are small text files stored on your device when you visit Kisan Saathi. 
                        They help us remember your preferences, improve your experience, and analyze how the platform is used.</p>

                        <h2>2. Types of Cookies We Use</h2>
                        
                        <h3>Essential Cookies (Always Active)</h3>
                        <p>These cookies are necessary for the platform to function:</p>
                        <ul>
                            <li><strong>Authentication:</strong> Keep you logged in between sessions</li>
                            <li><strong>Security:</strong> Protect against fraud and malicious activity</li>
                            <li><strong>Language Preference:</strong> Remember your Hindi/English choice</li>
                        </ul>

                        <h3>Functional Cookies</h3>
                        <p>These enhance your experience but are not critical:</p>
                        <ul>
                            <li><strong>Profile Settings:</strong> Remember your location, crops, and preferences</li>
                            <li><strong>Dashboard Layout:</strong> Save your customized dashboard view</li>
                            <li><strong>Notification Preferences:</strong> Store your alert settings</li>
                        </ul>

                        <h3>Analytics Cookies</h3>
                        <p>These help us understand how you use Kisan Saathi:</p>
                        <ul>
                            <li><strong>Usage Statistics:</strong> Pages visited, features used, time spent</li>
                            <li><strong>Performance Monitoring:</strong> Load times, errors, system health</li>
                            <li><strong>User Behavior:</strong> Click patterns, search queries (anonymized)</li>
                        </ul>

                        <h3>Third-Party Cookies</h3>
                        <p>We use services that may set their own cookies:</p>
                        <ul>
                            <li><strong>WhatsApp:</strong> For bot integration and messaging</li>
                            <li><strong>Google Analytics:</strong> For usage insights (if enabled)</li>
                            <li><strong>Weather APIs:</strong> For forecast caching</li>
                        </ul>

                        <h2>3. Why We Use Cookies</h2>
                        <ul>
                            <li><strong>Personalization:</strong> Show relevant crops, mandis, and advisories</li>
                            <li><strong>Performance:</strong> Cache data to speed up page loads</li>
                            <li><strong>Security:</strong> Detect and prevent fraudulent activity</li>
                            <li><strong>Improvement:</strong> Analyze features to make Kisan Saathi better</li>
                        </ul>

                        <h2>4. Cookie Duration</h2>
                        <p>Different cookies have different lifespans:</p>
                        <ul>
                            <li><strong>Session Cookies:</strong> Deleted when you close your browser</li>
                            <li><strong>Persistent Cookies:</strong> Stored for 1-12 months depending on type</li>
                            <li><strong>Authentication Cookies:</strong> Last 30 days or until you log out</li>
                        </ul>

                        <h2>5. Managing Cookies</h2>
                        <p>You can control cookies through:</p>
                        
                        <h3>Browser Settings</h3>
                        <ul>
                            <li><strong>Chrome:</strong> Settings → Privacy → Cookies and site data</li>
                            <li><strong>Firefox:</strong> Preferences → Privacy & Security → Cookies</li>
                            <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
                        </ul>

                        <h3>Platform Settings</h3>
                        <p>In your Kisan Saathi profile, you can:</p>
                        <ul>
                            <li>Opt out of analytics cookies</li>
                            <li>Clear cached data</li>
                            <li>Reset personalization settings</li>
                        </ul>

                        <h2>6. Impact of Disabling Cookies</h2>
                        <p>If you block cookies:</p>
                        <ul>
                            <li>You may need to log in repeatedly</li>
                            <li>Language preference won't be saved</li>
                            <li>Dashboard customization will be lost</li>
                            <li>Some features may not work properly</li>
                        </ul>

                        <h2>7. Third-Party Cookie Policies</h2>
                        <p>For cookies set by external services, refer to their policies:</p>
                        <ul>
                            <li>WhatsApp: <a href="https://www.whatsapp.com/legal/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a></li>
                            <li>Google: <a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener">Cookie Policy</a></li>
                        </ul>

                        <h2>8. Do Not Track (DNT)</h2>
                        <p>We respect DNT signals. When DNT is enabled in your browser, we:</p>
                        <ul>
                            <li>Disable non-essential analytics cookies</li>
                            <li>Anonymize all usage data</li>
                            <li>Do not track across other websites</li>
                        </ul>

                        <h2>9. Mobile App Cookies</h2>
                        <p>If we launch a mobile app, similar tracking technologies will be used with appropriate mobile privacy controls.</p>

                        <h2>10. Updates to This Policy</h2>
                        <p>We may update this Cookie Policy to reflect changes in our practices or legal requirements. 
                        Continued use after updates implies acceptance.</p>

                        <h2>11. Contact Us</h2>
                        <p>For questions about cookies or privacy:</p>
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

