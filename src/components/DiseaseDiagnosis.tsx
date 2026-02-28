import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Camera, ExternalLink, FlaskConical, Leaf, Loader2, Pill, UploadCloud } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createPageUrl } from '@/utils';
import { useLanguage } from './LanguageContext';

type LocalizedText = {
    hi: string;
    en: string;
};

type DiagnosisLink = {
    label: LocalizedText;
    to: string;
};

type Treatment = {
    type: 'organic' | 'chemical';
    title: LocalizedText;
    details: LocalizedText;
};

type DiagnosisResult = {
    diseaseName: LocalizedText;
    summary: LocalizedText;
    confidence: number;
    treatments: Treatment[];
    links: DiagnosisLink[];
};

type DiseaseDiagnosisProps = {
    crops?: string[];
};

type Scenario = 'fungal' | 'bacterial' | 'pest' | 'nutrient';

const cropDefaults = ['Wheat', 'Rice', 'Cotton', 'Tomato'];

const scenarioKeywords: Record<Scenario, string[]> = {
    fungal: ['spot', 'fungus', 'blight', 'धब्बा', 'फफूंद', 'झुलसा'],
    bacterial: ['water', 'lesion', 'ooze', 'बैक्टीरिया', 'जल जैसा', 'गीला'],
    pest: ['pest', 'insect', 'aphid', 'worm', 'कीट', 'माहू', 'इल्ली'],
    nutrient: ['yellow', 'chlorosis', 'deficiency', 'पीला', 'कमी', 'पोषक'],
};

const diseaseCatalog: Record<Scenario, LocalizedText> = {
    fungal: { hi: 'पत्ती धब्बा संक्रमण', en: 'Leaf Spot Fungal Infection' },
    bacterial: { hi: 'बैक्टीरियल पत्ती झुलसा', en: 'Bacterial Leaf Blight' },
    pest: { hi: 'कीट प्रकोप', en: 'Active Pest Infestation' },
    nutrient: { hi: 'पोषक तत्व कमी', en: 'Nutrient Deficiency Stress' },
};

const summaryCatalog: Record<Scenario, LocalizedText> = {
    fungal: {
        hi: 'पत्तियों पर गोल/अनियमित धब्बे फफूंद संक्रमण की संभावना दिखाते हैं।',
        en: 'Circular or irregular leaf spots indicate a likely fungal spread.',
    },
    bacterial: {
        hi: 'पानी जैसे धब्बे और किनारों से सूखना बैक्टीरियल संक्रमण का संकेत है।',
        en: 'Water-soaked lesions and drying leaf edges suggest bacterial infection.',
    },
    pest: {
        hi: 'पत्तियों पर कटाव और मुड़ाव सक्रिय कीट हमले का संकेत दे रहे हैं।',
        en: 'Chewed leaves and curling patterns suggest an active pest attack.',
    },
    nutrient: {
        hi: 'पत्तियों का पीला होना और नसों का पैटर्न पोषक असंतुलन दिखाता है।',
        en: 'Leaf yellowing with vein contrast points to nutrient imbalance.',
    },
};

