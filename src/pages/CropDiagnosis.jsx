import React, { useState, useEffect } from 'react';
import { Camera, Loader2, AlertTriangle, Leaf, Shield, Pill, Bug, ArrowLeft, Upload, CheckCircle2, Clock, Microscope } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import gsap from 'gsap';

function DiagnosisContent() {
    const { language } = useLanguage();
    const [imageUrl, setImageUrl] = useState('');
    const [cropName, setCropName] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        if (diagnosis) {
            gsap.from('.diagnosis-card', {
                y: 30,
                opacity: 0,
                duration: 0.6,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }
    }, [diagnosis]);

    const content = {
        title: { hi: 'AI फसल डॉक्टर', en: 'AI Crop Doctor' },
        subtitle: { hi: 'फोटो से सेकंड में बीमारी पहचानें और इलाज पाएं', en: 'Get instant diagnosis & treatment from a photo' },
        uploadPhoto: { hi: 'फसल की फोटो अपलोड करें', en: 'Upload Crop Photo' },
        dragDrop: { hi: 'फोटो यहां खींचें या क्लिक करें', en: 'Drag photo here or click to upload' },
        cropName: { hi: 'फसल का नाम', en: 'Crop Name' },
        symptoms: { hi: 'लक्षण बताएं (वैकल्पिक)', en: 'Describe symptoms (optional)' },
        diagnose: { hi: 'जांच करें', en: 'Analyze Now' },
        analyzing: { hi: 'AI विश्लेषण...', en: 'AI Analyzing...' },
        diagnosis: { hi: 'समस्या पहचान', en: 'Problem Identified' },
        cause: { hi: 'कारण', en: 'Cause' },
        severity: { hi: 'गंभीरता', en: 'Severity' },
        organic: { hi: 'जैविक उपचार', en: 'Organic Treatment' },
        chemical: { hi: 'रासायनिक उपचार', en: 'Chemical Treatment' },
        prevention: { hi: 'बचाव के उपाय', en: 'Prevention Tips' },
        emergency: { hi: 'तुरंत करें', en: 'Immediate Action Required' },
        back: { hi: 'वापस', en: 'Back' },
        dosage: { hi: 'खुराक', en: 'Dosage' },
        application: { hi: 'प्रयोग विधि', en: 'How to Apply' },
        safety: { hi: 'सावधानी', en: 'Safety' },
        waiting: { hi: 'प्रतीक्षा अवधि', en: 'Waiting Period' }
    };

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            await uploadFile(e.dataTransfer.files[0]);
        }
    };

    const uploadFile = async (file) => {
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

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) await uploadFile(file);
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

    const getSeverityStyle = (severity) => {
        const s = severity?.toLowerCase() || '';
        if (s.includes('severe') || s.includes('high')) return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' };
        if (s.includes('moderate') || s.includes('medium')) return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' };
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex justify-between items-center">
                        <Link to={createPageUrl('Home')}>
                            <Button variant="ghost" className="gap-2 rounded-xl hover:bg-gray-100">
                                <ArrowLeft className="w-4 h-4" />
                                {getText(content.back)}
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                                <Microscope className="w-5 h-5 text-white" />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">{getText(content.title)}</h1>
                        </div>
                        <LanguageToggle />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 max-w-5xl">
                {/* Hero */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {getText(content.title)}
                    </h2>
                    <p className="text-gray-600 text-lg">{getText(content.subtitle)}</p>
                </div>

                {/* Upload Section */}
                <Card className="border-0 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden">
                    <CardContent className="p-8">
                        {/* Image Upload */}
                        <div 
                            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all mb-6
                                ${dragActive ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-emerald-400 hover:bg-gray-50'}
                                ${imageUrl ? 'bg-gray-50' : ''}`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {imageUrl ? (
                                <div className="relative">
                                    <img src={imageUrl} alt="Crop" className="max-h-80 mx-auto rounded-xl shadow-lg" />
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="mt-4 rounded-xl"
                                        onClick={() => setImageUrl('')}
                                    >
                                        {language === 'hi' ? 'दूसरी फोटो चुनें' : 'Choose Different Photo'}
                                    </Button>
                                </div>
                            ) : (
                                <label className="cursor-pointer block">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    <div className="flex flex-col items-center">
                                        {uploading ? (
                                            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4">
                                                <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                                            </div>
                                        ) : (
                                            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                                <Camera className="w-10 h-10 text-emerald-600" />
                                            </div>
                                        )}
                                        <p className="text-lg font-semibold text-gray-700 mb-1">
                                            {uploading 
                                                ? (language === 'hi' ? 'अपलोड हो रहा है...' : 'Uploading...')
                                                : getText(content.dragDrop)}
                                        </p>
                                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                                    </div>
                                </label>
                            )}
                        </div>

                        {/* Form Fields */}
                        <div className="grid md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {getText(content.cropName)}
                                </label>
                                <Input
                                    value={cropName}
                                    onChange={(e) => setCropName(e.target.value)}
                                    placeholder={language === 'hi' ? 'जैसे: टमाटर, गेहूं, धान' : 'e.g., Tomato, Wheat, Rice'}
                                    className="h-14 rounded-xl border-gray-200 bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {getText(content.symptoms)}
                                </label>
                                <Textarea
                                    value={symptoms}
                                    onChange={(e) => setSymptoms(e.target.value)}
                                    placeholder={language === 'hi' 
                                        ? 'पत्तों पर पीले धब्बे, पौधा मुरझा रहा है...' 
                                        : 'Yellow spots on leaves, plant wilting...'}
                                    className="h-14 rounded-xl border-gray-200 bg-gray-50 resize-none"
                                />
                            </div>
                        </div>

                        <Button 
                            onClick={fetchDiagnosis} 
                            disabled={loading || (!imageUrl && !symptoms)}
                            className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl text-lg shadow-lg shadow-emerald-500/25"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" />
                                    {getText(content.analyzing)}
                                </>
                            ) : (
                                <>
                                    <Bug className="w-5 h-5 mr-2" />
                                    {getText(content.diagnose)}
                                </>
                            )}
                        </Button>
                        {error && <p className="text-red-500 mt-4 text-center bg-red-50 py-2 px-4 rounded-lg">{error}</p>}
                    </CardContent>
                </Card>

                {/* Diagnosis Results */}
                {diagnosis && (
                    <div className="space-y-6">
                        {/* Emergency Action */}
                        {diagnosis.emergency_action?.needed && (
                            <Card className="diagnosis-card border-0 shadow-xl shadow-red-200/50 bg-gradient-to-r from-red-500 to-rose-600 text-white overflow-hidden">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-xl mb-2">{getText(content.emergency)}</h4>
                                            <p className="text-red-100 text-lg">
                                                {language === 'hi' 
                                                    ? diagnosis.emergency_action.action_hi 
                                                    : diagnosis.emergency_action.action_en}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Problem Identification */}
                        {diagnosis.diagnosis && (
                            <Card className="diagnosis-card border-0 shadow-xl shadow-gray-200/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-rose-500 to-red-600 p-6 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bug className="w-5 h-5" />
                                        <span className="text-rose-100 font-medium">{getText(content.diagnosis)}</span>
                                    </div>
                                    <h3 className="text-2xl md:text-3xl font-bold">
                                        {language === 'hi' 
                                            ? diagnosis.diagnosis.problem_name_hi 
                                            : diagnosis.diagnosis.problem_name_en}
                                    </h3>
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        <Badge className="px-4 py-2 text-sm rounded-xl bg-gray-100 text-gray-700">
                                            {diagnosis.diagnosis.problem_type}
                                        </Badge>
                                        {diagnosis.diagnosis.severity && (
                                            <Badge className={`px-4 py-2 text-sm rounded-xl ${getSeverityStyle(diagnosis.diagnosis.severity).bg} ${getSeverityStyle(diagnosis.diagnosis.severity).text}`}>
                                                {getText(content.severity)}: {diagnosis.diagnosis.severity}
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="bg-gray-50 rounded-2xl p-5">
                                        <h5 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                            <Microscope className="w-4 h-4" />
                                            {getText(content.cause)}
                                        </h5>
                                        <p className="text-gray-600 leading-relaxed">
                                            {language === 'hi' ? diagnosis.diagnosis.cause_hi : diagnosis.diagnosis.cause_en}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Treatments Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Organic Treatments */}
                            {diagnosis.organic_treatments && diagnosis.organic_treatments.length > 0 && (
                                <Card className="diagnosis-card border-0 shadow-xl shadow-gray-200/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                                <Leaf className="w-6 h-6 text-emerald-600" />
                                            </div>
                                            <h4 className="font-bold text-xl text-emerald-800">{getText(content.organic)}</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {diagnosis.organic_treatments.map((treatment, idx) => (
                                                <div key={idx} className="bg-emerald-50 rounded-xl p-4">
                                                    <h5 className="font-bold text-emerald-800 mb-2">
                                                        {language === 'hi' ? treatment.name_hi : treatment.name_en}
                                                    </h5>
                                                    <div className="space-y-2 text-sm">
                                                        <p className="flex items-start gap-2">
                                                            <span className="font-medium text-gray-600 w-20">{getText(content.dosage)}:</span>
                                                            <span className="text-gray-700">{treatment.dosage}</span>
                                                        </p>
                                                        <p className="flex items-start gap-2">
                                                            <span className="font-medium text-gray-600 w-20">Frequency:</span>
                                                            <span className="text-gray-700">{treatment.frequency}</span>
                                                        </p>
                                                    </div>
                                                    <p className="mt-3 text-gray-700 text-sm">
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
                                <Card className="diagnosis-card border-0 shadow-xl shadow-gray-200/50">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                                <Pill className="w-6 h-6 text-amber-600" />
                                            </div>
                                            <h4 className="font-bold text-xl text-amber-800">{getText(content.chemical)}</h4>
                                        </div>
                                        <div className="space-y-4">
                                            {diagnosis.chemical_treatments.map((treatment, idx) => (
                                                <div key={idx} className="bg-amber-50 rounded-xl p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h5 className="font-bold text-amber-800">{treatment.product_name}</h5>
                                                        <Badge variant="outline" className="text-xs">{treatment.active_ingredient}</Badge>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                                        <p><span className="text-gray-500">{getText(content.dosage)}:</span> <span className="font-medium">{treatment.dosage_per_liter}</span></p>
                                                        <p><span className="text-gray-500">Per Acre:</span> <span className="font-medium">{treatment.dosage_per_acre}</span></p>
                                                        <p><span className="text-gray-500">Best Time:</span> <span className="font-medium">{treatment.best_time}</span></p>
                                                        <p className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3 text-gray-500" />
                                                            <span className="font-medium">{treatment.safety_interval_days} days</span>
                                                        </p>
                                                    </div>
                                                    <div className="bg-red-50 rounded-lg p-3 text-sm">
                                                        <p className="text-red-700 flex items-start gap-2">
                                                            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                                            {language === 'hi' ? treatment.precautions_hi : treatment.precautions_en}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Prevention */}
                        {diagnosis.prevention && (
                            <Card className="diagnosis-card border-0 shadow-xl shadow-gray-200/50 bg-gradient-to-br from-sky-50 to-blue-50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-12 h-12 bg-sky-100 rounded-xl flex items-center justify-center">
                                            <Shield className="w-6 h-6 text-sky-600" />
                                        </div>
                                        <h4 className="font-bold text-xl text-sky-800">{getText(content.prevention)}</h4>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        {(language === 'hi' 
                                            ? diagnosis.prevention.measures_hi 
                                            : diagnosis.prevention.measures_en)?.map((measure, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                                                <CheckCircle2 className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-gray-700">{measure}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
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