import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Camera, 
  Upload, 
  MessageSquare, 
  Languages, 
  Loader2,
  X,
  RotateCcw,
  Copy,
  Volume2
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const TranslatorModal = ({ isOpen, onClose }) => {
  const { currentLanguage, t, availableLanguages } = useLanguage();
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [targetLanguage, setTargetLanguage] = useState(currentLanguage);
  const [isTranslating, setIsTranslating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectedText, setDetectedText] = useState('');
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const languageOptions = [
    { code: 'auto', name: 'Détection automatique' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'ko', name: '한국어' },
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' }
  ];

  if (!isOpen) return null;

  const translateText = async (text, sourceLang = 'auto', targetLang = currentLanguage) => {
    setIsTranslating(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/translate/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          source_lang: sourceLang,
          target_lang: targetLang
        })
      });
      
      const data = await response.json();
      return data.translated_text;
    } catch (error) {
      console.error('Translation error:', error);
      return 'Erreur de traduction';
    } finally {
      setIsTranslating(false);
    }
  };

  const handleTextTranslation = async () => {
    if (!textInput.trim()) return;
    
    const translated = await translateText(textInput, sourceLanguage, targetLanguage);
    setTranslatedText(translated);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        processImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const processImage = async (imageData) => {
    setIsTranslating(true);
    try {
      // Remove data:image/jpeg;base64, prefix
      const base64Image = imageData.split(',')[1];
      
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/translate/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image_base64: base64Image,
          target_lang: targetLanguage
        })
      });
      
      const data = await response.json();
      setDetectedText(data.detected_text);
      setTranslatedText(data.translated_text);
    } catch (error) {
      console.error('Image translation error:', error);
      setDetectedText('Erreur de détection de texte');
      setTranslatedText('Erreur de traduction');
    } finally {
      setIsTranslating(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setSelectedImage(imageData);
      processImage(imageData);
      stopCamera();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ar' ? 'ar-SA' : lang === 'ko' ? 'ko-KR' : lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-US' : 'fr-FR';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <Languages className="w-5 h-5 text-blue-600" />
              <span>{t('translator')}</span>
            </CardTitle>
            <CardDescription>
              Traduisez du texte, des photos de menus et communiquez avec les locaux
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        
        <CardContent>
          {/* Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
            {[
              { id: 'text', label: t('translateText'), icon: MessageSquare },
              { id: 'photo', label: t('translatePhoto'), icon: Camera },
              { id: 'conversation', label: t('conversation'), icon: Languages }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Language Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue source
              </label>
              <select
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languageOptions.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Langue cible
              </label>
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {languageOptions.filter(lang => lang.code !== 'auto').map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Text Translation Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <Textarea
                  placeholder="Tapez votre texte à traduire..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex justify-between items-center mt-2">
                  <Badge variant="outline" className="text-xs">
                    {textInput.length} caractères
                  </Badge>
                  <Button 
                    onClick={handleTextTranslation}
                    disabled={!textInput.trim() || isTranslating}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isTranslating ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <Languages className="w-4 h-4 mr-2" />
                    )}
                    {t('translating') || 'Traduire'}
                  </Button>
                </div>
              </div>
              
              {translatedText && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-green-800">{t('translatedText')}</h4>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(translatedText)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakText(translatedText, targetLanguage)}
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-green-700">{translatedText}</p>
                </div>
              )}
            </div>
          )}

          {/* Photo Translation Tab */}
          {activeTab === 'photo' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Upload className="w-6 h-6" />
                  <span>{t('uploadPhoto')}</span>
                </Button>
                <Button
                  onClick={isCameraActive ? capturePhoto : startCamera}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                >
                  <Camera className="w-6 h-6" />
                  <span>{isCameraActive ? 'Capturer' : t('takePhoto')}</span>
                </Button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {isCameraActive && (
                <div className="relative">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  <Button
                    onClick={stopCamera}
                    variant="secondary"
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
              
              <canvas ref={canvasRef} className="hidden" />
              
              {selectedImage && (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  {isTranslating && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{t('detectingText')}</span>
                    </div>
                  )}
                  
                  {detectedText && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-medium text-blue-800 mb-2">{t('originalText')}</h4>
                      <p className="text-blue-700">{detectedText}</p>
                    </div>
                  )}
                  
                  {translatedText && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-green-800">{t('translatedText')}</h4>
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(translatedText)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakText(translatedText, targetLanguage)}
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-green-700">{translatedText}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Conversation Tab */}
          {activeTab === 'conversation' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 text-center">
                <MessageSquare className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Traducteur de Conversation
                </h3>
                <p className="text-gray-600">
                  Communiquez facilement avec les locaux en temps réel
                </p>
              </div>
              
              <div className="space-y-3">
                <Input
                  placeholder="Tapez votre message..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTextTranslation()}
                />
                <Button 
                  onClick={handleTextTranslation}
                  disabled={!textInput.trim() || isTranslating}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isTranslating ? (
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  ) : (
                    <Languages className="w-4 h-4 mr-2" />
                  )}
                  Traduire et Prononcer
                </Button>
              </div>
              
              {translatedText && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-green-800">Montrez à votre interlocuteur :</h4>
                    <Button
                      onClick={() => speakText(translatedText, targetLanguage)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Volume2 className="w-4 h-4 mr-1" />
                      Prononcer
                    </Button>
                  </div>
                  <p className="text-xl text-green-700 font-semibold">{translatedText}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TranslatorModal;