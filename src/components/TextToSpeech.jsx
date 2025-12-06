import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TextToSpeech({ text, language = 'hi' }) {
    const [speaking, setSpeaking] = useState(false);

    const speak = () => {
        if (!text) return;

        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        if (speaking) {
            setSpeaking(false);
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        utterance.rate = 0.9;
        utterance.pitch = 1;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        window.speechSynthesis.speak(utterance);
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={speak}
            className="h-8 w-8 rounded-lg hover:bg-gray-100"
            title={speaking ? 'Stop' : 'Listen'}
        >
            {speaking ? (
                <VolumeX className="w-4 h-4 text-emerald-600" />
            ) : (
                <Volume2 className="w-4 h-4 text-gray-600" />
            )}
        </Button>
    );
}