'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw, Users, CheckCircle, XCircle, Trash2, AlertTriangle } from 'lucide-react';

interface HealthProfile {
  id: number;
  user_id: string;
  survey_completed: boolean;
  last_menstrual_period: string | null;
  allergies: string | null;
  dietary_restrictions: string | null;
  current_medications: string | null;
  current_supplements: string | null;
  primary_wellness_goal: string | null;
  created_at: string;
  updated_at: string | null;
}

interface DatabaseResponse {
  total_profiles: number;
  profiles: HealthProfile[];
}

export default function DatabaseViewerPage() {
  const [data, setData] = useState<DatabaseResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8001/api/health-profile/admin/all-profiles');
      if (response.ok) {
        const result = await response.json();
        setData(result);
      } else {
        setError('Failed to fetch database data');
      }
    } catch (err) {
      setError('Error connecting to backend');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const clearDatabase = async () => {
    setIsClearing(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8001/api/health-profile/admin/clear-database', {
        method: 'DELETE',
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log(`Cleared ${result.profiles_deleted} profiles`);
        // Refresh data after clearing
        await fetchData();
        setShowClearConfirm(false);
      } else {
        setError('Failed to clear database');
      }
    } catch (err) {
      setError('Error clearing database');
    } finally {
      setIsClearing(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return 'N/A';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-[#87C4BB]" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Database Viewer</h1>
                  <p className="text-gray-600">Health Profile Management</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="bg-[#87C4BB] hover:bg-[#76B3AA] text-white flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  onClick={() => setShowClearConfirm(true)}
                  disabled={isLoading || isClearing}
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Clear Database
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-[#87C4BB]" />
                Database Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : data ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-[#87C4BB]">{data.total_profiles}</div>
                    <div className="text-sm text-gray-600">Total Profiles</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {data.profiles.filter(p => p.survey_completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Completed Surveys</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {data.profiles.filter(p => !p.survey_completed).length}
                    </div>
                    <div className="text-sm text-gray-600">Incomplete Surveys</div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Profiles List */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Health Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <p className="text-red-600 text-center py-8">{error}</p>
              ) : data && data.profiles.length === 0 ? (
                <div className="text-center py-12">
                  <Database className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">No health profiles found</p>
                  <p className="text-gray-400 text-sm">Users will appear here after completing the health survey</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data?.profiles.map((profile) => (
                    <div key={profile.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="font-medium text-gray-800">
                            {profile.user_id}
                          </div>
                          <Badge 
                            variant={profile.survey_completed ? "default" : "secondary"}
                            className={profile.survey_completed ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                          >
                            {profile.survey_completed ? (
                              <><CheckCircle className="h-3 w-3 mr-1" /> Completed</>
                            ) : (
                              <><XCircle className="h-3 w-3 mr-1" /> Incomplete</>
                            )}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500">
                          Created: {formatDate(profile.created_at)}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-600">Last Period:</span>
                          <p className="text-gray-800">{truncateText(profile.last_menstrual_period)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Allergies:</span>
                          <p className="text-gray-800">{truncateText(profile.allergies)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Dietary Restrictions:</span>
                          <p className="text-gray-800">{truncateText(profile.dietary_restrictions)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Medications:</span>
                          <p className="text-gray-800">{truncateText(profile.current_medications)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Supplements:</span>
                          <p className="text-gray-800">{truncateText(profile.current_supplements)}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-600">Wellness Goal:</span>
                          <p className="text-gray-800">{truncateText(profile.primary_wellness_goal)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Clear Database Confirmation Dialog */}
          {showClearConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <Card className="max-w-md mx-4 border-0 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle className="h-5 w-5" />
                    Clear Database
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-gray-700 font-medium">
                      Are you sure you want to clear all health profiles?
                    </p>
                    <p className="text-sm text-gray-600">
                      This action will permanently delete all user data and cannot be undone.
                      {data && data.total_profiles > 0 && (
                        <span className="block mt-1 font-medium text-red-600">
                          {data.total_profiles} profile{data.total_profiles !== 1 ? 's' : ''} will be deleted.
                        </span>
                      )}
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => setShowClearConfirm(false)}
                      variant="outline"
                      disabled={isClearing}
                      className="px-4"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={clearDatabase}
                      disabled={isClearing}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 flex items-center gap-2"
                    >
                      {isClearing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Clearing...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4" />
                          Clear Database
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
