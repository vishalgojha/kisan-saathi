import { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, Bot, Camera, ExternalLink, FlaskConical, Leaf, Loader2, Pill, RotateCcw, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createDiagnosisAdapter } from '@/adapters/diagnosisAdapter';
import { getLocalizedText, type SupportedLanguage } from '@/adapters/types/common';
import { useLanguage } from './LanguageContext';

type DiseaseDiagnosisProps = {
    crops?: string[];
};

const cropDefaults = ['Wheat', 'Rice', 'Cotton', 'Tomato'];

const uiText = {
    title: { hi: 'फोटो रोग जांच', en: 'Disease Diagnosis' },
    subtitle: {
        hi: 'फोटो और लक्षण से AI आधारित प्रारंभिक रोग पहचान',
        en: 'AI-assisted initial diagnosis from image and symptoms',
    },
    mockTag: { hi: 'मॉक/लाइव एडाप्टर', en: 'Mock/Live Adapter' },
    crop: { hi: 'फसल चुनें', en: 'Select Crop' },
    symptoms: { hi: 'लक्षण लिखें', en: 'Enter Symptoms' },
    symptomsHint: {
        hi: 'जैसे: पत्तियों पर भूरे धब्बे, पीला पड़ना, कीट दिखना...',
        en: 'e.g. brown spots on leaves, yellowing, visible insects...',
    },
    uploadHint: {
        hi: 'फोटो अपलोड करें (JPG/PNG, अधिकतम 6MB)',
        en: 'Upload image (JPG/PNG, max 6MB)',
    },
    analyze: { hi: 'रोग पहचानें', en: 'Run Diagnosis' },
    analyzing: { hi: 'विश्लेषण हो रहा है...', en: 'Analyzing...' },
    confidence: { hi: 'विश्वास', en: 'Confidence' },
    treatments: { hi: 'उपचार सुझाव', en: 'Treatment Suggestions' },
    usefulLinks: { hi: 'उपयोगी लिंक', en: 'Useful Links' },
    noInput: {
        hi: 'कम से कम फोटो या 3+ अक्षरों के लक्षण दर्ज करें।',
        en: 'Provide an image or symptoms with at least 3 characters.',
    },
    longSymptoms: {
        hi: 'लक्षण 320 अक्षरों से कम रखें।',
        en: 'Keep symptoms under 320 characters.',
    },
    invalidFileType: {
        hi: 'कृपया केवल इमेज फाइल अपलोड करें।',
        en: 'Please upload an image file only.',
    },
    invalidFileSize: {
        hi: 'फाइल 6MB से छोटी रखें।',
        en: 'Please upload an image smaller than 6MB.',
    },
    serviceError: {
        hi: 'डायग्नोसिस सेवा अभी उपलब्ध नहीं है। कृपया पुनः प्रयास करें।',
        en: 'Diagnosis service is currently unavailable. Please retry.',
    },
    retry: { hi: 'फिर से कोशिश करें', en: 'Retry' },
    emptyState: {
        hi: 'परिणाम देखने के लिए विश्लेषण चलाएं।',
        en: 'Run diagnosis to view results.',
    },
    demo: {
        hi: 'नोट: यह प्रारंभिक AI सलाह है। गंभीर स्थिति में कृषि विशेषज्ञ से पुष्टि करें।',
        en: 'Note: This is initial AI advisory. Confirm severe cases with an agriculture expert.',
    },
};

const asLanguage = (value: string): SupportedLanguage => (value === 'en' ? 'en' : 'hi');

