// // Frontend Components for Life Area Customization

// import { Badge } from '@/components/ui/badge';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Progress } from '@/components/ui/progress';
// import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
// import { CheckCircle, Circle, Lock } from 'lucide-react';
// import React, { useEffect, useState } from 'react';

// // Types
// interface LifeAreaOption {
//   area_key: string;
//   display_name: string;
//   description: string;
//   alias_options: string[];
//   category: string;
// }

// interface UserPreferences {
//   [key: string]: string;
// }

// interface OnboardingData {
//   title: string;
//   subtitle: string;
//   areas: LifeAreaOption[];
// }

// interface UnlockCriteria {
//   areas_at_proficient: number;
//   streak_days: number;
//   habits_completed: number;
//   areas_at_proficient_required: number;
//   streak_days_required: number;
//   habits_completed_required: number;
//   is_eligible: boolean;
// }

// // Define proper interface for assessment data
// interface AssessmentData {
//   area_key: string;
//   display_name: string;
//   description: string;
//   instructions: string;
//   questions: Array<{ id: string; text: string }>;
// }

// // Life Area Customization Onboarding Component
// export const LifeAreaOnboarding: React.FC = () => {
//   const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
//   const [selectedPreferences, setSelectedPreferences] = useState<UserPreferences>({});
//   const [currentStep, setCurrentStep] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchOnboardingOptions();
//   }, []);

//   const fetchOnboardingOptions = async () => {
//     try {
//       const response = await fetch('/api/v1/life-areas/onboarding-options');
//       const data = await response.json();
//       setOnboardingData(data);

//       // Initialize with default preferences
//       const defaultPrefs: UserPreferences = {};
//       data.areas.forEach((area: LifeAreaOption) => {
//         defaultPrefs[area.area_key] = area.display_name;
//       });
//       setSelectedPreferences(defaultPrefs);
//     } catch (error) {
//       console.error('Failed to fetch onboarding options:', error);
//     }
//   };

//   const handlePreferenceChange = (areaKey: string, value: string) => {
//     setSelectedPreferences((prev) => ({
//       ...prev,
//       [areaKey]: value,
//     }));
//   };

//   const handleNext = () => {
//     if (onboardingData && currentStep < onboardingData.areas.length - 1) {
//       setCurrentStep((prev) => prev + 1);
//     }
//   };

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep((prev) => prev - 1);
//     }
//   };

//   const handleComplete = async () => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/v1/life-areas/customize', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           customized_display_names: selectedPreferences,
//           onboarding_completed: true,
//         }),
//       });

//       if (response.ok) {
//         // Redirect to dashboard or show success
//         window.location.href = '/dashboard';
//       } else {
//         throw new Error('Failed to save preferences');
//       }
//     } catch (error) {
//       console.error('Failed to save preferences:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!onboardingData) {
//     return <div className="flex justify-center p-8">Loading...</div>;
//   }

//   const currentArea = onboardingData.areas[currentStep];
//   const progress = ((currentStep + 1) / onboardingData.areas.length) * 100;

//   return (
//     <div className="mx-auto max-w-2xl space-y-6 p-6">
//       <div className="space-y-2 text-center">
//         <h1 className="text-3xl font-bold">{onboardingData.title}</h1>
//         <p className="text-gray-600">{onboardingData.subtitle}</p>
//         <Progress value={progress} className="w-full" />
//         <p className="text-sm text-gray-500">
//           Step {currentStep + 1} of {onboardingData.areas.length}
//         </p>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center justify-between">
//             <span>{currentArea.display_name}</span>
//             <Badge variant="outline">{currentArea.category}</Badge>
//           </CardTitle>
//           <p className="text-gray-600">{currentArea.description}</p>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             <h3 className="font-medium">How would you like to refer to this area?</h3>
//             <RadioGroup
//               value={selectedPreferences[currentArea.area_key]}
//               onValueChange={(value) => handlePreferenceChange(currentArea.area_key, value)}
//             >
//               {currentArea.alias_options.map((option) => (
//                 <div key={option} className="flex items-center space-x-2">
//                   <RadioGroupItem value={option} id={option} />
//                   <Label htmlFor={option} className="cursor-pointer">
//                     {option}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         </CardContent>
//       </Card>

//       <div className="flex justify-between">
//         <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
//           Previous
//         </Button>

