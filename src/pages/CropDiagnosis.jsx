import React, { useState, useEffect, useRef } from 'react';
import { Camera, Loader2, AlertTriangle, Leaf, Shield, Pill, Bug, ArrowLeft, CheckCircle2, Clock, Microscope, Pencil, Sparkles, X } from 'lucide-react';
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

// FilePond imports
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import ImageAnnotator from '../components/ImageAnnotator';

// Register FilePond plugins
registerPlugin(FilePondPluginImagePreview, FilePondPluginFileValidateType);

function DiagnosisContent() {
    const { language } = useLanguage();
    const [files, setFiles] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [previewUrl, setPreviewUrl] = useState('');
    const [cropName, setCropName] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [diagnosis, setDiagnosis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAnnotator, setShowAnnotator] = useState(false);
    const [analysisStage, setAnalysisStage] = useState(0);
    
    const resultsRef = useRef(null);
    const stageRef = useRef(null);

    const analysisStages = [
        { hi: 'छवि प्रोसेसिंग...', en: 'Processing image...' },
        { hi: 'पैटर्न विश्लेषण...', en: 'Analyzing patterns...' },
        { hi: 'रोग पहचान...', en: 'Identifying disease...' },
        { hi: 'उपचार तैयार करना...', en: 'Preparing treatments...' },
    ];

    useEffect(() => {
        if (diagnosis && resultsRef.current) {
            const cards = resultsRef.current.querySelectorAll('.diagnosis-card');
            gsap.fromTo(cards, 
                { y: 60, opacity: 0, scale: 0.95 },
                { 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    duration: 0.7, 
                    stagger: 0.15, 
                    ease: 'power3.out',
                    clearProps: 'all'
                }
            );
        }
    }, [diagnosis]);

    const content = {
        title: { hi: 'AI फसल डॉक्टर', en: 'AI Crop Doctor' },
        subtitle: { hi: 'फोटो से सेकंड में बीमारी पहचानें और इलाज पाएं', en: 'Get instant diagnosis & treatment from a photo' },
        uploadLabel: { hi: 'फसल की फोटो अपलोड करें', en: 'Upload crop photo' },
        cropName: { hi: 'फसल का नाम', en: 'Crop Name' },
        symptoms: { hi: 'लक्षण बताएं (वैकल्पिक)', en: 'Describe symptoms (optional)' },
        diagnose: { hi: 'AI से जांच करें', en: 'Analyze with AI' },
        analyzing: { hi: 'AI विश्लेषण जारी...', en: 'AI Analysis in progress...' },
        editImage: { hi: 'फोटो पर मार्क करें', en: 'Mark areas on photo' },
        diagnosis: { hi: 'समस्या पहचान', en: 'Problem Identified' },
        cause: { hi: 'कारण', en: 'Cause' },
        severity: { hi: 'गंभीरता', en: 'Severity' },
        organic: { hi: 'जैविक उपचार', en: 'Organic Treatment' },
        chemical: { hi: 'रासायनिक उपचार', en: 'Chemical Treatment' },
        prevention: { hi: 'बचाव के उपाय', en: 'Prevention Tips' },
        emergency: { hi: 'तुरंत करें!', en: 'Immediate Action!' },
        back: { hi: 'वापस', en: 'Back' },
        dosage: { hi: 'खुराक', en: 'Dosage' },
        dragDrop: { hi: 'फोटो यहां खींचें या क्लिक करें', en: 'Drag & drop or click to upload' }
    };

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const handleFileUpload = async (fileItems) => {
        if (fileItems.length === 0) {
            setImageUrl('');
            setPreviewUrl('');
            return;
        }

        const file = fileItems[0].file;
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);

        try {
            const result = await base44.integrations.Core.UploadFile({ file });
            setImageUrl(result.file_url);
        } catch (err) {
            setError(language === 'hi' ? 'फोटो अपलोड नहीं हो पाई' : 'Could not upload photo');
        }
    };

    const handleAnnotationSave = async (file, dataUrl) => {
        setShowAnnotator(false);
        setPreviewUrl(dataUrl);
        
        try {
            const result = await base44.integrations.Core.UploadFile({ file });
            setImageUrl(result.file_url);
        } catch (err) {
            setError(language === 'hi' ? 'एनोटेटेड फोटो अपलोड नहीं हो पाई' : 'Could not upload annotated photo');
        }
    };

    const animateAnalysis = () => {
        return new Promise((resolve) => {
            let stage = 0;
            setAnalysisStage(0);
            
            const interval = setInterval(() => {
                stage++;
                if (stage < analysisStages.length) {
                    setAnalysisStage(stage);
                    if (stageRef.current) {
                        gsap.fromTo(stageRef.current,
                            { opacity: 0, y: 10 },
                            { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
                        );
                    }
                } else {
                    clearInterval(interval);
                    resolve();
                }
            }, 1200);
        });
    };

    const fetchDiagnosis = async () => {
        if (!imageUrl && !symptoms) return;
        setLoading(true);
        setError(null);
        setDiagnosis(null);

        // Start analysis animation
        const animationPromise = animateAnalysis();
        
        try {
            const [, response] = await Promise.all([
                animationPromise,
                base44.functions.invoke('diagnoseCropDisease', {
                    image_url: imageUrl,
                    crop_name: cropName,
                    symptoms
                })
            ]);
            setDiagnosis(response.data.data);
        } catch (err) {
            setError(language === 'hi' ? 'जांच नहीं हो पाई' : 'Could not diagnose');
        } finally {
            setLoading(false);
        }
    };

    const getSeverityStyle = (severity) => {
        const s = severity?.toLowerCase() || '';
        if (s.includes('severe') || s.includes('high')) return { bg: 'bg-red-100', text: 'text-red-700', gradient: 'from-red-500 to-rose-600' };
        if (s.includes('moderate') || s.includes('medium')) return { bg: 'bg-amber-100', text: 'text-amber-700', gradient: 'from-amber-500 to-orange-600' };
        return { bg: 'bg-emerald-100', text: 'text-emerald-700', gradient: 'from-emerald-500 to-teal-600' };
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

            <main className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-5xl">
                {/* Hero */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        {getText(content.title)}
                    </h2>
                    <p className="text-gray-600 text-lg">{getText(content.subtitle)}</p>
                </div>

                {/* Image Annotator Modal */}
                {showAnnotator && previewUrl && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="w-full max-w-4xl animate-in fade-in zoom-in duration-300">
                            <ImageAnnotator
                                imageUrl={previewUrl}
                                onSave={handleAnnotationSave}
                                onCancel={() => setShowAnnotator(false)}
                            />
                        </div>
                    </div>
                )}

                {/* Upload Section */}
                <Card className="border-0 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden">
                    <CardContent className="p-8">
                        {/* FilePond Upload */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                {getText(content.uploadLabel)}
                            </label>
                            <div className="filepond-wrapper">
                                <FilePond
                                    files={files}
                                    onupdatefiles={setFiles}
                                    onprocessfiles={() => {}}
                                    onaddfile={(error, file) => {
                                        if (!error) handleFileUpload([file]);
                                    }}
                                    onremovefile={() => {
                                        setImageUrl('');
                                        setPreviewUrl('');
                                    }}
                                    allowMultiple={false}
                                    maxFiles={1}
                                    acceptedFileTypes={['image/*']}
                                    labelIdle={`<div class="filepond-label">
                                        <svg class="w-12 h-12 mx-auto mb-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        <p class="text-lg font-semibold text-gray-700">${getText(content.dragDrop)}</p>
                                        <p class="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                                    </div>`}
                                    stylePanelLayout="compact"
                                    styleLoadIndicatorPosition="center bottom"
                                    styleProgressIndicatorPosition="right bottom"
                                    styleButtonRemoveItemPosition="left bottom"
                                    styleButtonProcessItemPosition="right bottom"
                                    credits={false}
                                />
                            </div>
                        </div>

                        {/* Edit Image Button */}
                        {previewUrl && (
                            <div className="mb-6 flex justify-center">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAnnotator(true)}
                                    className="rounded-xl gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                                >
                                    <Pencil className="w-4 h-4" />
                                    {getText(content.editImage)}
                                </Button>
                            </div>
                        )}

                        {/* Form Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {getText(content.cropName)}
                                </label>
                                <Input
                                    value={cropName}
                                    onChange={(e) => setCropName(e.target.value)}
                                    placeholder={language === 'hi' ? 'जैसे: टमाटर, गेहूं, धान' : 'e.g., Tomato, Wheat, Rice'}
                                    className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors"
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
                                    className="h-14 rounded-xl border-gray-200 bg-gray-50 focus:bg-white transition-colors resize-none"
                                />
                            </div>
                        </div>

                        {/* Analyze Button */}
                        <Button 
                            onClick={fetchDiagnosis} 
                            disabled={loading || (!imageUrl && !symptoms)}
                            className="w-full h-14 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl text-lg shadow-lg shadow-emerald-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <div className="flex items-center gap-3">
                                    <Loader2 className="animate-spin w-5 h-5" />
                                    <span ref={stageRef}>{getText(analysisStages[analysisStage])}</span>
                                </div>
                            ) : (
                                <>
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    {getText(content.diagnose)}
                                </>
                            )}
                        </Button>
                        
                        {error && (
                            <p className="text-red-500 mt-4 text-center bg-red-50 py-3 px-4 rounded-xl flex items-center justify-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {error}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Loading Animation */}
                {loading && (
                    <Card className="border-0 shadow-xl shadow-gray-200/50 mb-8 overflow-hidden">
                        <CardContent className="p-8">
                            <div className="flex flex-col items-center">
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-25" />
                                    <div className="absolute inset-2 bg-emerald-300 rounded-full animate-ping opacity-25 animation-delay-200" />
                                    <div className="absolute inset-4 bg-emerald-400 rounded-full animate-pulse" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Microscope className="w-10 h-10 text-emerald-700" />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{getText(content.analyzing)}</h3>
                                <div className="flex gap-2 mt-4">
                                    {analysisStages.map((_, idx) => (
                                        <div 
                                            key={idx}
                                            className={`w-3 h-3 rounded-full transition-all duration-300 ${idx <= analysisStage ? 'bg-emerald-500 scale-100' : 'bg-gray-200 scale-75'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Diagnosis Results */}
                {diagnosis && !loading && (
                    <div ref={resultsRef} className="space-y-6">
                        {/* Emergency Action */}
                        {diagnosis.emergency_action?.needed && (
                            <Card className="diagnosis-card border-0 shadow-xl overflow-hidden">
                                <div className="bg-gradient-to-r from-red-500 to-rose-600 p-6 text-white">
                                    <div className="flex items-start gap-4">
                                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 animate-pulse">
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
                                </div>
                            </Card>
                        )}

                        {/* Problem Identification */}
                        {diagnosis.diagnosis && (
                            <Card className="diagnosis-card border-0 shadow-xl shadow-gray-200/50 overflow-hidden">
                                <div className={`bg-gradient-to-r ${getSeverityStyle(diagnosis.diagnosis.severity).gradient} p-6 text-white`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Bug className="w-5 h-5" />
                                        <span className="text-white/80 font-medium">{getText(content.diagnosis)}</span>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                                                <div key={idx} className="bg-emerald-50 rounded-xl p-4 hover:shadow-md transition-shadow">
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
                                                <div key={idx} className="bg-amber-50 rounded-xl p-4 hover:shadow-md transition-shadow">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {(language === 'hi' 
                                            ? diagnosis.prevention.measures_hi 
                                            : diagnosis.prevention.measures_en)?.map((measure, idx) => (
                                            <div key={idx} className="flex items-start gap-3 p-3 bg-white rounded-xl hover:shadow-md transition-shadow">
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

            {/* Custom FilePond Styles */}
            <style>{`
                .filepond--root {
                    font-family: inherit;
                }
                .filepond--panel-root {
                    background-color: #f9fafb;
                    border: 2px dashed #d1d5db;
                    border-radius: 1rem;
                }
                .filepond--drop-label {
                    color: #374151;
                }
                .filepond--drop-label label {
                    cursor: pointer;
                }
                .filepond-label {
                    padding: 2rem;
                }
                .filepond--root:hover .filepond--panel-root {
                    border-color: #10b981;
                    background-color: #ecfdf5;
                }
                .filepond--image-preview-wrapper {
                    border-radius: 0.75rem;
                    overflow: hidden;
                }
                .filepond--file {
                    border-radius: 0.75rem;
                }
                .filepond--item-panel {
                    border-radius: 0.75rem;
                }
                .filepond--file-action-button {
                    cursor: pointer;
                }
                .animation-delay-200 {
                    animation-delay: 200ms;
                }
            `}</style>
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