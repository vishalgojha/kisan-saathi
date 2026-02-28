import { useEffect, useMemo, useRef, useState, type DragEvent } from 'react';
import { Camera, FlaskConical, Leaf, Loader2, ShieldAlert, UploadCloud } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from './LanguageContext';

type DiagnosisResult = {
    diseaseNameEn: string;
    diseaseNameHi: string;
    confidence: number;
    summaryEn: string;
    summaryHi: string;
    immediateActionsEn: string[];
    immediateActionsHi: string[];
    organicAdviceEn: string;
    organicAdviceHi: string;
    chemicalAdviceEn: string;
    chemicalAdviceHi: string;
    preventionEn: string;
    preventionHi: string;
};

type DiseaseDiagnosisProps = {
    crops?: string[];
};

const issueTypeOptions = [
    { value: 'leaf_spot', en: 'Leaf Spots', hi: 'पत्ती धब्बे' },
    { value: 'blight', en: 'Blight', hi: 'झुलसा रोग' },
    { value: 'pest', en: 'Pest Damage', hi: 'कीट नुकसान' },
    { value: 'nutrient', en: 'Nutrient Deficiency', hi: 'पोषक तत्व कमी' }
];

const cropDiseaseNames: Record<string, Record<string, { en: string; hi: string }>> = {
    wheat: {
        leaf_spot: { en: 'Alternaria Leaf Blight', hi: 'अल्टरनेरिया पत्ती झुलसा' },
        blight: { en: 'Wheat Blight Complex', hi: 'गेहूं झुलसा कॉम्प्लेक्स' },
        pest: { en: 'Aphid Infestation', hi: 'माहू कीट प्रकोप' },
        nutrient: { en: 'Nitrogen Deficiency', hi: 'नाइट्रोजन की कमी' }
    },
    rice: {
        leaf_spot: { en: 'Brown Spot Disease', hi: 'ब्राउन स्पॉट रोग' },
        blight: { en: 'Bacterial Leaf Blight', hi: 'बैक्टीरियल लीफ ब्लाइट' },
        pest: { en: 'Stem Borer Attack', hi: 'तना छेदक प्रकोप' },
        nutrient: { en: 'Potassium Deficiency', hi: 'पोटाश की कमी' }
    },
    tomato: {
        leaf_spot: { en: 'Septoria Leaf Spot', hi: 'सेप्टोरिया लीफ स्पॉट' },
        blight: { en: 'Early Blight', hi: 'अर्ली ब्लाइट' },
        pest: { en: 'Whitefly Damage', hi: 'सफेद मक्खी नुकसान' },
        nutrient: { en: 'Calcium Deficiency', hi: 'कैल्शियम की कमी' }
    },
    default: {
        leaf_spot: { en: 'Leaf Spot Infection', hi: 'पत्ती धब्बा संक्रमण' },
        blight: { en: 'Blight-like Symptoms', hi: 'झुलसा जैसे लक्षण' },
        pest: { en: 'Insect Pest Injury', hi: 'कीट क्षति' },
        nutrient: { en: 'Nutrient Stress', hi: 'पोषक तनाव' }
    }
};

