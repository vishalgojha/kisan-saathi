import React, { useState } from 'react';
import { MapPin, Wheat, Save, Loader2, ChevronsUpDown, Check } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export default function ProfileSetup({ onSave, language }) {
    const [location, setLocation] = useState('');
    const [state, setState] = useState('');
    const [crops, setCrops] = useState([]);
    const [saving, setSaving] = useState(false);
    const [stateOpen, setStateOpen] = useState(false);
    const [districtOpen, setDistrictOpen] = useState(false);

    const getText = (obj) => obj?.[language] || obj?.en || '';

    const content = {
        title: { hi: 'अपना प्रोफाइल सेट करें', en: 'Set Up Your Profile' },
        subtitle: { hi: 'व्यक्तिगत डैशबोर्ड के लिए जानकारी दें', en: 'Provide info for personalized dashboard' },
        district: { hi: 'आपका जिला', en: 'Your District' },
        state: { hi: 'राज्य', en: 'State' },
        crops: { hi: 'आपकी फसलें', en: 'Your Crops' },
        save: { hi: 'सेव करें', en: 'Save Profile' }
    };

    const stateDistricts = {
        'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Anantapur', 'Rajahmundry'],
        'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Ara', 'Begusarai'],
        'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Jagdalpur', 'Raigarh'],
        'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
        'Goa': ['North Goa', 'South Goa'],
        'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar'],
        'Haryana': ['Faridabad', 'Gurgaon', 'Hisar', 'Rohtak', 'Panipat', 'Karnal', 'Sonipat', 'Ambala'],
        'Himachal Pradesh': ['Shimla', 'Kangra', 'Mandi', 'Solan', 'Kullu', 'Hamirpur', 'Una', 'Bilaspur'],
        'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh'],
        'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Bellary', 'Tumkur'],
        'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur'],
        'Madhya Pradesh': ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Ratlam', 'Satna'],
        'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur'],
        'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak'],
        'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Hoshiarpur', 'Moga'],
        'Rajasthan': ['Jaipur', 'Jodhpur', 'Kota', 'Udaipur', 'Ajmer', 'Bikaner', 'Alwar', 'Bhilwara'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode'],
        'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar', 'Mahbubnagar', 'Nalgonda', 'Medak'],
        'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Allahabad', 'Bareilly'],
        'Uttarakhand': ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital'],
        'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Kharagpur']
    };
    
    const states = Object.keys(stateDistricts).sort();
    const districts = state ? (stateDistricts[state] || []) : [];

    const availableCrops = [
        { hi: 'गेहूं', en: 'Wheat' },
        { hi: 'धान', en: 'Rice' },
        { hi: 'सोयाबीन', en: 'Soybean' },
        { hi: 'चना', en: 'Gram' },
        { hi: 'मक्का', en: 'Maize' },
        { hi: 'प्याज', en: 'Onion' },
        { hi: 'टमाटर', en: 'Tomato' },
        { hi: 'आलू', en: 'Potato' },
        { hi: 'सरसों', en: 'Mustard' },
        { hi: 'कपास', en: 'Cotton' }
    ];

    const toggleCrop = (crop) => {
        setCrops(prev => 
            prev.includes(crop) 
                ? prev.filter(c => c !== crop)
                : [...prev, crop]
        );
    };

    const handleSave = async () => {
        if (!location || !state || crops.length === 0) return;
        setSaving(true);
        await onSave({ location, state, crops, favorite_mandis: [], favorite_schemes: [] });
        setSaving(false);
    };

    return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
            <Card className="w-full max-w-lg border-0 shadow-2xl">
                <CardContent className="p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{getText(content.title)}</h2>
                        <p className="text-gray-600 mt-2">{getText(content.subtitle)}</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getText(content.state)}
                            </label>
                            <Popover open={open} onOpenChange={setOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={open}
                                        className="w-full h-12 rounded-xl justify-between"
                                    >
                                        {state || getText(content.state)}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Command>
                                        <CommandInput placeholder={language === 'hi' ? 'राज्य खोजें...' : 'Search state...'} />
                                        <CommandEmpty>{language === 'hi' ? 'कोई राज्य नहीं मिला' : 'No state found'}</CommandEmpty>
                                        <CommandGroup className="max-h-64 overflow-auto">
                                            {states.map((s) => (
                                                <CommandItem
                                                    key={s}
                                                    value={s}
                                                    onSelect={() => {
                                                        setState(s);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            state === s ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {s}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {getText(content.district)}
                            </label>
                            <Input
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                placeholder={language === 'hi' ? 'जैसे: इंदौर, भोपाल' : 'e.g., Indore, Bhopal'}
                                className="h-12 rounded-xl"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                {getText(content.crops)}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {availableCrops.map(crop => (
                                    <Badge
                                        key={crop.en}
                                        variant={crops.includes(crop.en) ? 'default' : 'outline'}
                                        className={`cursor-pointer px-4 py-2 rounded-full transition-all ${
                                            crops.includes(crop.en) 
                                                ? 'bg-emerald-600 hover:bg-emerald-700' 
                                                : 'hover:bg-emerald-50'
                                        }`}
                                        onClick={() => toggleCrop(crop.en)}
                                    >
                                        {getText(crop)}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <Button 
                            onClick={handleSave}
                            disabled={!location || !state || crops.length === 0 || saving}
                            className="w-full h-12 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 rounded-xl text-lg"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                            {getText(content.save)}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}