export default function DiseaseDiagnosis({ crops = [] }: DiseaseDiagnosisProps) {
    const { language } = useLanguage();
    const safeLanguage = asLanguage(language);
    const adapter = useMemo(() => createDiagnosisAdapter(), []);

    const [selectedCrop, setSelectedCrop] = useState(crops[0] || cropDefaults[0]);
    const [symptoms, setSymptoms] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<Awaited<ReturnType<typeof adapter.runDiagnosis>> | null>(null);
    const [error, setError] = useState('');
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const cropOptions = useMemo(() => (crops.length > 0 ? crops : cropDefaults), [crops]);
    const getText = (text: { hi: string; en: string }) => getLocalizedText(text, safeLanguage);

    useEffect(() => {
        if (cropOptions.length > 0 && !cropOptions.includes(selectedCrop)) {
            setSelectedCrop(cropOptions[0]);
        }
    }, [cropOptions, selectedCrop]);

    useEffect(() => {
        return () => {
            if (imagePreview) URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    const validateForm = () => {
        if (!imageFile && symptoms.trim().length < 3) return getText(uiText.noInput);
        if (symptoms.trim().length > 320) return getText(uiText.longSymptoms);
        return '';
    };

    const handleImage = (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setError(getText(uiText.invalidFileType));
            return;
        }
        if (file.size > 6 * 1024 * 1024) {
            setError(getText(uiText.invalidFileSize));
            return;
        }
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const nextPreview = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(nextPreview);
        setError('');
        setResult(null);
    };

    const runDiagnosis = async () => {
        setHasSubmitted(true);
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError('');
        setIsAnalyzing(true);
        setResult(null);

        try {
            const diagnosis = await adapter.runDiagnosis({
                crop: selectedCrop,
                symptoms: symptoms.trim(),
                hasImage: Boolean(imageFile),
                imageFileName: imageFile?.name || '',
            });
            setResult(diagnosis);
        } catch {
            setError(getText(uiText.serviceError));
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <Card className="border-0 shadow-lg" data-testid="disease-diagnosis">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-emerald-600" />
                            {getText(uiText.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{getText(uiText.subtitle)}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {getText(uiText.mockTag)}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(uiText.crop)}</p>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(uiText.crop)} />
                            </SelectTrigger>
                            <SelectContent>
                                {cropOptions.map((crop) => (
                                    <SelectItem key={crop} value={crop}>
                                        {crop}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(uiText.symptoms)}</p>
                        <Textarea
                            value={symptoms}
                            onChange={(event) => {
                                setSymptoms(event.target.value);
                                if (error) setError('');
                                setResult(null);
                            }}
                            placeholder={getText(uiText.symptomsHint)}
                            className="min-h-[40px] h-10 rounded-xl bg-gray-50 border-gray-200 resize-none"
                            data-testid="disease-symptoms-input"
                        />
                    </div>
                </div>

                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                        event.preventDefault();
                        handleImage(event.dataTransfer.files?.[0] || null);
                    }}
                    className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition cursor-pointer p-4"
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImage(event.target.files?.[0] || null)}
                        data-testid="disease-image-input"
                    />

                    {imagePreview ? (
                        <div className="relative">
                            <img src={imagePreview} alt="Diagnosis preview" className="h-44 w-full object-cover rounded-xl" />
                            <div className="absolute left-2 top-2 bg-black/65 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {imageFile?.name || 'image'}
                            </div>
                        </div>
                    ) : (
                        <div className="py-7 text-center">
                            <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-700">{getText(uiText.uploadHint)}</p>
                        </div>
                    )}
                </div>

                <Button
                    onClick={runDiagnosis}
                    disabled={isAnalyzing}
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    data-testid="disease-analyze"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {getText(uiText.analyzing)}
                        </>
                    ) : (
                        <>
                            <Leaf className="w-4 h-4 mr-2" />
                            {getText(uiText.analyze)}
                        </>
                    )}
                </Button>

                {error && (
                    <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700 flex items-start justify-between gap-3">
                        <span className="inline-flex items-center gap-1">
                            <AlertTriangle className="w-4 h-4 mt-0.5" />
                            {error}
                        </span>
                        {hasSubmitted && (
                            <Button size="sm" variant="outline" className="h-7 rounded-lg" onClick={runDiagnosis}>
                                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                                {getText(uiText.retry)}
                            </Button>
                        )}
                    </div>
                )}

                {!isAnalyzing && !result && !error && (
                    <p className="text-xs text-gray-500 mt-3">{getText(uiText.emptyState)}</p>
                )}

                {result && (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-4" data-testid="disease-result">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-gray-900">{getLocalizedText(result.diseaseName, safeLanguage)}</h4>
                            <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                {getText(uiText.confidence)}: {result.confidence}%
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-700">{getLocalizedText(result.summary, safeLanguage)}</p>

                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2">{getText(uiText.treatments)}</p>
                            <div className="grid md:grid-cols-2 gap-2">
                                {result.treatments.map((item) => (
                                    <div key={`${item.type}-${item.title.en}`} className="rounded-xl bg-white p-3 border border-emerald-100">
                                        <p className="font-semibold mb-1 flex items-center gap-1 text-gray-900">
                                            {item.type === 'organic' ? (
                                                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <Pill className="w-3.5 h-3.5 text-amber-600" />
                                            )}
                                            {getLocalizedText(item.title, safeLanguage)}
                                        </p>
                                        <p className="text-sm text-gray-700">{getLocalizedText(item.details, safeLanguage)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2">{getText(uiText.usefulLinks)}</p>
                            <div className="flex flex-wrap gap-2">
                                {result.links.map((link) => (
                                    <Link
                                        key={`${link.to}-${link.label.en}`}
                                        to={link.to}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-white border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-100 transition-colors"
                                    >
                                        {getLocalizedText(link.label, safeLanguage)}
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 flex items-start gap-1">
                            <Bot className="w-3.5 h-3.5 mt-0.5 text-emerald-700" />
                            <span>{getText(uiText.demo)}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
