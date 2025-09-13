# Gemini API Integration Setup Guide

This guide explains how to set up the Gemini API integration for meal nutritional analysis in the FHA Recovery App.

## Prerequisites

1. Google AI Studio account
2. Gemini API key
3. Backend and frontend servers running

## Setup Steps

### 1. Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the generated key

### 2. Configure Backend Environment

1. Navigate to the backend directory:
   ```bash
   cd fha-recovery-backend
   ```

2. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and add your Gemini API key:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Start the Backend Server

1. Install dependencies (if not already done):
   ```bash
   poetry install
   ```

2. Start the FastAPI server:
   ```bash
   poetry run dev
   ```

   The backend will be available at `http://localhost:8000`

### 4. Start the Frontend Server

1. Navigate to the frontend directory:
   ```bash
   cd ../fha-recovery-app
   ```

2. Install dependencies (if not already done):
   ```bash
   npm install
   ```

3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:3003`

## Testing the Integration

### 1. Access the Meal Logging Feature

1. Open your browser and go to `http://localhost:3003`
2. Navigate to the "Nourish & Thrive" page
3. Click the "+ Log Today's Meals" button

### 2. Log a Meal with AI Analysis

1. Select a meal type (Breakfast, Lunch, Dinner, or Snack)
2. Add a description of your meal, for example:
   ```
   Quinoa bowl with roasted vegetables, avocado, and tahini dressing. 
   Includes broccoli, sweet potato, chickpeas, and pumpkin seeds.
   ```
3. Optionally upload an image of the meal
4. Click "Save Meal"

### 3. View AI Analysis Results

1. The meal will appear in the "Today's Meals" section with a loading indicator
2. After a few seconds, the Gemini AI analysis will appear below the meal
3. Click the expand button to see detailed nutritional insights including:
   - Overall nutritional score (1-10)
   - Key nutrients identified
   - Positive health aspects
   - Areas for improvement
   - FHA-specific recovery notes
   - Processing level assessment
   - Estimated calories

## API Endpoints

### Meal Analysis Endpoint

**POST** `/api/ai/analyze-meal`

**Request Body:**
```json
{
  "meal_type": "breakfast",
  "description": "Oatmeal with berries and nuts",
  "image_base64": "optional_base64_encoded_image",
  "timestamp": "2024-01-15T08:30:00Z"
}
```

**Response:**
```json
{
  "meal_id": "breakfast_1234",
  "overall_score": 8,
  "overall_assessment": "Excellent nutritious breakfast choice",
  "key_nutrients": [...],
  "positive_aspects": [...],
  "areas_for_improvement": [...],
  "fha_specific_notes": "This meal provides excellent support for hormonal recovery...",
  "encouragement": "Great choice for nourishing your body!",
  "processing_level": "minimal",
  "estimated_calories": 350
}
```

## Troubleshooting

### Backend Issues

1. **"GEMINI_API_KEY environment variable is required"**
   - Ensure your `.env` file exists and contains the correct API key
   - Restart the backend server after adding the key

2. **"AI analysis service is not available"**
   - Check that your Gemini API key is valid
   - Verify you have internet connectivity
   - Check the backend logs for specific error messages

3. **CORS errors**
   - Ensure the frontend is running on `http://localhost:3003`
   - Check that the backend CORS configuration allows this origin

### Frontend Issues

1. **"Error analyzing meal"**
   - Check that the backend server is running on `http://localhost:8000`
   - Open browser developer tools to see network errors
   - Verify the meal data is being sent correctly

2. **Analysis never loads**
   - Check the browser console for JavaScript errors
   - Ensure the meal update logic is working correctly
   - Verify the backend is responding to API requests

## Features

### FHA-Focused Analysis

The Gemini integration is specifically designed for Functional Hypothalamic Amenorrhea recovery:

- **Calorie Adequacy**: Emphasizes sufficient energy intake for metabolic recovery
- **Hormone Support**: Identifies nutrients crucial for reproductive health
- **Processing Assessment**: Evaluates food quality and processing levels
- **Recovery Guidance**: Provides gentle, encouraging feedback aligned with FHA recovery principles
- **Micronutrient Focus**: Highlights vitamins and minerals essential for healing

### Gentle Messaging

All AI responses are crafted to be:
- Encouraging and supportive
- Non-triggering for those with eating disorder history
- Focused on nourishment rather than restriction
- Aligned with body-positive recovery approaches

## Security Notes

- Keep your Gemini API key secure and never commit it to version control
- The API key should only be stored in the backend environment
- Consider implementing rate limiting for production use
- Monitor API usage to stay within quota limits
