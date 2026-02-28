import { appClient } from '@/api/appClient';
import { createPageUrl } from '@/utils';
import { getDataMode } from './dataMode';
import type { LocalizedText } from './types/common';

export type DiagnosisTreatment = {
    type: 'organic' | 'chemical';
    title: LocalizedText;
    details: LocalizedText;
};

export type DiagnosisLink = {
    label: LocalizedText;
    to: string;
};

export type DiagnosisResult = {
    diseaseName: LocalizedText;
    summary: LocalizedText;
    confidence: number;
    treatments: DiagnosisTreatment[];
    links: DiagnosisLink[];
};

export type DiagnosisRequest = {
    crop: string;
    symptoms: string;
    hasImage: boolean;
    imageFileName: string;
};

export interface DiagnosisAdapter {
    runDiagnosis: (request: DiagnosisRequest) => Promise<DiagnosisResult>;
}

type Scenario = 'fungal' | 'bacterial' | 'pest' | 'nutrient';

const scenarioKeywords: Record<Scenario, string[]> = {
    fungal: ['spot', 'fungus', 'blight', 'धब्बा', 'फफूंद', 'झुलसा'],
    bacterial: ['water', 'lesion', 'ooze', 'बैक्टीरिया', 'गीला'],
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
        hi: 'पत्तियों पर धब्बे फफूंद संक्रमण की ओर संकेत करते हैं।',
        en: 'Leaf spotting pattern indicates likely fungal spread.',
    },
    bacterial: {
        hi: 'गीले धब्बे और किनारों का सूखना बैक्टीरियल संक्रमण दिखाता है।',
        en: 'Water-soaked lesions and edge burn suggest bacterial infection.',
    },
    pest: {
        hi: 'पत्तियों में कटाव और मुड़ाव सक्रिय कीट हमले का संकेत है।',
        en: 'Chewed leaves and curling indicate active pest attack.',
    },
    nutrient: {
        hi: 'पत्तियों का पीला होना पोषक असंतुलन का संकेत है।',
        en: 'Leaf yellowing indicates nutrient imbalance.',
    },
};

