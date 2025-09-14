'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, ChevronRight, Heart, Sparkles, LogIn } from 'lucide-react';

interface SurveyData {
  daysSinceLastPeriod: string;
  allergies: string;
  dietaryRestrictions: string;
  currentMedications: string;
  currentSupplements: string;
  primaryWellnessGoal: string;
}

const SURVEY_STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to Your Wellness Journey',
    subtitle: 'Let\'s get to know you better'
  },
  {
    id: 'cycle-history',
    title: 'Your Cycle History',
    subtitle: 'Helping us understand your unique journey'
  },
  {
    id: 'nutrition',
    title: 'Nutrition & Dietary Preferences',
    subtitle: 'Creating a nourishing plan just for you'
  },
  {
    id: 'wellness',
    title: 'Current Wellness Support',
    subtitle: 'Understanding your current health routine'
  },
  {
    id: 'goals',
    title: 'Your Wellness Goals',
    subtitle: 'What matters most to you right now'
  }
];

export function HealthSurveyWizard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [surveyData, setSurveyData] = useState<SurveyData>({
    daysSinceLastPeriod: '',
    allergies: '',
    dietaryRestrictions: '',
    currentMedications: '',
    currentSupplements: '',
    primaryWellnessGoal: ''
  });

  // Load existing profile data when component mounts
  useEffect(() => {
    if (session?.user?.email) {
      loadExistingProfile();
    }
  }, [session]);

  const loadExistingProfile = async () => {
    if (!session?.user?.email) return;
    
    try {
      // Use the user's email as the user ID for Google OAuth
      const userId = session.user.email;
      
      const response = await fetch(`http://localhost:8001/api/health-profile/${userId}`);
      if (response.ok) {
        const profile = await response.json();
        setSurveyData({
          daysSinceLastPeriod: profile.days_since_last_period ? profile.days_since_last_period.toString() : '',
          allergies: profile.allergies || '',
          dietaryRestrictions: profile.dietary_restrictions || '',
          currentMedications: profile.current_medications || '',
          currentSupplements: profile.current_supplements || '',
          primaryWellnessGoal: profile.primary_wellness_goal || ''
        });
      }
    } catch (error) {
      console.log('No existing profile found, starting fresh');
    }
  };

  const updateSurveyData = (field: keyof SurveyData, value: string) => {
    setSurveyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < SURVEY_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = async () => {
    if (!session?.user?.email) return;
    
    setIsLoading(true);
    try {
      const userId = session.user.email;
      
      const response = await fetch('http://localhost:8001/api/health-profile/survey/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          days_since_last_period: surveyData.daysSinceLastPeriod ? parseInt(surveyData.daysSinceLastPeriod) : null,
          allergies: surveyData.allergies,
          dietary_restrictions: surveyData.dietaryRestrictions,
          current_medications: surveyData.currentMedications,
          current_supplements: surveyData.currentSupplements,
          primary_wellness_goal: surveyData.primaryWellnessGoal
        }),
      });

      if (response.ok) {
        // Redirect to BBT tracker page
        router.push('/insight');
      } else {
        console.error('Failed to save survey data');
      }
    } catch (error) {
      console.error('Error saving survey:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Show login prompt if user is not authenticated
  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#87C4BB] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Welcome to Your Wellness Journey
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Please sign in with Google to access your personalized health survey
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8 text-center">
            <div className="space-y-6">
              <div className="flex justify-center">
                <LogIn className="h-16 w-16 text-[#87C4BB]" />
              </div>
              <p className="text-gray-600">
                Your health information is private and secure. We use Google authentication to protect your data and provide you with a personalized experience.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="bg-[#87C4BB] hover:bg-[#76B3AA] text-white flex items-center gap-2 mx-auto"
              >
                <LogIn className="h-4 w-4" />
                Sign In with Google
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderStepContent = () => {
    const step = SURVEY_STEPS[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Heart className="h-16 w-16 text-[#87C4BB]" />
            </div>
            <div className="space-y-4">
              <p className="text-lg text-gray-700 leading-relaxed">
                Welcome to your personalized wellness journey! We're here to support you every step of the way.
              </p>
              <p className="text-gray-600">
                This gentle survey will help us understand your unique needs and create a supportive experience 
                tailored just for you. Your responses are private and will only be used to enhance your wellness journey.
              </p>
              <p className="text-sm text-gray-500 italic">
                Take your time - there's no rush. You can always come back and update your responses later.
              </p>
            </div>
          </div>
        );

      case 'cycle-history':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="days-since-period" className="text-base font-medium text-gray-700">
                How many days has it been since your last menstrual period?
              </Label>
              <p className="text-sm text-gray-500 mb-4">
                Enter the number of days since your last period started. If you're unsure or prefer not to share, you can leave this blank.
              </p>
              <Input
                id="days-since-period"
                type="number"
                min="0"
                max="3650"
                placeholder="e.g., 28, 90, 365..."
                value={surveyData.daysSinceLastPeriod}
                onChange={(e) => updateSurveyData('daysSinceLastPeriod', e.target.value)}
                className="border-gray-200 focus:border-[#87C4BB] focus:ring-[#87C4BB]"
              />
              <p className="text-xs text-gray-400 mt-2">
                This helps us provide more personalized insights for your wellness journey.
              </p>
            </div>
          </div>
        );

      case 'nutrition':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="allergies" className="text-base font-medium text-gray-700">
                  Food Allergies & Sensitivities
                </Label>
                <p className="text-sm text-gray-500 mb-3">
                  Help us keep you safe and comfortable by sharing any foods that don't work well for your body
                </p>
                <Textarea
                  id="allergies"
                  placeholder="e.g., tree nuts, dairy, gluten, or 'none that I know of'"
                  value={surveyData.allergies}
                  onChange={(e) => updateSurveyData('allergies', e.target.value)}
                  className="border-gray-200 focus:border-[#87C4BB] focus:ring-[#87C4BB]"
                />
              </div>
              
              <div>
                <Label htmlFor="dietary-restrictions" className="text-base font-medium text-gray-700">
                  Dietary Preferences & Restrictions
                </Label>
                <p className="text-sm text-gray-500 mb-3">
                  Any eating patterns or preferences that are important to you?
                </p>
                <Textarea
                  id="dietary-restrictions"
                  placeholder="e.g., vegetarian, vegan, kosher, halal, or specific preferences"
                  value={surveyData.dietaryRestrictions}
                  onChange={(e) => updateSurveyData('dietaryRestrictions', e.target.value)}
                  className="border-gray-200 focus:border-[#87C4BB] focus:ring-[#87C4BB]"
                />
              </div>
            </div>
          </div>
        );

      case 'wellness':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="medications" className="text-base font-medium text-gray-700">
                  Current Medications
                </Label>
                <p className="text-sm text-gray-500 mb-3">
                  This helps us provide you with the most appropriate guidance and avoid any interactions
                </p>
                <Textarea
                  id="medications"
                  placeholder="List any medications you're currently taking, or 'none'"
                  value={surveyData.currentMedications}
                  onChange={(e) => updateSurveyData('currentMedications', e.target.value)}
                  className="border-gray-200 focus:border-[#87C4BB] focus:ring-[#87C4BB]"
                />
              </div>
              
              <div>
                <Label htmlFor="supplements" className="text-base font-medium text-gray-700">
                  Current Supplements
                </Label>
                <p className="text-sm text-gray-500 mb-3">
                  Including vitamins, minerals, herbs, or other wellness supplements
                </p>
                <Textarea
                  id="supplements"
                  placeholder="e.g., multivitamin, vitamin D, magnesium, or 'none currently'"
                  value={surveyData.currentSupplements}
                  onChange={(e) => updateSurveyData('currentSupplements', e.target.value)}
                  className="border-gray-200 focus:border-[#87C4BB] focus:ring-[#87C4BB]"
                />
              </div>
            </div>
          </div>
        );

      case 'goals':
        return (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Sparkles className="h-12 w-12 text-[#FFB4A2]" />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="wellness-goal" className="text-base font-medium text-gray-700">
                  What's one health or wellness goal you're focusing on right now?
                </Label>
                <p className="text-sm text-gray-500 mb-4">
                  This could be anything that feels important to you - physical, emotional, or mental wellness. 
                  There's no right or wrong answer.
                </p>
                <Textarea
                  id="wellness-goal"
                  placeholder="e.g., 'feeling more energized', 'improving my relationship with food', 'getting better sleep', 'reducing stress'..."
                  value={surveyData.primaryWellnessGoal}
                  onChange={(e) => updateSurveyData('primaryWellnessGoal', e.target.value)}
                  className="min-h-[120px] border-gray-200 focus:border-[#87C4BB] focus:ring-[#87C4BB]"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    const step = SURVEY_STEPS[currentStep];
    
    // Welcome step can always proceed
    if (step.id === 'welcome') return true;
    
    // Other steps are optional but we encourage completion
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-500">
            Step {currentStep + 1} of {SURVEY_STEPS.length}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(((currentStep + 1) / SURVEY_STEPS.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#87C4BB] to-[#FFB4A2] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentStep + 1) / SURVEY_STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl font-semibold text-gray-800">
            {SURVEY_STEPS[currentStep].title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {SURVEY_STEPS[currentStep].subtitle}
          </p>
        </CardHeader>
        
        <CardContent className="px-8 pb-8">
          {renderStepContent()}
          
          {/* Navigation buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {currentStep === SURVEY_STEPS.length - 1 ? (
              <Button
                onClick={handleFinish}
                disabled={isLoading}
                className="bg-[#87C4BB] hover:bg-[#76B3AA] text-white flex items-center gap-2 px-8"
              >
                {isLoading ? 'Saving...' : 'Complete Survey'}
                <Heart className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-[#87C4BB] hover:bg-[#76B3AA] text-white flex items-center gap-2"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Encouraging footer message */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          Remember, this journey is uniquely yours. We're here to support you every step of the way. 💚
        </p>
      </div>
    </div>
  );
}
