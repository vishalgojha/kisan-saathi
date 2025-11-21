import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from './LanguageContext';

export default function LanguageToggle() {
    const { language, setLanguage } = useLanguage();
    
    return (
        <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'hi' ? 'en' : 'hi')}
            className="flex items-center gap-2 border-green-200 hover:bg-green-50"
        >
            <Globe className="h-4 w-4" />
            <span className="font-semibold">{language === 'hi' ? 'English' : 'हिंदी'}</span>
        </Button>
    );
}