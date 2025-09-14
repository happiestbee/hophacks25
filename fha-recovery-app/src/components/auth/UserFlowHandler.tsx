'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

export function UserFlowHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'loading') return; // Still loading session
    if (!session?.user?.email) return; // Not authenticated

    // Skip redirect logic for certain pages
    const skipRedirectPaths = ['/health-survey', '/admin/database', '/login', '/signup'];
    if (skipRedirectPaths.includes(pathname)) return;

    // Check user's survey status
    checkSurveyStatusAndRedirect();
  }, [session, status, pathname, router]);

  const checkSurveyStatusAndRedirect = async () => {
    if (!session?.user?.email) return;

    try {
      const userId = session.user.email;
      const response = await fetch(`http://localhost:8001/api/health-profile/${userId}/survey-status`);
      
      if (response.ok) {
        const data = await response.json();
        
        // If user hasn't completed survey, redirect to health survey
        if (!data.survey_completed) {
          if (pathname !== '/health-survey') {
            router.push('/health-survey');
          }
        } else {
          // If user has completed survey and is on landing page, redirect to BBT tracker
          if (pathname === '/') {
            router.push('/insight');
          }
        }
      } else {
        // If profile doesn't exist (404), this is a new user - redirect to survey
        if (response.status === 404) {
          if (pathname !== '/health-survey') {
            router.push('/health-survey');
          }
        }
      }
    } catch (error) {
      console.error('Error checking survey status:', error);
    }
  };

  return null; // This component doesn't render anything
}
