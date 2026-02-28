import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function Disclaimer() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-50 py-20">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Disclaimer</h1>
                    <p className="text-gray-600">Please read carefully before using Kisan Saathi</p>
                </div>

                <Card className="border-0 shadow-xl mb-8 bg-yellow-50 border-yellow-200">
                    <CardContent className="p-8">
                        <p className="text-lg text-gray-700 leading-relaxed">
                            <strong>IMPORTANT:</strong> Kisan Saathi is an AI-powered informational tool designed to assist farmers. 
                            It is NOT a substitute for professional agricultural advice, local expertise, or government services.
                        </p>
                    </CardContent>
                </Card>

                <Card className="border-0 shadow-xl">
                    <CardContent className="p-8 prose prose-gray max-w-none">
                        <h2>1. AI Limitations</h2>
                        <p>Our AI system:</p>
                        <ul>
                            <li>Provides <strong>suggestions</strong>, not guaranteed solutions</li>
                            <li>May occasionally produce incorrect or incomplete information</li>
                            <li>Cannot account for all local soil, climate, and crop variations</li>
                            <li>Should not be the sole basis for critical farming decisions</li>
                        </ul>

                        <h2>2. Crop Diagnosis</h2>
                        <p>Disease diagnosis accuracy depends on:</p>
                        <ul>
                            <li>Photo quality (lighting, focus, angle)</li>
                            <li>Disease stage and visibility</li>
                            <li>AI model training data availability</li>
                        </ul>
                        <p><strong>Always consult local agricultural extension officers or plant pathologists for complex cases.</strong></p>

                        <h2>3. Market Prices</h2>
                        <p>Mandi prices displayed:</p>
                        <ul>
                            <li>Are sourced from public APIs and may have delays</li>
                            <li>May not reflect real-time market conditions</li>
                            <li>Can vary based on crop quality, season, and demand</li>
                            <li>Should be verified before making selling decisions</li>
                        </ul>

                        <h2>4. Weather Forecasts</h2>
                        <p>Weather predictions:</p>
                        <ul>
                            <li>Are based on third-party meteorological data</li>
                            <li>Have inherent uncertainty and may change rapidly</li>
                            <li>Should not be the only factor in irrigation or spraying decisions</li>
                            <li>Are more accurate for 1-2 days, less so for 5-7 days</li>
                        </ul>

                        <h2>5. Government Schemes</h2>
                        <p>Scheme information:</p>
                        <ul>
                            <li>Is provided for awareness purposes only</li>
                            <li>May change based on government policy updates</li>
                            <li>Does not guarantee eligibility or approval</li>
                            <li>Should be verified with official government sources</li>
                        </ul>

                        <h2>6. Treatment Recommendations</h2>
                        <p>Chemical and organic treatment suggestions:</p>
                        <ul>
                            <li>Must comply with local regulations and laws</li>
                            <li>Require proper dosage calculation based on farm size</li>
                            <li>Should follow safety guidelines on product labels</li>
                            <li>May require certified pesticide applicator licenses</li>
                        </ul>

                        <h2>7. No Liability for Losses</h2>
                        <p>Chaos Craft Labs is NOT liable for:</p>
                        <ul>
                            <li>Crop failures or reduced yields</li>
                            <li>Financial losses from market decisions</li>
                            <li>Health or safety incidents from chemical use</li>
                            <li>Damages from incorrect AI predictions</li>
                            <li>Third-party service failures (WhatsApp, APIs, etc.)</li>
                        </ul>

                        <h2>8. User Responsibility</h2>
                        <p>You acknowledge that:</p>
                        <ul>
                            <li>You use Kisan Saathi at your own risk</li>
                            <li>You are responsible for verifying critical information</li>
                            <li>Local conditions always take precedence over AI advice</li>
                            <li>Professional consultation is recommended for major decisions</li>
                        </ul>

                        <h2>9. Data Accuracy</h2>
                        <p>While we strive for accuracy, we cannot guarantee:</p>
                        <ul>
                            <li>100% uptime or real-time data updates</li>
                            <li>Complete coverage of all crops, diseases, or mandis</li>
                            <li>Error-free operation across all devices and networks</li>
                        </ul>

                        <h2>10. Recommendations</h2>
                        <p>For best results:</p>
                        <ul>
                            <li>Use Kisan Saathi as a <strong>supplementary tool</strong></li>
                            <li>Combine AI insights with local knowledge</li>
                            <li>Consult agricultural experts for validation</li>
                            <li>Maintain relationships with local extension services</li>
                            <li>Join farmer cooperatives for peer support</li>
                        </ul>

                        <h2>11. Emergency Situations</h2>
                        <p>For urgent crop health or pest outbreaks:</p>
                        <ul>
                            <li>Contact local agricultural department immediately</li>
                            <li>Do NOT rely solely on Kisan Saathi for crisis management</li>
                            <li>Government hotlines and extension officers should be your first call</li>
                        </ul>

                        <h2>12. Contact for Clarifications</h2>
                        <p>If you have questions about this disclaimer:</p>
                        <ul>
                            <li>Email: support@chaoscraftlabs.com</li>
                            <li>Website: www.chaoscraftlabs.com</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

