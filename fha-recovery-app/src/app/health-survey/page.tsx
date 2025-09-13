'use client';

import { HealthSurveyWizard } from '@/components/ui/health-survey-wizard';

export default function HealthSurveyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <HealthSurveyWizard />
      </div>
    </div>
  );
}
