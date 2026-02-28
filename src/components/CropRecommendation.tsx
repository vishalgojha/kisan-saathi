import { useMemo, useState } from 'react';
import { Leaf, Sprout } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from './LanguageContext';

type CropRecommendationProps = {
    defaultState?: string;
};

type SoilType = 'alluvial' | 'black' | 'red' | 'sandy' | 'laterite' | 'loamy' | 'clay';
type SeasonType = 'kharif' | 'rabi' | 'zaid';

type CropRecommendationRow = {
    crop: { en: string; hi: string };
    states: string[];
    soils: SoilType[];
    seasons: SeasonType[];
    suitabilityScore: number;
    expectedYield: { en: string; hi: string };
    plantingTips: { en: string[]; hi: string[] };
};

const stateOptions = [
    'Madhya Pradesh',
    'Maharashtra',
    'Uttar Pradesh',
    'Rajasthan',
    'Punjab',
    'Haryana',
    'Gujarat',
    'Karnataka'
];

const soilOptions: { value: SoilType; en: string; hi: string }[] = [
    { value: 'alluvial', en: 'Alluvial', hi: 'जलोढ़ मिट्टी' },
    { value: 'black', en: 'Black Soil', hi: 'काली मिट्टी' },
    { value: 'red', en: 'Red Soil', hi: 'लाल मिट्टी' },
    { value: 'sandy', en: 'Sandy Soil', hi: 'बलुई मिट्टी' },
    { value: 'laterite', en: 'Laterite', hi: 'लेटराइट मिट्टी' },
    { value: 'loamy', en: 'Loamy', hi: 'दोमट मिट्टी' },
    { value: 'clay', en: 'Clay Soil', hi: 'चिकनी मिट्टी' }
];

const seasonOptions: { value: SeasonType; en: string; hi: string }[] = [
    { value: 'kharif', en: 'Kharif', hi: 'खरीफ' },
    { value: 'rabi', en: 'Rabi', hi: 'रबी' },
    { value: 'zaid', en: 'Zaid', hi: 'जायद' }
];

