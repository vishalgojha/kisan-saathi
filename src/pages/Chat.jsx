import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Paperclip, ArrowLeft, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
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
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [uploadingFiles, setUploadingFiles] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);

    const content = {
        back: { hi: 'वापस जाएं', en: 'Back' },
        title: { hi: 'किसान मित्र चैट', en: 'KisanMitra Chat' },
        placeholder: { hi: 'अपना सवाल यहाँ लिखें...', en: 'Type your question here...' },
        loading: { hi: 'लोड हो रहा है...', en: 'Loading...' },
        attachImage: { hi: 'फोटो भेजें', en: 'Attach Image' },
        uploadingImage: { hi: 'अपलोड हो रहा है...', en: 'Uploading...' }
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

    const handleFileSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploadingFiles(true);
        try {
            const uploadedUrls = [];
            for (const file of files) {
                const { file_url } = await base44.integrations.Core.UploadFile({ file });
                uploadedUrls.push(file_url);
            }
            setSelectedFiles(prev => [...prev, ...uploadedUrls]);
        } catch (error) {
            console.error('Error uploading files:', error);
        } finally {
            setUploadingFiles(false);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if ((!inputMessage.trim() && selectedFiles.length === 0) || !conversation || isSending) return;

        setIsSending(true);
        const messageText = inputMessage;
        const fileUrls = [...selectedFiles];
        setInputMessage('');
        setSelectedFiles([]);

        try {
            await base44.agents.addMessage(conversation, {
                role: 'user',
                content: messageText || 'Please analyze this image',
                file_urls: fileUrls.length > 0 ? fileUrls : undefined
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
                    <Link to="/Home">
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
                    <div className="text-center py-12 px-4">
                        <div className="max-w-md mx-auto">
                            <p className="text-gray-700 text-lg font-semibold mb-4">
                                {language === 'hi' 
                                    ? '👋 नमस्ते! मैं KisanMitra हूँ' 
                                    : '👋 Hello! I am KisanMitra'}
                            </p>
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left space-y-2">
                                <p className="text-sm text-gray-700 font-medium">
                                    {language === 'hi' ? 'मैं आपकी मदद कर सकता हूँ:' : 'I can help you with:'}
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                    <li>🌾 {language === 'hi' ? 'फसल की बीमारी पहचान' : 'Crop disease diagnosis'}</li>
                                    <li>🐛 {language === 'hi' ? 'कीट नियंत्रण सलाह' : 'Pest control advice'}</li>
                                    <li>💊 {language === 'hi' ? 'दवा और खुराक जानकारी' : 'Treatment & dosage info'}</li>
                                    <li>💰 {language === 'hi' ? 'मंडी के रेट' : 'Market prices'}</li>
                                    <li>🌤️ {language === 'hi' ? 'मौसम की जानकारी' : 'Weather updates'}</li>
                                </ul>
                                <p className="text-xs text-green-700 mt-3 font-medium">
                                    📸 {language === 'hi' 
                                        ? 'फसल की फोटो भेजें बेहतर सलाह के लिए' 
                                        : 'Send crop photos for better advice'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                {messages.map((message, idx) => (
                    <MessageBubble key={idx} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t bg-white p-4">
                {/* Image Preview */}
                {selectedFiles.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {selectedFiles.map((fileUrl, idx) => (
                            <div key={idx} className="relative">
                                <img 
                                    src={fileUrl} 
                                    alt="Upload preview" 
                                    className="w-20 h-20 object-cover rounded-lg border-2 border-green-200"
                                />
                                <button
                                    onClick={() => removeFile(idx)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingFiles || isSending}
                        className="border-green-600 text-green-700 hover:bg-green-50"
                    >
                        {uploadingFiles ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <ImageIcon className="w-5 h-5" />
                        )}
                    </Button>
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder={getText(content.placeholder)}
                        className="flex-1"
                        disabled={isSending || uploadingFiles}
                    />
                    <Button 
                        type="submit" 
                        className="bg-green-600 hover:bg-green-700"
                        disabled={isSending || uploadingFiles || (!inputMessage.trim() && selectedFiles.length === 0)}
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