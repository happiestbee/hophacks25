#!/usr/bin/env python3

import os
import sys
from dotenv import load_dotenv

# Add the backend app to the Python path
sys.path.append('/Users/zhengxianwangMac/Documents/GitHub/hophacks25/fha-recovery-backend')

# Load environment variables
load_dotenv('/Users/zhengxianwangMac/Documents/GitHub/hophacks25/fha-recovery-backend/.env')

from app.core.gemini_client import GeminiClient

def test_image_generation():
    """Test the Gemini image generation functionality"""
    try:
        client = GeminiClient()
        print("✅ GeminiClient initialized successfully")
        
        # Test image generation
        print("🎨 Testing image generation for 'Quinoa Power Bowl'...")
        image_url = client._generate_meal_image("Quinoa Power Bowl")
        
        if image_url.startswith("data:image/"):
            print("✅ Image generation successful!")
            print(f"Generated image URL length: {len(image_url)} characters")
            if "svg" in image_url:
                print("📝 Using SVG fallback (expected if Gemini image generation fails)")
            else:
                print("🖼️ Using actual Gemini-generated image!")
        else:
            print("❌ Image generation failed - invalid URL format")
            
    except Exception as e:
        print(f"❌ Error during image generation test: {str(e)}")

if __name__ == "__main__":
    test_image_generation()
