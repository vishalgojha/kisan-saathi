import React, { useState } from 'react';
import { Camera, Upload, Loader2, AlertTriangle, Leaf, Shield, Pill, Bug } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

function DiagnosisContent() {
    const { language } = useLanguage();
    const [imageUrl, setImageUrl] = useState('');
    const [cropName, setCropName] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    const content = {
        title: { hi: 'फसल जांच', en: 'Crop Diagnosis' },
        subtitle: { hi: 'फोटो से बीमारी पहचानें', en: 'Identify disease from photo' },
        uploadPhoto: { hi: 'फोटो अपलोड करें', en: 'Upload Photo' },
        cropName: { hi: 'फसल का नाम', en: 'Crop Name' },
        symptoms: { hi: 'लक्षण बताएं (वैकल्पिक)', en: 'Describe symptoms (optional)' },
        diagnose: { hi: 'जांच करें', en: 'Diagnose' },
        diagnosis: { hi: 'समस्या', en: 'Problem' },
        cause: { hi: 'कारण', en: 'Cause' },
        severity: { hi: 'गंभीरता', en: 'Severity' },
        organic: { hi: 'जैविक उपचार', en: 'Organic Treatment' },
        chemical: { hi: 'रासायनिक उपचार', en: 'Chemical Treatment' },
        prevention: { hi: 'बचाव के उपाय', en: 'Prevention' },
        emergency: { hi: 'तुरंत करें', en: 'Emergency Action' },
        back: { hi: '← वापस', en: '← Back' },
        dosage: { hi: 'खुराक', en: 'Dosage' },
        application: { hi: 'प्रयोग विधि', en: 'Application' },
        safety: { hi: 'सावधानी', en: 'Safety' }
    };

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const result = await base44.integrations.Core.UploadFile({ file });
            setImageUrl(result.file_url);
        } catch (err) {
            setError(language === 'hi' ? 'फोटो अपलोड नहीं हो पाई' : 'Could not upload photo');
        } finally {
            setUploading(false);
        }
    };

    const fetchDiagnosis = async () => {
        if (!imageUrl && !symptoms) return;
        setLoading(true);
        setError(null);
        
        try {
            const response = await base44.functions.invoke('diagnoseCropDisease', {
                image_url: imageUrl,
                crop_name: cropName,
                symptoms
            });
            setDiagnosis(response.data.data);
        } catch (err) {
            setError(language === 'hi' ? 'जांच नहीं हो पाई' : 'Could not diagnose');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityColor = (severity) => {
        const s = severity?.toLowerCase() || '';
        if (s.includes('severe') || s.includes('high')) return 'bg-red-100 text-red-800';
        if (s.includes('moderate') || s.includes('medium')) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-amber-50">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" className="text-green-700">
                            {getText(content.back)}
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold text-green-800">{getText(content.title)}</h1>
                    <LanguageToggle />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Upload Section */}
                <Card className="mb-8 border-green-200">
                    <CardContent className="p-6">
                        {/* Image Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getText(content.uploadPhoto)}
                            </label>
                            <div className="border-2 border-dashed border-green-300 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                                {imageUrl ? (
                                    <div className="relative">
                                        <img src={imageUrl} alt="Crop" className="max-h-64 mx-auto rounded-lg" />
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="mt-3"
                                            onClick={() => setImageUrl('')}
                                        >
                                            {language === 'hi' ? 'हटाएं' : 'Remove'}
                                        </Button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileUpload}
                                            disabled={uploading}
                                        />
                                        <div className="flex flex-col items-center">
                                            {uploading ? (
                                                <Loader2 className="w-12 h-12 text-green-500 animate-spin" />
                                            ) : (
                                                <Camera className="w-12 h-12 text-green-500 mb-2" />
                                            )}
                                            <p className="text-green-700 font-medium">
                                                {uploading 
                                                    ? (language === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...')
                                                    : (language === 'hi' ? 'फोटो चुनें या खींचें' : 'Click or drag photo')}
                                            </p>
                                        </div>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Crop Name */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getText(content.cropName)}
                            </label>
                            <Input
                                value={cropName}
                                onChange={(e) => setCropName(e.target.value)}
                                placeholder={language === 'hi' ? 'जैसे: टमाटर, गेहूं, धान' : 'e.g., Tomato, Wheat, Rice'}
                                className="h-12"
                            />
                        </div>

                        {/* Symptoms */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getText(content.symptoms)}
                            </label>
                            <Textarea
                                value={symptoms}
                                onChange={(e) => setSymptoms(e.target.value)}
                                placeholder={language === 'hi' 
                                    ? 'पत्तों पर पीले धब्बे, पौधा मुरझा रहा है...' 
                                    : 'Yellow spots on leaves, plant wilting...'}
                                rows={3}
                            />
                        </div>

                        <Button 
                            onClick={fetchDiagnosis} 
                            disabled={loading || (!imageUrl && !symptoms)}
                            className="w-full h-12 bg-green-600 hover:bg-green-700"
                        >
                            {loading ? <Loader2 className="animate-spin mr-2" /> : <Bug className="w-5 h-5 mr-2" />}
                            {getText(content.diagnose)}
                        </Button>
                        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
                    </CardContent>
                </Card>

                {/* Diagnosis Results */}
                {diagnosis && (
                    <>
                        {/* Problem Identification */}
                        {diagnosis.diagnosis && (
                            <Card className="mb-6 border-red-200">
                                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                                    <CardTitle className="text-red-800 flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        {getText(content.diagnosis)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">
                                                {language === 'hi' 
                                                    ? diagnosis.diagnosis.problem_name_hi 
                                                    : diagnosis.diagnosis.problem_name_en}
                                            </h3>
                                            <Badge className="mt-2">{diagnosis.diagnosis.problem_type}</Badge>
                                        </div>
                                        <Badge className={getSeverityColor(diagnosis.diagnosis.severity)}>
                                            {getText(content.severity)}: {diagnosis.diagnosis.severity}
                                        </Badge>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm font-medium text-gray-700 mb-1">{getText(content.cause)}:</p>
                                        <p className="text-gray-600">
                                            {language === 'hi' ? diagnosis.diagnosis.cause_hi : diagnosis.diagnosis.cause_en}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Emergency Action */}
                        {diagnosis.emergency_action?.needed && (
                            <Card className="mb-6 border-red-400 bg-red-50">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-8 h-8 text-red-600" />
                                        <div>
                                            <h4 className="font-bold text-red-800">{getText(content.emergency)}</h4>
                                            <p className="text-red-700">
                                                {language === 'hi' 
                                                    ? diagnosis.emergency_action.action_hi 
                                                    : diagnosis.emergency_action.action_en}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Organic Treatments */}
                        {diagnosis.organic_treatments && diagnosis.organic_treatments.length > 0 && (
                            <Card className="mb-6 border-green-200">
                                <CardHeader>
                                    <CardTitle className="text-green-800 flex items-center gap-2">
                                        <Leaf className="w-5 h-5" />
                                        {getText(content.organic)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {diagnosis.organic_treatments.map((treatment, idx) => (
                                            <div key={idx} className="bg-green-50 rounded-lg p-4">
                                                <h4 className="font-bold text-green-800 mb-2">
                                                    {language === 'hi' ? treatment.name_hi : treatment.name_en}
                                                </h4>
                                                <div className="grid md:grid-cols-2 gap-2 text-sm">
                                                    <p><strong>{getText(content.dosage)}:</strong> {treatment.dosage}</p>
                                                    <p><strong>Frequency:</strong> {treatment.frequency}</p>
                                                </div>
                                                <p className="mt-2 text-gray-700">
                                                    {language === 'hi' ? treatment.application_hi : treatment.application_en}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Chemical Treatments */}
                        {diagnosis.chemical_treatments && diagnosis.chemical_treatments.length > 0 && (
                            <Card className="mb-6 border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-amber-800 flex items-center gap-2">
                                        <Pill className="w-5 h-5" />
                                        {getText(content.chemical)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {diagnosis.chemical_treatments.map((treatment, idx) => (
                                            <div key={idx} className="bg-amber-50 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-amber-800">{treatment.product_name}</h4>
                                                    <Badge variant="outline">{treatment.active_ingredient}</Badge>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-2 text-sm mb-2">
                                                    <p><strong>{getText(content.dosage)}:</strong> {treatment.dosage_per_liter}</p>
                                                    <p><strong>Per Acre:</strong> {treatment.dosage_per_acre}</p>
                                                    <p><strong>Best Time:</strong> {treatment.best_time}</p>
                                                    <p><strong>Waiting Period:</strong> {treatment.safety_interval_days} days</p>
                                                </div>
                                                <div className="bg-white rounded p-2 mt-2">
                                                    <p className="text-sm">
                                                        <strong>{getText(content.application)}:</strong>{' '}
                                                        {language === 'hi' ? treatment.application_method_hi : treatment.application_method_en}
                                                    </p>
                                                </div>
                                                <div className="bg-red-50 rounded p-2 mt-2">
                                                    <p className="text-sm text-red-700">
                                                        <strong>{getText(content.safety)}:</strong>{' '}
                                                        {language === 'hi' ? treatment.precautions_hi : treatment.precautions_en}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Prevention */}
                        {diagnosis.prevention && (
                            <Card className="mb-6 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-blue-800 flex items-center gap-2">
                                        <Shield className="w-5 h-5" />
                                        {getText(content.prevention)}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-2">
                                        {(language === 'hi' 
                                            ? diagnosis.prevention.measures_hi 
                                            : diagnosis.prevention.measures_en)?.map((measure, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <span className="text-blue-600">•</span>
                                                <span>{measure}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

export default function CropDiagnosis() {
    return (
        <LanguageProvider>
            <DiagnosisContent />
        </LanguageProvider>
    );
}