const treatmentsCatalog: Record<Scenario, DiagnosisTreatment[]> = {
    fungal: [
        {
            type: 'organic',
            title: { hi: 'जैविक स्प्रे', en: 'Organic Spray' },
            details: {
                hi: 'नीम तेल और ट्राइकोडर्मा आधारित जैविक फफूंदनाशक 5-7 दिन अंतराल पर दें।',
                en: 'Apply neem oil and Trichoderma bio-fungicide every 5-7 days.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'रासायनिक प्रबंधन', en: 'Chemical Control' },
            details: {
                hi: 'लेबल मात्रा में फफूंदनाशक का रोटेशन करें और बारिश से पहले स्प्रे न करें।',
                en: 'Rotate fungicides at label dose and avoid spraying before rain.',
            },
        },
    ],
    bacterial: [
        {
            type: 'organic',
            title: { hi: 'संक्रमित भाग हटाएं', en: 'Remove Infected Leaves' },
            details: {
                hi: 'संक्रमित पत्तियां हटाकर जैविक कॉपर-संगत स्प्रे दें।',
                en: 'Remove infected leaves and apply compatible copper-organic spray.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'बैक्टीरिसाइड', en: 'Bactericide Spray' },
            details: {
                hi: 'अनुशंसित बैक्टीरिसाइड कम हवा में सुबह/शाम लगाएं।',
                en: 'Apply recommended bactericide in low-wind morning or evening.',
            },
        },
    ],
    pest: [
        {
            type: 'organic',
            title: { hi: 'नीम + ट्रैप', en: 'Neem + Traps' },
            details: {
                hi: 'नीम बीज अर्क स्प्रे करें और स्टिकी/फेरोमोन ट्रैप लगाएं।',
                en: 'Spray neem seed extract and deploy sticky/pheromone traps.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'चयनित कीटनाशक', en: 'Selective Insecticide' },
            details: {
                hi: 'लक्षित कीट हेतु अनुशंसित चयनित कीटनाशक उचित मात्रा में दें।',
                en: 'Use selective insecticide for the target pest at recommended dose.',
            },
        },
    ],
    nutrient: [
        {
            type: 'organic',
            title: { hi: 'जैविक रिकवरी', en: 'Organic Recovery' },
            details: {
                hi: 'कम्पोस्ट टी, ह्यूमिक एसिड और समुद्री शैवाल अर्क का हल्का सपोर्ट दें।',
                en: 'Provide mild support with compost tea, humic acid, and seaweed extract.',
            },
        },
        {
            type: 'chemical',
            title: { hi: 'संतुलित पोषण', en: 'Balanced Nutrition' },
            details: {
                hi: 'फसल अवस्था के अनुसार NPK + माइक्रोन्यूट्रिएंट फोलियर स्प्रे दें।',
                en: 'Apply stage-specific NPK and micronutrient foliar sprays.',
            },
        },
    ],
};

const resultLinks: DiagnosisLink[] = [
    {
        label: { hi: 'AI चैट से पूछें', en: 'Ask in AI Chat' },
        to: createPageUrl('AIHelp'),
    },
    {
        label: { hi: 'डैशबोर्ड निदान कार्ड', en: 'Dashboard Diagnosis Card' },
        to: `${createPageUrl('Dashboard')}#disease-diagnosis`,
    },
    {
        label: { hi: 'विस्तृत फोटो निदान', en: 'Detailed Photo Diagnosis' },
        to: createPageUrl('CropDiagnosis'),
    },
];

const detectScenario = (request: DiagnosisRequest): Scenario => {
    const combined = `${request.symptoms} ${request.imageFileName}`.toLowerCase();
    if (scenarioKeywords.pest.some((keyword) => combined.includes(keyword))) return 'pest';
    if (scenarioKeywords.bacterial.some((keyword) => combined.includes(keyword))) return 'bacterial';
    if (scenarioKeywords.nutrient.some((keyword) => combined.includes(keyword))) return 'nutrient';
    return 'fungal';
};

const mockDiagnosisAdapter: DiagnosisAdapter = {
    async runDiagnosis(request) {
        const scenario = detectScenario(request);
        const seed = (request.crop.length + request.symptoms.length + request.imageFileName.length) % 18;
        const confidenceBase = request.hasImage ? 82 : 75;

        return {
            diseaseName: diseaseCatalog[scenario],
            summary: summaryCatalog[scenario],
            confidence: confidenceBase + seed,
            treatments: treatmentsCatalog[scenario],
            links: resultLinks,
        };
    },
};

const parseLiveDiagnosis = (payload: Record<string, any>, request: DiagnosisRequest): DiagnosisResult => {
    const diagnosis = payload?.diagnosis || {};
    const organic = Array.isArray(payload?.organic_treatments) ? payload.organic_treatments : [];
    const chemical = Array.isArray(payload?.chemical_treatments) ? payload.chemical_treatments : [];
    const severity = String(diagnosis?.severity || '').toLowerCase();
    const severityScore = severity.includes('severe') ? 91 : severity.includes('moderate') ? 84 : 78;

    const treatments: DiagnosisTreatment[] = [];
    if (organic[0]) {
        treatments.push({
            type: 'organic',
            title: {
                en: String(organic[0].name_en || 'Organic Treatment'),
                hi: String(organic[0].name_hi || organic[0].name_en || 'जैविक उपचार'),
            },
            details: {
                en: String(organic[0].application_en || organic[0].tips_en || 'Follow recommended organic treatment.'),
                hi: String(organic[0].application_hi || organic[0].tips_hi || 'अनुशंसित जैविक उपचार अपनाएं।'),
            },
        });
    }
    if (chemical[0]) {
        treatments.push({
            type: 'chemical',
            title: {
                en: String(chemical[0].product_name || 'Chemical Treatment'),
                hi: String(chemical[0].product_name || 'रासायनिक उपचार'),
            },
            details: {
                en: String(chemical[0].precautions_en || chemical[0].application_method_en || 'Use the recommended chemical treatment dose.'),
                hi: String(chemical[0].precautions_hi || chemical[0].application_method_hi || 'अनुशंसित रासायनिक उपचार मात्रा का उपयोग करें।'),
            },
        });
    }

    if (treatments.length === 0) {
        const scenario = detectScenario(request);
        treatments.push(...treatmentsCatalog[scenario]);
    }

    return {
        diseaseName: {
            en: String(diagnosis?.problem_name_en || `${request.crop} issue`),
            hi: String(diagnosis?.problem_name_hi || `${request.crop} समस्या`),
        },
        summary: {
            en: String(diagnosis?.cause_en || payload?.additional_advice?.en || 'No diagnosis summary available.'),
            hi: String(diagnosis?.cause_hi || payload?.additional_advice?.hi || 'रोग का सारांश उपलब्ध नहीं है।'),
        },
        confidence: Math.min(98, severityScore + (request.hasImage ? 4 : 0)),
        treatments,
        links: resultLinks,
    };
};

const liveDiagnosisAdapter: DiagnosisAdapter = {
    async runDiagnosis(request) {
        const response = await appClient.functions.invoke('diagnoseCropDisease', {
            crop_name: request.crop,
            symptoms: request.symptoms,
            image_url: '',
        });
        const payload = response?.data?.data;
        if (!payload || typeof payload !== 'object') {
            throw new Error('No diagnosis payload received');
        }
        return parseLiveDiagnosis(payload, request);
    },
};

export const createDiagnosisAdapter = (): DiagnosisAdapter => {
    if (getDataMode() === 'live') return liveDiagnosisAdapter;
    return mockDiagnosisAdapter;
};