const recommendations: CropRecommendationRow[] = [
    {
        crop: { en: 'Wheat', hi: 'गेहूं' },
        states: ['Madhya Pradesh', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Rajasthan'],
        soils: ['alluvial', 'loamy', 'black'],
        seasons: ['rabi'],
        suitabilityScore: 92,
        expectedYield: { en: '38-48 q/ha', hi: '38-48 क्विंटल/हेक्टेयर' },
        plantingTips: {
            en: ['Sow in rows with 20-22 cm spacing.', 'Irrigate at CRI and grain-filling stage.'],
            hi: ['20-22 सेमी कतार दूरी पर बुवाई करें।', 'CRI और दाना भरने के चरण पर सिंचाई करें।']
        }
    },
    {
        crop: { en: 'Rice', hi: 'धान' },
        states: ['Uttar Pradesh', 'Madhya Pradesh', 'Maharashtra', 'Karnataka'],
        soils: ['alluvial', 'clay', 'loamy'],
        seasons: ['kharif'],
        suitabilityScore: 88,
        expectedYield: { en: '45-60 q/ha', hi: '45-60 क्विंटल/हेक्टेयर' },
        plantingTips: {
            en: ['Maintain standing water during early growth.', 'Split nitrogen in 3 doses.'],
            hi: ['शुरुआती वृद्धि में नियंत्रित पानी बनाए रखें।', 'नाइट्रोजन को 3 खुराक में दें।']
        }
    },
    {
        crop: { en: 'Soybean', hi: 'सोयाबीन' },
        states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan'],
        soils: ['black', 'loamy'],
        seasons: ['kharif'],
        suitabilityScore: 90,
        expectedYield: { en: '18-25 q/ha', hi: '18-25 क्विंटल/हेक्टेयर' },
        plantingTips: {
            en: ['Use treated seeds and proper drainage.', 'Avoid waterlogging during flowering.'],
            hi: ['बीज उपचार करें और अच्छा जल निकास रखें।', 'फूल आने पर जलभराव से बचें।']
        }
    },
    {
        crop: { en: 'Mustard', hi: 'सरसों' },
        states: ['Rajasthan', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh'],
        soils: ['alluvial', 'sandy', 'loamy'],
        seasons: ['rabi'],
        suitabilityScore: 85,
        expectedYield: { en: '14-20 q/ha', hi: '14-20 क्विंटल/हेक्टेयर' },
        plantingTips: {
            en: ['Sow in moisture-conserved soil.', 'Keep aphid monitoring from vegetative stage.'],
            hi: ['नमी-संरक्षित मिट्टी में बुवाई करें।', 'वेजिटेटिव चरण से माहू की निगरानी करें।']
        }
    },
    {
        crop: { en: 'Maize', hi: 'मक्का' },
        states: ['Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Uttar Pradesh'],
        soils: ['red', 'alluvial', 'loamy'],
        seasons: ['kharif', 'zaid'],
        suitabilityScore: 82,
        expectedYield: { en: '35-55 q/ha', hi: '35-55 क्विंटल/हेक्टेयर' },
        plantingTips: {
            en: ['Ensure balanced NPK and zinc application.', 'Use timely weeding in first 35 days.'],
            hi: ['संतुलित NPK और जिंक का प्रयोग करें।', 'पहले 35 दिनों में समय पर निराई करें।']
        }
    }
];

const scoreColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    if (score >= 80) return 'bg-amber-100 text-amber-700 border-amber-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
};

export default function CropRecommendation({ defaultState = 'Madhya Pradesh' }: CropRecommendationProps) {
    const { language } = useLanguage();
    const [selectedState, setSelectedState] = useState(defaultState);
    const [selectedSoil, setSelectedSoil] = useState<SoilType>('alluvial');
    const [selectedSeason, setSelectedSeason] = useState<SeasonType>('kharif');

    const content = {
        title: { hi: 'फसल सिफारिश', en: 'Crop Recommendation' },
        subtitle: { hi: 'मिट्टी, मौसम और राज्य के आधार पर उपयुक्त फसलें', en: 'Suited crops by soil, season, and state' },
        state: { hi: 'राज्य', en: 'State' },
        soil: { hi: 'मिट्टी प्रकार', en: 'Soil Type' },
        season: { hi: 'सीजन', en: 'Season' },
        score: { hi: 'उपयुक्तता स्कोर', en: 'Suitability Score' },
        yield: { hi: 'अनुमानित उत्पादन', en: 'Expected Yield' },
        tips: { hi: 'रोपण सुझाव', en: 'Planting Tips' },
        note: {
            hi: 'डेमो सिफारिशें: अंतिम निर्णय से पहले स्थानीय कृषि विशेषज्ञ से सलाह लें।',
            en: 'Demo recommendations: confirm with local agri experts before final decisions.'
        }
    };

    const getText = (obj: { hi: string; en: string }) => obj[language] || obj.en;

    const suitedCrops = useMemo(() => {
        return recommendations
            .filter((item) =>
                item.states.includes(selectedState) &&
                item.soils.includes(selectedSoil) &&
                item.seasons.includes(selectedSeason)
            )
            .sort((a, b) => b.suitabilityScore - a.suitabilityScore);
    }, [selectedState, selectedSoil, selectedSeason]);

    return (
        <Card className="border-0 shadow-lg">
            <CardContent className="p-5">
                <div className="mb-4">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-emerald-600" />
                        {getText(content.title)}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">{getText(content.subtitle)}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.state)}</p>
                        <Select value={selectedState} onValueChange={setSelectedState}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.state)} />
                            </SelectTrigger>
                            <SelectContent>
                                {stateOptions.map((state) => (
                                    <SelectItem key={state} value={state}>
                                        {state}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.soil)}</p>
                        <Select value={selectedSoil} onValueChange={(value: SoilType) => setSelectedSoil(value)}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.soil)} />
                            </SelectTrigger>
                            <SelectContent>
                                {soilOptions.map((soil) => (
                                    <SelectItem key={soil.value} value={soil.value}>
                                        {language === 'hi' ? soil.hi : soil.en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">{getText(content.season)}</p>
                        <Select value={selectedSeason} onValueChange={(value: SeasonType) => setSelectedSeason(value)}>
                            <SelectTrigger className="h-10 rounded-xl bg-gray-50 border-gray-200">
                                <SelectValue placeholder={getText(content.season)} />
                            </SelectTrigger>
                            <SelectContent>
                                {seasonOptions.map((season) => (
                                    <SelectItem key={season.value} value={season.value}>
                                        {language === 'hi' ? season.hi : season.en}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-3">
                    {suitedCrops.map((item) => (
                        <div key={item.crop.en} className="rounded-xl border border-gray-100 bg-white p-4">
                            <div className="flex items-start justify-between gap-2">
                                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                    <Leaf className="w-4 h-4 text-emerald-600" />
                                    {language === 'hi' ? item.crop.hi : item.crop.en}
                                </h4>
                                <Badge className={`border ${scoreColor(item.suitabilityScore)}`}>
                                    {getText(content.score)}: {item.suitabilityScore}%
                                </Badge>
                            </div>

                            <p className="text-sm text-gray-700 mt-2">
                                <span className="font-semibold">{getText(content.yield)}: </span>
                                {language === 'hi' ? item.expectedYield.hi : item.expectedYield.en}
                            </p>

                            <div className="mt-3 rounded-lg bg-emerald-50/60 border border-emerald-100 p-3">
                                <p className="text-xs font-semibold text-emerald-700 mb-1">{getText(content.tips)}</p>
                                <ul className="text-sm text-gray-700 list-disc pl-5 space-y-1">
                                    {(language === 'hi' ? item.plantingTips.hi : item.plantingTips.en).map((tip) => (
                                        <li key={tip}>{tip}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {suitedCrops.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                        {language === 'hi'
                            ? 'इस चयन के लिए उपयुक्त फसल नहीं मिली।'
                            : 'No suited crops found for this selection.'}
                    </p>
                )}

                <p className="text-xs text-gray-500 mt-4">{getText(content.note)}</p>
            </CardContent>
        </Card>
    );
}
