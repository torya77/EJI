from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from typing import List, Optional
from pydantic import BaseModel
import base64
import json
import os

router = APIRouter(prefix="/translate", tags=["translation"])

# Supported languages
SUPPORTED_LANGUAGES = {
    'fr': 'Français',
    'ar': 'العربية',
    'ko': '한국어',
    'de': 'Deutsch',
    'en': 'English'
}

class TranslationRequest(BaseModel):
    text: str
    source_lang: str = "auto"
    target_lang: str = "fr"

class TranslationResponse(BaseModel):
    original_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    confidence: float = 0.9

class ImageTranslationRequest(BaseModel):
    image_base64: str
    target_lang: str = "fr"

class ImageTranslationResponse(BaseModel):
    detected_text: str
    translated_text: str
    source_lang: str
    target_lang: str
    confidence: float = 0.8

@router.get("/languages")
async def get_supported_languages():
    """Get list of supported languages"""
    return {"languages": SUPPORTED_LANGUAGES}

@router.post("/text", response_model=TranslationResponse)
async def translate_text(request: TranslationRequest):
    """Translate text from one language to another"""
    try:
        # For now, we'll use a mock translation service
        # In production, you would integrate with Google Translate API or similar
        translated_text = await mock_translate_text(request.text, request.source_lang, request.target_lang)
        
        return TranslationResponse(
            original_text=request.text,
            translated_text=translated_text,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
            confidence=0.9
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Translation failed: {str(e)}")

@router.post("/image", response_model=ImageTranslationResponse)
async def translate_image(request: ImageTranslationRequest):
    """Extract text from image and translate it"""
    try:
        # Mock OCR + Translation
        detected_text = await mock_ocr_extract(request.image_base64)
        translated_text = await mock_translate_text(detected_text, "auto", request.target_lang)
        
        return ImageTranslationResponse(
            detected_text=detected_text,
            translated_text=translated_text,
            source_lang="auto",
            target_lang=request.target_lang,
            confidence=0.8
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image translation failed: {str(e)}")

@router.post("/image/upload")
async def translate_uploaded_image(
    file: UploadFile = File(...),
    target_lang: str = Form("fr")
):
    """Upload image file and translate text in it"""
    try:
        # Read and encode image
        image_data = await file.read()
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Process image
        detected_text = await mock_ocr_extract(image_base64)
        translated_text = await mock_translate_text(detected_text, "auto", target_lang)
        
        return ImageTranslationResponse(
            detected_text=detected_text,
            translated_text=translated_text,
            source_lang="auto",
            target_lang=target_lang,
            confidence=0.8
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload translation failed: {str(e)}")

@router.post("/conversation")
async def translate_conversation(
    messages: List[TranslationRequest]
):
    """Translate multiple messages for conversation"""
    try:
        translated_messages = []
        for message in messages:
            translated_text = await mock_translate_text(
                message.text, 
                message.source_lang, 
                message.target_lang
            )
            translated_messages.append(TranslationResponse(
                original_text=message.text,
                translated_text=translated_text,
                source_lang=message.source_lang,
                target_lang=message.target_lang,
                confidence=0.9
            ))
        
        return {"translations": translated_messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Conversation translation failed: {str(e)}")

# Mock functions (replace with real API calls in production)
async def mock_translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """Mock translation function"""
    # Sample translations for demonstration
    translations = {
        ("Hello", "en", "fr"): "Bonjour",
        ("Hello", "en", "ar"): "مرحبا",
        ("Hello", "en", "ko"): "안녕하세요",
        ("Hello", "en", "de"): "Hallo",
        ("Menu", "en", "fr"): "Menu",
        ("Menu", "en", "ar"): "قائمة الطعام",
        ("Menu", "en", "ko"): "메뉴",
        ("Menu", "en", "de"): "Speisekarte",
        ("Couscous", "fr", "en"): "Couscous",
        ("Couscous", "fr", "ar"): "كسكس",
        ("Couscous", "fr", "ko"): "쿠스쿠스",
        ("Couscous", "fr", "de"): "Couscous",
        ("Où est le restaurant?", "fr", "en"): "Where is the restaurant?",
        ("Où est le restaurant?", "fr", "ar"): "أين المطعم؟",
        ("Où est le restaurant?", "fr", "ko"): "레스토랑이 어디에 있나요?",
        ("Où est le restaurant?", "fr", "de"): "Wo ist das Restaurant?",
    }
    
    # Return mock translation or original text
    return translations.get((text, source_lang, target_lang), f"[{target_lang}] {text}")

async def mock_ocr_extract(image_base64: str) -> str:
    """Mock OCR function"""
    # Sample extracted text from images
    sample_texts = [
        "Menu du jour",
        "Couscous Royal - 1500 DZD",
        "Tajine aux légumes - 1200 DZD",
        "Thé à la menthe - 300 DZD",
        "Restaurant El Andalous",
        "Ouvert de 12h à 23h",
        "Spécialités algériennes",
        "Parking disponible"
    ]
    
    # Return random sample text
    import random
    return random.choice(sample_texts)