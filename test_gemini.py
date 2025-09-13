#!/usr/bin/env python3
"""
Quick test script to verify Gemini API functionality
"""
import os
import sys
from dotenv import load_dotenv
import google.generativeai as genai

def test_gemini_api():
    """Test basic Gemini API functionality"""
    
    # Load environment variables
    load_dotenv('/Users/zhengxianwangMac/Documents/GitHub/hophacks25/fha-recovery-backend/.env')
    
    # Get API key
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        print("❌ ERROR: GEMINI_API_KEY not found in environment")
        print("Please check your .env file in fha-recovery-backend/")
        return False
    
    print(f"✅ API Key found: {api_key[:10]}...{api_key[-4:]}")
    
    try:
        # Configure Gemini
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-2.0-flash')
        
        print("🔄 Testing basic Gemini API call...")
        
        # Simple test prompt
        test_prompt = """
        You are a nutritionist. Analyze this meal: "scrambled eggs with avocado toast"
        
        Provide a brief 2-sentence analysis focusing on nutritional benefits.
        """
        
        # Generate response with timeout
        response = model.generate_content(test_prompt)
        
        if response and response.text:
            print("✅ SUCCESS: Gemini API is working!")
            print(f"Response: {response.text[:200]}...")
            return True
        else:
            print("❌ ERROR: Empty response from Gemini")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: Gemini API failed: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Gemini API Connection...")
    print("=" * 50)
    
    success = test_gemini_api()
    
    print("=" * 50)
    if success:
        print("✅ Gemini API test PASSED - API is working correctly")
    else:
        print("❌ Gemini API test FAILED - Check configuration")
    
    sys.exit(0 if success else 1)