//         {currentStep === onboardingData.areas.length - 1 ? (
//           <Button onClick={handleComplete} disabled={isLoading}>
//             {isLoading ? 'Saving...' : 'Complete Setup'}
//           </Button>
//         ) : (
//           <Button onClick={handleNext}>Next</Button>
//         )}
//       </div>
//     </div>
//   );
// };

// // Contribution Area Unlock Progress Component
// export const ContributionUnlockProgress: React.FC = () => {
//   const [unlockProgress, setUnlockProgress] = useState<{
//     unlock_criteria: UnlockCriteria;
//     contribution_unlocked: boolean;
//   } | null>(null);

//   useEffect(() => {
//     fetchUnlockProgress();
//   }, []);

//   const fetchUnlockProgress = async () => {
//     try {
//       const response = await fetch('/api/v1/life-areas/unlock-progress');
//       const data = await response.json();
//       setUnlockProgress(data);
//     } catch (error) {
//       console.error('Failed to fetch unlock progress:', error);
//     }
//   };

//   if (!unlockProgress) {
//     return <div>Loading...</div>;
//   }

//   const { unlock_criteria, contribution_unlocked } = unlockProgress;

//   if (contribution_unlocked) {
//     return (
//       <Card className="border-green-200 bg-green-50">
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2 text-green-800">
//             <CheckCircle className="h-5 w-5" />
//             Contribution & Legacy Unlocked!
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-green-700">
//             Congratulations! You've mastered the fundamentals and unlocked the ability to focus on contribution and legacy.
//             This is where true fulfillment begins.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Lock className="h-5 w-5 text-gray-500" />
//           Unlock Contribution & Legacy
//         </CardTitle>
//         <p className="text-gray-600">Master the fundamentals to unlock the ultimate life area</p>
//       </CardHeader>
//       <CardContent className="space-y-4">
//         <div className="space-y-3">
//           <CriteriaItem
//             label="Areas at Proficient Level"
//             current={unlock_criteria.areas_at_proficient}
//             required={unlock_criteria.areas_at_proficient_required}
//             unit="areas"
//           />
//           <CriteriaItem
//             label="Habit Streak"
//             current={unlock_criteria.streak_days}
//             required={unlock_criteria.streak_days_required}
//             unit="days"
//           />
//           <CriteriaItem
//             label="Total Habits Completed"
//             current={unlock_criteria.habits_completed}
//             required={unlock_criteria.habits_completed_required}
//             unit="habits"
//           />
//         </div>

//         {unlock_criteria.is_eligible && (
//           <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
//             <p className="font-medium text-green-800">
//               🎉 You're eligible! The Contribution & Legacy area will unlock automatically.
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// // Criteria Item Component
// const CriteriaItem: React.FC<{
//   label: string;
//   current: number;
//   required: number;
//   unit: string;
// }> = ({ label, current, required, unit }) => {
//   const progress = Math.min((current / required) * 100, 100);
//   const isComplete = current >= required;

//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between">
//         <span className="text-sm font-medium">{label}</span>
//         <span className="text-sm text-gray-600">
//           {current} / {required} {unit}
//         </span>
//       </div>
//       <div className="flex items-center gap-2">
//         <Progress value={progress} className="flex-1" />
//         {isComplete ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Circle className="h-4 w-4 text-gray-300" />}
//       </div>
//     </div>
//   );
// };

// // Wheel of Life Visualization Component
// export const WheelOfLife: React.FC = () => {
//   const [wheelData, setWheelData] = useState<{
//     wheel_data: Array<{
//       area_key: string;
//       display_name: string;
//       score: number;
//       category: string;
//       color: string;
//     }>;
//     balance_score: number;
//     last_assessment: string | null;
//   } | null>(null);

//   useEffect(() => {
//     fetchWheelData();
//   }, []);

//   const fetchWheelData = async () => {
//     try {
//       const response = await fetch('/api/v1/life-areas/wheel-data');
//       const data = await response.json();
//       setWheelData(data);
//     } catch (error) {
//       console.error('Failed to fetch wheel data:', error);
//     }
//   };