const treatmentCatalog: Record<Scenario, Treatment[]> = {
    fungal: [
        {
            type: 'organic',
            title: { hi: 'जैविक स्प्रे', en: 'Organic Spray' },
            details: {
                hi: 'नीम तेल 5 ml/L और ट्राइकोडर्मा आधारित बायो-फफूंदनाशक 5-7 दिन अंतर से स्प्रे करें।',
                en: 'Spray neem oil 5 ml/L and Trichoderma bio-fungicide at 5-7 day intervals.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'रासायनिक प्रबंधन', en: 'Chemical Control' },
            details: {
                hi: 'लेबल अनुसार व्यापक फफूंदनाशक का रोटेशन करें और बारिश से पहले स्प्रे से बचें।',
                en: 'Rotate broad-spectrum fungicides as per label and avoid pre-rain spraying.',
            },
        },
    ],
    bacterial: [
        {
            type: 'organic',
            title: { hi: 'साफ-सफाई और जैविक उपाय', en: 'Sanitation and Organic Action' },
            details: {
                hi: 'संक्रमित पत्तियां हटाएं और कॉपर-संगत जैविक स्प्रे का 4-5 दिन में पुनः प्रयोग करें।',
                en: 'Remove infected leaves and repeat compatible copper-organic spray every 4-5 days.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'लक्षित बैक्टीरिसाइड', en: 'Targeted Bactericide' },
            details: {
                hi: 'अनुशंसित बैक्टीरिसाइड को लेबल मात्रा में सुबह/शाम कम हवा में लागू करें।',
                en: 'Apply recommended bactericide at label dose in low-wind morning/evening windows.',
            },
        },
    ],
    pest: [
        {
            type: 'organic',
            title: { hi: 'नीम और ट्रैप', en: 'Neem and Traps' },
            details: {
                hi: 'नीम बीज अर्क का छिड़काव करें और पीले स्टिकी ट्रैप/फेरोमोन ट्रैप लगाएं।',
                en: 'Use neem seed extract spray and deploy yellow sticky or pheromone traps.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'चयनित कीटनाशक', en: 'Selective Insecticide' },
            details: {
                hi: 'लक्षित कीट के लिए अनुशंसित चयनित कीटनाशक का सही मात्रा में उपयोग करें।',
                en: 'Use a selective insecticide at the recommended dose for the target pest.',
            },
        },
    ],
    nutrient: [
        {
            type: 'organic',
            title: { hi: 'जैविक पुनर्बलन', en: 'Organic Recovery' },
            details: {
                hi: 'कम्पोस्ट टी, ह्यूमिक एसिड और समुद्री शैवाल अर्क का हल्का फोलियर सपोर्ट दें।',
                en: 'Provide mild foliar support using compost tea, humic acid, and seaweed extract.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'संतुलित पोषण', en: 'Balanced Nutrition' },
            details: {
                hi: 'फसल अवस्था के अनुसार NPK और माइक्रोन्यूट्रिएंट फोलियर स्प्रे विभाजित मात्रा में दें।',
                en: 'Apply stage-specific NPK and micronutrient foliar sprays in split doses.',
            },
        },
    ],
};

const staticLinks: DiagnosisLink[] = [
    {
        label: { hi: 'AI चैट से पूछें', en: 'Ask in AI Chat' },
        to: createPageUrl('AIHelp'),
    },
    {
        label: { hi: 'डैशबोर्ड निदान कार्ड', en: 'Dashboard Diagnosis Card' },
        to: `${createPageUrl('Dashboard')}#disease-diagnosis`,
    },
    {
        label: { hi: 'विस्तृत फोटो निदान पेज', en: 'Detailed Photo Diagnosis Page' },
        to: createPageUrl('CropDiagnosis'),
    },
];

const uiText = {
    title: { hi: 'फोटो रोग जांच', en: 'Disease Diagnosis' },
    subtitle: {
        hi: 'फोटो और लक्षण से AI आधारित प्रारंभिक रोग पहचान',
        en: 'AI-assisted initial diagnosis from image and symptoms',
    },
    mockTag: { hi: 'मॉक परिणाम', en: 'Mock Result' },
    crop: { hi: 'फसल चुनें', en: 'Select Crop' },
    symptoms: { hi: 'लक्षण लिखें', en: 'Enter Symptoms' },
    symptomsHint: {
        hi: 'जैसे: पत्तियों पर भूरे धब्बे, पीला पड़ना, कीट दिखना...',
        en: 'e.g. brown spots on leaves, yellowing, visible insects...',
    },
    uploadHint: {
        hi: 'फोटो अपलोड करें (JPG/PNG) - क्लिक करें या ड्रैग करें',
        en: 'Upload image (JPG/PNG) - click or drag here',
    },
    analyze: { hi: 'रोग पहचानें', en: 'Run Diagnosis' },
    analyzing: { hi: 'विश्लेषण हो रहा है...', en: 'Analyzing...' },
    confidence: { hi: 'विश्वास', en: 'Confidence' },
    treatments: { hi: 'उपचार सुझाव', en: 'Treatment Suggestions' },
    usefulLinks: { hi: 'उपयोगी लिंक', en: 'Useful Links' },
    noInput: {
        hi: 'कम से कम फोटो या लक्षण दर्ज करें',
        en: 'Provide at least an image or symptoms',
    },
    demo: {
        hi: 'नोट: यह डेमो AI सलाह है। गंभीर स्थिति में कृषि विशेषज्ञ से पुष्टि करें।',
        en: 'Note: This is a demo AI advisory. Confirm severe cases with an agriculture expert.',
    },
};

const getText = (text: LocalizedText, language: 'hi' | 'en') => text[language] || text.en;

const detectScenario = (symptoms: string, fileName: string): Scenario => {
    const combined = `${symptoms} ${fileName}`.toLowerCase();
    if (scenarioKeywords.pest.some((keyword) => combined.includes(keyword))) return 'pest';
    if (scenarioKeywords.bacterial.some((keyword) => combined.includes(keyword))) return 'bacterial';
    if (scenarioKeywords.nutrient.some((keyword) => combined.includes(keyword))) return 'nutrient';
    return 'fungal';
};

const buildMockResult = (crop: string, symptoms: string, fileName: string): DiagnosisResult => {
    const scenario = detectScenario(symptoms, fileName);
    const confidenceSeed = (crop.length + symptoms.length + fileName.length) % 18;
    const confidence = 80 + confidenceSeed;

    return {
        diseaseName: diseaseCatalog[scenario],
        summary: summaryCatalog[scenario],
        confidence,
        treatments: treatmentCatalog[scenario],
        links: staticLinks,
    };
};

export default function DiseaseDiagnosis({ crops = [] }: DiseaseDiagnosisProps) {
    const { language } = useLanguage();
    const [selectedCrop, setSelectedCrop] = useState(crops[0] || cropDefaults[0]);
    const [symptoms, setSymptoms] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const [error, setError] = useState('');
    const inputRef = useRef<HTMLInputElement | null>(null);

    const cropOptions = useMemo(() => {
        if (crops.length > 0) return crops;
        return cropDefaults;
    }, [crops]);

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

    const handleImage = (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        const nextPreview = URL.createObjectURL(file);
        setImageFile(file);
        setImagePreview(nextPreview);
        setError('');
        setResult(null);
    };

    const handleAnalyze = async () => {
        if (!imageFile && symptoms.trim().length === 0) {
            setError(getText(uiText.noInput, language));
            return;
        }
        setError('');
        setIsAnalyzing(true);
        setResult(null);

        await new Promise((resolve) => window.setTimeout(resolve, 1200));
        const mock = buildMockResult(selectedCrop, symptoms, imageFile?.name || 'symptom-only');
        setResult(mock);
        setIsAnalyzing(false);
    };

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-emerald-600" />
                            {getText(uiText.title, language)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{getText(uiText.subtitle, language)}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {getText(uiText.mockTag, language)}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(uiText.crop, language)}</p>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(uiText.crop, language)} />
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
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(uiText.symptoms, language)}</p>
                        <Textarea
                            value={symptoms}
                            onChange={(event) => {
                                setSymptoms(event.target.value);
                                setResult(null);
                            }}
                            placeholder={getText(uiText.symptomsHint, language)}
                            className="min-h-[40px] h-10 rounded-xl bg-gray-50 border-gray-200 resize-none"
                        />
                    </div>
                </div>

                <div
                    onClick={() => inputRef.current?.click()}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                        event.preventDefault();
                        const dropped = event.dataTransfer.files?.[0];
                        handleImage(dropped || null);
                    }}
                    className="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition cursor-pointer p-4"
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleImage(event.target.files?.[0] || null)}
                    />

                    {imagePreview ? (
                        <div className="relative">
                            <img
                                src={imagePreview}
                                alt="Diagnosis preview"
                                className="h-44 w-full object-cover rounded-xl"
                            />
                            <div className="absolute left-2 top-2 bg-black/65 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {imageFile?.name || 'image'}
                            </div>
                        </div>
                    ) : (
                        <div className="py-7 text-center">
                            <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-700">{getText(uiText.uploadHint, language)}</p>
                        </div>
                    )}
                </div>

                <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {getText(uiText.analyzing, language)}
                        </>
                    ) : (
                        <>
                            <Leaf className="w-4 h-4 mr-2" />
                            {getText(uiText.analyze, language)}
                        </>
                    )}
                </Button>

                {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

                {result && (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-gray-900">{getText(result.diseaseName, language)}</h4>
                            <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                {getText(uiText.confidence, language)}: {result.confidence}%
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-700">{getText(result.summary, language)}</p>

                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2">{getText(uiText.treatments, language)}</p>
                            <div className="grid md:grid-cols-2 gap-2">
                                {result.treatments.map((item) => (
                                    <div key={item.type} className="rounded-xl bg-white p-3 border border-emerald-100">
                                        <p className="font-semibold mb-1 flex items-center gap-1 text-gray-900">
                                            {item.type === 'organic' ? (
                                                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                                            ) : (
                                                <Pill className="w-3.5 h-3.5 text-amber-600" />
                                            )}
                                            {getText(item.title, language)}
                                        </p>
                                        <p className="text-sm text-gray-700">{getText(item.details, language)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2">{getText(uiText.usefulLinks, language)}</p>
                            <div className="flex flex-wrap gap-2">
                                {result.links.map((link) => (
                                    <Link
                                        key={`${link.to}-${getText(link.label, language)}`}
                                        to={link.to}
                                        className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-white border border-emerald-200 rounded-full px-3 py-1 hover:bg-emerald-100 transition-colors"
                                    >
                                        {getText(link.label, language)}
                                        <ExternalLink className="w-3 h-3" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 flex items-start gap-1">
                            <Bot className="w-3.5 h-3.5 mt-0.5 text-emerald-700" />
                            <span>{getText(uiText.demo, language)}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