const issueAdvisory: Record<string, Omit<DiagnosisResult, 'diseaseNameEn' | 'diseaseNameHi' | 'confidence'>> = {
    leaf_spot: {
        summaryEn: 'Visible circular spots suggest early fungal spread on leaf surface.',
        summaryHi: 'पत्तियों पर गोल धब्बे प्रारंभिक फफूंदी संक्रमण का संकेत देते हैं।',
        immediateActionsEn: [
            'Remove heavily infected leaves from the field.',
            'Avoid overhead irrigation for the next 2 days.',
            'Start a preventive spray window in evening hours.'
        ],
        immediateActionsHi: [
            'ज्यादा संक्रमित पत्तियां खेत से हटाएं।',
            'अगले 2 दिन ऊपर से सिंचाई न करें।',
            'शाम के समय सुरक्षात्मक छिड़काव शुरू करें।'
        ],
        organicAdviceEn: 'Use neem oil (5 ml/L) with mild soap emulsifier every 5-7 days.',
        organicAdviceHi: 'नीम तेल (5 ml/L) को हल्के साबुन के साथ 5-7 दिन में स्प्रे करें।',
        chemicalAdviceEn: 'Use a broad-spectrum fungicide as per label dosage and interval.',
        chemicalAdviceHi: 'लेबल मात्रा के अनुसार व्यापक फफूंदनाशक का उपयोग करें।',
        preventionEn: 'Maintain wider spacing and remove crop residue to reduce humidity pockets.',
        preventionHi: 'पौध दूरी सही रखें और अवशेष हटाएं ताकि नमी कम फंसे।'
    },
    blight: {
        summaryEn: 'Lesion spread pattern indicates possible blight progression risk.',
        summaryHi: 'धब्बों का फैलाव झुलसा रोग के बढ़ने का संकेत देता है।',
        immediateActionsEn: [
            'Isolate affected patch for close monitoring.',
            'Skip irrigation if rainfall probability is high.',
            'Begin targeted fungicide schedule quickly.'
        ],
        immediateActionsHi: [
            'प्रभावित हिस्से की अलग निगरानी करें।',
            'बारिश संभावना अधिक हो तो सिंचाई रोकें।',
            'लक्षित फफूंदनाशक शेड्यूल जल्दी शुरू करें।'
        ],
        organicAdviceEn: 'Use Trichoderma-based bio-fungicide in soil and foliar program.',
        organicAdviceHi: 'ट्राइकोडर्मा आधारित बायो-फफूंदनाशक मिट्टी और पत्तियों पर उपयोग करें।',
        chemicalAdviceEn: 'Use systemic + contact fungicide rotation to prevent resistance.',
        chemicalAdviceHi: 'रेजिस्टेंस रोकने के लिए सिस्टमिक और कॉन्टैक्ट फफूंदनाशक का रोटेशन करें।',
        preventionEn: 'Avoid late-evening irrigation and keep canopy aerated.',
        preventionHi: 'देर शाम सिंचाई से बचें और फसल में हवा का प्रवाह बनाए रखें।'
    },
    pest: {
        summaryEn: 'Leaf bite marks and discoloration suggest active pest feeding.',
        summaryHi: 'पत्तियों पर काटने के निशान और रंग बदलाव सक्रिय कीट का संकेत हैं।',
        immediateActionsEn: [
            'Inspect lower leaf surfaces and stem joints immediately.',
            'Install pheromone or yellow sticky traps.',
            'Spray only in low-wind conditions.'
        ],
        immediateActionsHi: [
            'पत्तियों के नीचे और तनों की गांठों की तुरंत जांच करें।',
            'फेरोमोन या येलो स्टिकी ट्रैप लगाएं।',
            'कम हवा में ही छिड़काव करें।'
        ],
        organicAdviceEn: 'Use neem seed kernel extract and repeat after 4-5 days.',
        organicAdviceHi: 'नीम बीज अर्क का उपयोग करें और 4-5 दिन बाद दोहराएं।',
        chemicalAdviceEn: 'Use selective insecticide as per recommended dose for target pest.',
        chemicalAdviceHi: 'लक्षित कीट के लिए अनुशंसित मात्रा में चयनित कीटनाशक प्रयोग करें।',
        preventionEn: 'Weekly scouting and trap-based monitoring reduce sudden outbreaks.',
        preventionHi: 'साप्ताहिक निगरानी और ट्रैप से अचानक प्रकोप कम होते हैं।'
    },
    nutrient: {
        summaryEn: 'Color fade and vein pattern indicate nutrient imbalance stress.',
        summaryHi: 'रंग हल्का पड़ना और नसों का पैटर्न पोषक असंतुलन दर्शाता है।',
        immediateActionsEn: [
            'Check recent fertilizer schedule and irrigation gaps.',
            'Apply balanced foliar feed in split doses.',
            'Collect soil sample for confirmation if issue persists.'
        ],
        immediateActionsHi: [
            'हाल की उर्वरक योजना और सिंचाई अंतर जांचें।',
            'संतुलित फोलियर फीड को भागों में दें।',
            'समस्या बनी रहे तो मिट्टी नमूना जांचें।'
        ],
        organicAdviceEn: 'Apply compost tea + seaweed extract for mild recovery support.',
        organicAdviceHi: 'हल्की रिकवरी के लिए कम्पोस्ट टी और सीवीड अर्क दें।',
        chemicalAdviceEn: 'Use crop-stage specific NPK + micronutrient foliar spray.',
        chemicalAdviceHi: 'फसल अवस्था के अनुसार NPK और सूक्ष्म पोषक फोलियर स्प्रे दें।',
        preventionEn: 'Follow soil-test-based fertilization and avoid single nutrient overuse.',
        preventionHi: 'मिट्टी परीक्षण आधारित पोषण दें और एक ही तत्व का अति प्रयोग न करें।'
    }
};