//   if (!wheelData) {
//     return <div>Loading wheel...</div>;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Your Wheel of Life</CardTitle>
//         <div className="flex items-center gap-4">
//           <div>Balance Score: {wheelData.balance_score.toFixed(1)}/10</div>
//           {wheelData.last_assessment && (
//             <div className="text-sm text-gray-600">
//               Last assessment: {new Date(wheelData.last_assessment).toLocaleDateString()}
//             </div>
//           )}
//         </div>
//       </CardHeader>
//       <CardContent>
//         <div className="space-y-4">
//           {wheelData.wheel_data.map((area) => (
//             <div key={area.area_key} className="space-y-2">
//               <div className="flex items-center justify-between">
//                 <span className="font-medium">{area.display_name}</span>
//                 <span className="text-sm text-gray-600">{area.score.toFixed(1)}/10</span>
//               </div>
//               <Progress
//                 value={(area.score / 10) * 100}
//                 className="h-3"
//                 style={
//                   {
//                     '--progress-background': area.color_class,
//                   } as React.CSSProperties
//                 }
//               />
//               <Badge variant="outline" className="text-xs">
//                 {area.category}
//               </Badge>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6 border-t pt-4">
//           <Button onClick={() => (window.location.href = '/assessments')} className="w-full">
//             Take New Assessment
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Life Area Settings Component
// export const LifeAreaSettings: React.FC = () => {
//   const [preferences, setPreferences] = useState<UserPreferences>({});
//   const [availableOptions, setAvailableOptions] = useState<{ [key: string]: string[] }>({});
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     fetchCurrentPreferences();
//     fetchAvailableOptions();
//   }, []);

//   const fetchCurrentPreferences = async () => {
//     try {
//       const response = await fetch('/api/v1/life-areas/user-preferences');
//       const data = await response.json();
//       setPreferences(data.preferences.customized_display_names || {});
//     } catch (error) {
//       console.error('Failed to fetch preferences:', error);
//     }
//   };

//   const fetchAvailableOptions = async () => {
//     try {
//       const response = await fetch('/api/v1/life-areas/onboarding-options');
//       const data = await response.json();

//       const options: { [key: string]: string[] } = {};
//       data.areas.forEach((area: LifeAreaOption) => {
//         options[area.area_key] = area.alias_options;
//       });
//       setAvailableOptions(options);
//     } catch (error) {
//       console.error('Failed to fetch options:', error);
//     }
//   };

//   const handlePreferenceChange = async (areaKey: string, newDisplayName: string) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(`/api/v1/life-areas/preferences/${areaKey}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           display_name: newDisplayName,
//         }),
//       });

//       if (response.ok) {
//         setPreferences((prev) => ({
//           ...prev,
//           [areaKey]: newDisplayName,
//         }));
//       } else {
//         throw new Error('Failed to update preference');
//       }
//     } catch (error) {
//       console.error('Failed to update preference:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Customize Life Areas</CardTitle>
//         <p className="text-gray-600">Choose how you'd like each life area to be displayed throughout the app.</p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {Object.entries(preferences).map(([areaKey, currentName]) => (
//           <div key={areaKey} className="space-y-3">
//             <div className="flex items-center justify-between">
//               <Label className="text-sm font-medium capitalize">{areaKey.replace('_', ' ')}</Label>
//               <span className="text-sm text-gray-500">Currently: {currentName}</span>
//             </div>

//             <RadioGroup
//               value={currentName}
//               onValueChange={(value) => handlePreferenceChange(areaKey, value)}
//               disabled={isLoading}
//             >
//               {availableOptions[areaKey]?.map((option) => (
//                 <div key={option} className="flex items-center space-x-2">
//                   <RadioGroupItem value={option} id={`${areaKey}-${option}`} />
//                   <Label htmlFor={`${areaKey}-${option}`} className="cursor-pointer text-sm">
//                     {option}
//                   </Label>
//                 </div>
//               ))}
//             </RadioGroup>
//           </div>
//         ))}

//         <div className="border-t pt-4">
//           <p className="text-sm text-gray-600">
//             💡 Your customizations will be reflected throughout the app, including your wheel of life, habit categorization,
//             and assessments.
//           </p>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Life Area Assessment Component
// export const LifeAreaAssessmentForm: React.FC<{
//   areaKey: string;
//   onComplete: () => void;
// }> = ({ areaKey, onComplete }) => {
//   const [assessment, setAssessment] = useState<AssessmentData | null>(null);
//   const [responses, setResponses] = useState<{ [questionId: string]: number }>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchAssessment = async () => {
//       try {
//         const response = await fetch('/api/v1/life-areas/assessments');
//         const data = await response.json();
//         const targetAssessment = data.assessments.find((a: AssessmentData) => a.area_key === areaKey);
//         setAssessment(targetAssessment);
//       } catch (error) {
//         console.error('Failed to fetch assessment:', error);
//       }
//     };
//     fetchAssessment();
//   }, [areaKey]);

