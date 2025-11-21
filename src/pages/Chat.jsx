import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from 'utils';
import { LanguageProvider, useLanguage } from '../components/LanguageContext';
import LanguageToggle from '../components/LanguageToggle';
import MessageBubble from '../components/MessageBubble';

function ChatContent() {
    const { language } = useLanguage();
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    const content = {
        back: { hi: 'वापस जाएं', en: 'Back' },
        title: { hi: 'किसान मित्र चैट', en: 'KisanMitra Chat' },
        placeholder: { hi: 'अपना सवाल यहाँ लिखें...', en: 'Type your question here...' },
        loading: { hi: 'लोड हो रहा है...', en: 'Loading...' }
    };

    const getText = (obj) => obj[language];

    useEffect(() => {
        initializeConversation();
    }, []);

    useEffect(() => {
        if (conversation?.id) {
            const unsubscribe = base44.agents.subscribeToConversation(conversation.id, (data) => {
                setMessages(data.messages || []);
            });
            return () => unsubscribe();
        }
    }, [conversation?.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const initializeConversation = async () => {
        setIsLoading(true);
        try {
            const newConv = await base44.agents.createConversation({
                agent_name: 'KisanMitra',
                metadata: {
                    name: language === 'hi' ? 'किसान मित्र चैट' : 'KisanMitra Chat',
                    language: language
                }
            });
            setConversation(newConv);
        } catch (error) {
            console.error('Error creating conversation:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || !conversation || isSending) return;

        setIsSending(true);
        const messageText = inputMessage;
        setInputMessage('');

        try {
            await base44.agents.addMessage(conversation, {
                role: 'user',
                content: messageText
            });
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-gray-600">{getText(content.loading)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-green-50 to-white">
            {/* Header */}
            <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link to={createPageUrl('Home')}>
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="font-bold text-green-800">{getText(content.title)}</h1>
                        <p className="text-xs text-green-600">{language === 'hi' ? 'ऑनलाइन' : 'Online'}</p>
                    </div>
                </div>
                <LanguageToggle />
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            {language === 'hi' 
                                ? '👋 नमस्ते! मुझसे कुछ भी पूछें' 
                                : '👋 Hello! Ask me anything'}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            {language === 'hi'
                                ? 'फसल, मंडी, मौसम - कुछ भी!'
                                : 'Crops, markets, weather - anything!'}
                        </p>
                    </div>
                )}
                {messages.map((message, idx) => (
                    <MessageBubble key={idx} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white p-4">
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={getText(content.placeholder)}
                        className="flex-1"
                        disabled={isSending}
                    />
                    <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSending || !inputMessage.trim()}
                    >
                        {isSending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default function Chat() {
    return (
        <LanguageProvider>
            <ChatContent />
        </LanguageProvider>
    );
}