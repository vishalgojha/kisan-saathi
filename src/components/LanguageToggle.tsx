import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    
    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-2 rounded-xl hover:bg-gray-100 px-4 py-2 h-10"
        >
            <Globe className="h-4 w-4 text-gray-600" />
            <span className="font-semibold text-gray-700">{language === 'hi' ? 'EN' : 'हिं'}</span>
        </Button>
    );
}