//   const handleResponseChange = (questionId: string, score: number) => {
//     setResponses((prev) => ({
//       ...prev,
//       [questionId]: score,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!assessment) return;

//     setIsSubmitting(true);
//     try {
//       const submissionData = {
//         life_area: areaKey,
//         responses: Object.entries(responses).map(([questionId, score]) => ({
//           question_id: questionId,
//           score,
//         })),
//       };

//       const response = await fetch('/api/v1/life-areas/assessments/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(submissionData),
//       });

//       if (response.ok) {
//         onComplete();
//       } else {
//         throw new Error('Failed to submit assessment');
//       }
//     } catch (error) {
//       console.error('Failed to submit assessment:', error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (!assessment) {
//     return <div>Loading assessment...</div>;
//   }

//   const allQuestionsAnswered = assessment.questions.every((q) => responses[q.id] !== undefined);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{assessment.display_name} Assessment</CardTitle>
//         <p className="text-gray-600">{assessment.description}</p>
//         <p className="text-sm text-gray-500">{assessment.instructions}</p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {assessment.questions.map((question, index) => (
//           <div key={question.id} className="space-y-3">
//             <div className="font-medium">
//               {index + 1}. {question.text}
//             </div>

//             <RadioGroup
//               value={responses[question.id]?.toString() || ''}
//               onValueChange={(value) => handleResponseChange(question.id, parseInt(value))}
//             >
//               <div className="grid grid-cols-10 gap-2">
//                 {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
//                   <div key={score} className="flex flex-col items-center space-y-1">
//                     <RadioGroupItem value={score.toString()} id={`${question.id}-${score}`} />
//                     <Label htmlFor={`${question.id}-${score}`} className="cursor-pointer text-xs">
//                       {score}
//                     </Label>
//                   </div>
//                 ))}
//               </div>
//               <div className="mt-1 flex justify-between text-xs text-gray-500">
//                 <span>Very Poor</span>
//                 <span>Outstanding</span>
//               </div>
//             </RadioGroup>
//           </div>
//         ))}

//         <div className="border-t pt-4">
//           <Button onClick={handleSubmit} disabled={!allQuestionsAnswered || isSubmitting} className="w-full">
//             {isSubmitting ? 'Submitting...' : 'Submit Assessment'}
//           </Button>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// // Life Areas Dashboard Component
// export const LifeAreasDashboard: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<'wheel' | 'progress' | 'settings'>('wheel');

//   return (
//     <div className="mx-auto max-w-6xl space-y-6 p-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Your Life Areas</h1>
//         <div className="flex gap-2">
//           <Button variant={activeTab === 'wheel' ? 'default' : 'outline'} onClick={() => setActiveTab('wheel')}>
//             Wheel of Life
//           </Button>
//           <Button variant={activeTab === 'progress' ? 'default' : 'outline'} onClick={() => setActiveTab('progress')}>
//             Progress
//           </Button>
//           <Button variant={activeTab === 'settings' ? 'default' : 'outline'} onClick={() => setActiveTab('settings')}>
//             Settings
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           {activeTab === 'wheel' && <WheelOfLife />}
//           {activeTab === 'progress' && <ContributionUnlockProgress />}
//           {activeTab === 'settings' && <LifeAreaSettings />}
//         </div>

//         <div className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle className="text-lg">Quick Actions</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-2">
//               <Button variant="outline" className="w-full justify-start">
//                 Take Assessment
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 View History
//               </Button>
//               <Button variant="outline" className="w-full justify-start">
//                 Export Data
//               </Button>
//             </CardContent>
//           </Card>

//           {activeTab === 'wheel' && <ContributionUnlockProgress />}
//         </div>
//       </div>
//     </div>
//   );
// };

// const LifeAreaComponents = {
//   LifeAreaOnboarding,
//   ContributionUnlockProgress,
//   WheelOfLife,
//   LifeAreaSettings,
//   LifeAreaAssessmentForm,
//   LifeAreasDashboard,
// };

// export default LifeAreaComponents;