const normalizeCropKey = (crop: string) => (crop || '').trim().toLowerCase();

function buildMockResult(crop: string, issueType: string, fileName: string): DiagnosisResult {
    const cropKey = normalizeCropKey(crop);
    const cropMap = cropDiseaseNames[cropKey] || cropDiseaseNames.default;
    const disease = cropMap[issueType] || cropDiseaseNames.default[issueType];
    const advisory = issueAdvisory[issueType] || issueAdvisory.leaf_spot;
    const confidenceSeed = (fileName.length + cropKey.length + issueType.length) % 12;

    return {
        diseaseNameEn: disease.en,
        diseaseNameHi: disease.hi,
        confidence: 78 + confidenceSeed,
        ...advisory
    };
}

export default function DiseaseDiagnosis({ crops = [] }: DiseaseDiagnosisProps) {
    const { language } = useLanguage();
    const [selectedCrop, setSelectedCrop] = useState(crops[0] || 'Wheat');
    const [issueType, setIssueType] = useState('leaf_spot');
    const [previewUrl, setPreviewUrl] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<DiagnosisResult | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const cropOptions = useMemo(() => {
        if (crops.length === 0) return ['Wheat', 'Rice', 'Tomato'];
        return crops;
    }, [crops]);

    const content = {
        title: { hi: 'फोटो रोग जांच', en: 'Photo Disease Diagnosis' },
        subtitle: {
            hi: 'फसल फोटो अपलोड करें और AI आधारित प्रारंभिक सलाह पाएं',
            en: 'Upload crop photo and get AI-assisted initial advisory'
        },
        uploadHint: {
            hi: 'फोटो खींचें और यहां छोड़ें, या चुनने के लिए क्लिक करें',
            en: 'Drag and drop a photo here, or click to browse'
        },
        analyze: { hi: 'AI से जांच करें', en: 'Analyze with AI' },
        analyzing: { hi: 'विश्लेषण जारी...', en: 'Analyzing image...' },
        chooseCrop: { hi: 'फसल चुनें', en: 'Select Crop' },
        symptomType: { hi: 'समस्या प्रकार', en: 'Issue Type' },
        confidence: { hi: 'विश्वास स्तर', en: 'Confidence' },
        immediateAction: { hi: 'तुरंत क्या करें', en: 'Immediate Actions' },
        organic: { hi: 'जैविक विकल्प', en: 'Organic Option' },
        chemical: { hi: 'रासायनिक विकल्प', en: 'Chemical Option' },
        prevention: { hi: 'रोकथाम', en: 'Prevention' },
        demoNote: {
            hi: 'यह डेमो AI सलाह है। गंभीर स्थिति में स्थानीय कृषि विशेषज्ञ से पुष्टि करें।',
            en: 'This is a demo AI advisory. For severe cases, confirm with a local agri expert.'
        }
    };

    const getText = (obj: { hi: string; en: string }) => obj[language] || obj.en;

    const handleFile = (file: File | null) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(url);
        setImageFile(file);
        setResult(null);
    };

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const onDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setIsDragging(false);
        const file = event.dataTransfer.files?.[0];
        handleFile(file || null);
    };

    const runDiagnosis = async () => {
        if (!imageFile) return;
        setIsAnalyzing(true);
        setResult(null);
        await new Promise((resolve) => setTimeout(resolve, 1400));
        const mock = buildMockResult(selectedCrop, issueType, imageFile.name);
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
                            {getText(content.title)}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{getText(content.subtitle)}</p>
                    </div>
                    <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200">
                        AI Mock
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-3 mb-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.chooseCrop)}</p>
                        <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.chooseCrop)} />
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
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.symptomType)}</p>
                        <Select value={issueType} onValueChange={setIssueType}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.symptomType)} />
                            </SelectTrigger>
                            <SelectContent>
                                {issueTypeOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {language === 'hi' ? item.hi : item.en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div
                    onDragOver={(event) => {
                        event.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={onDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`rounded-2xl border-2 border-dashed p-4 transition cursor-pointer ${
                        isDragging ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => handleFile(event.target.files?.[0] || null)}
                    />

                    {previewUrl ? (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Crop preview"
                                className="h-44 w-full object-cover rounded-xl"
                            />
                            <div className="absolute left-2 top-2 bg-black/60 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                <Camera className="w-3 h-3" />
                                {imageFile?.name || 'image'}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-6">
                            <UploadCloud className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                            <p className="text-sm text-gray-700">{getText(content.uploadHint)}</p>
                        </div>
                    )}
                </div>

                <Button
                    onClick={runDiagnosis}
                    disabled={!imageFile || isAnalyzing}
                    className="w-full mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            {getText(content.analyzing)}
                        </>
                    ) : (
                        <>
                            <Leaf className="w-4 h-4 mr-2" />
                            {getText(content.analyze)}
                        </>
                    )}
                </Button>

                {result && (
                    <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-gray-900">
                                {language === 'hi' ? result.diseaseNameHi : result.diseaseNameEn}
                            </h4>
                            <Badge className="bg-white text-emerald-700 border border-emerald-200">
                                {getText(content.confidence)}: {result.confidence}%
                            </Badge>
                        </div>

                        <p className="text-sm text-gray-700">
                            {language === 'hi' ? result.summaryHi : result.summaryEn}
                        </p>

                        <div>
                            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                {getText(content.immediateAction)}
                            </p>
                            <ul className="text-sm text-gray-700 space-y-1 list-disc pl-5">
                                {(language === 'hi' ? result.immediateActionsHi : result.immediateActionsEn).map((item) => (
                                    <li key={item}>{item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid md:grid-cols-2 gap-2 text-sm">
                            <div className="rounded-xl bg-white p-3 border border-emerald-100">
                                <p className="font-semibold text-emerald-700 mb-1">{getText(content.organic)}</p>
                                <p className="text-gray-700">{language === 'hi' ? result.organicAdviceHi : result.organicAdviceEn}</p>
                            </div>
                            <div className="rounded-xl bg-white p-3 border border-emerald-100">
                                <p className="font-semibold text-amber-700 mb-1">{getText(content.chemical)}</p>
                                <p className="text-gray-700">{language === 'hi' ? result.chemicalAdviceHi : result.chemicalAdviceEn}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-600">
                            <span className="font-semibold">{getText(content.prevention)}: </span>
                            {language === 'hi' ? result.preventionHi : result.preventionEn}
                        </p>
                        <p className="text-xs text-gray-500">{getText(content.demoNote)}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
