import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckboxItem } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  BookOpen,
  School
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(25);

  // Student survey fields
  const [gradeLevel, setGradeLevel] = useState<number>(9);
  const [baselineWellbeingScore, setBaselineWellbeingScore] = useState<number>(7);
  const [existingConditions, setExistingConditions] = useState<string>("");
  const [preferredCopingMechanisms, setPreferredCopingMechanisms] = useState<string[]>([]);
  
  // Teacher survey fields
  const [schoolName, setSchoolName] = useState<string>("");
  const [teacherGradeLevel, setTeacherGradeLevel] = useState<number>(9);
  const [classSection, setClassSection] = useState<string>("");
  const [observedStudentStress, setObservedStudentStress] = useState<number>(5);
  const [classAtmosphere, setClassAtmosphere] = useState<string>("");
  const [commonChallenges, setCommonChallenges] = useState<string[]>([]);
  const [supportNeeded, setSupportNeeded] = useState<string>("");
  const [interventions, setInterventions] = useState<string>("");

  const isStudent = profile?.role === 'student';
  const isTeacher = profile?.role === 'teacher';
  const totalSteps = isStudent ? 4 : 5;

  useEffect(() => {
    setProgress(Math.round((currentStep / totalSteps) * 100));
  }, [currentStep, totalSteps]);

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleToggleCopingMechanism = (value: string) => {
    setPreferredCopingMechanisms(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };
  
  const handleToggleChallenge = (value: string) => {
    setCommonChallenges(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      if (isStudent) {
        // Submit student survey
        const { error } = await supabase
          .from('onboarding_surveys')
          .insert({
            student_id: user.id,
            grade_level: gradeLevel,
            baseline_wellbeing_score: baselineWellbeingScore,
            existing_conditions: existingConditions || null,
            preferred_coping_mechanisms: preferredCopingMechanisms,
            completed: true
          });
          
        if (error) throw error;
      } else if (isTeacher) {
        // Submit teacher survey
        const { error } = await supabase
          .from('teacher_surveys')
          .insert({
            teacher_id: user.id,
            school_name: schoolName,
            grade_level: teacherGradeLevel,
            class_section: classSection,
            observed_student_stress: observedStudentStress,
            class_atmosphere: classAtmosphere,
            common_challenges: commonChallenges,
            support_resources_needed: supportNeeded,
            intervention_suggestions: interventions || null
          });
          
        if (error) throw error;
      }
      
      // Refresh the profile to update any onboarding flags
      await refreshProfile();
      
      toast.success(`${isStudent ? "Student" : "Teacher"} onboarding completed successfully!`);
      onComplete();
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast.error(`Error saving your responses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStudentSurveyStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="grade-level">What grade are you in?</Label>
              <div className="flex items-center gap-4">
                <Input 
                  type="number" 
                  id="grade-level" 
                  min={6} 
                  max={12} 
                  value={gradeLevel} 
                  onChange={(e) => setGradeLevel(parseInt(e.target.value))} 
                  className="w-24" 
                />
                <span className="text-sm text-slate-500">Grade {gradeLevel}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wellbeing">How would you rate your overall wellbeing right now?</Label>
              <div className="pt-2">
                <Slider
                  id="wellbeing"
                  defaultValue={[baselineWellbeingScore]}
                  max={10}
                  step={1}
                  onValueChange={(values) => setBaselineWellbeingScore(values[0])}
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>1 - Struggling</span>
                  <span>5 - Okay</span>
                  <span>10 - Great</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge variant="outline" className="bg-slate-100 text-indigo-900">
                  Your rating: {baselineWellbeingScore}/10
                </Badge>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="conditions">
                Do you have any existing conditions that might affect your wellbeing? (Optional)
              </Label>
              <Textarea
                id="conditions"
                placeholder="For example: anxiety, ADHD, etc."
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
                className="h-24"
              />
              <p className="text-xs text-slate-500">
                This information is private and will only be used to personalize your experience.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">Which of these activities help you feel better when stressed?</Label>
              <p className="text-sm text-slate-500 mb-4">
                Select all that apply. This helps us recommend the most helpful activities for you.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { value: 'meditation', label: 'Meditation/Mindfulness' },
                  { value: 'exercise', label: 'Physical Exercise' },
                  { value: 'music', label: 'Listening to Music' },
                  { value: 'talking', label: 'Talking with Friends' },
                  { value: 'journaling', label: 'Journaling' },
                  { value: 'art', label: 'Art/Creative Expression' },
                  { value: 'nature', label: 'Being in Nature' },
                  { value: 'reading', label: 'Reading' }
                ].map(item => (
                  <div 
                    key={item.value}
                    className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                      preferredCopingMechanisms.includes(item.value) 
                        ? 'bg-indigo-50 border-indigo-300' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleToggleCopingMechanism(item.value)}
                  >
                    <CheckboxItem 
                      id={item.value}
                      checked={preferredCopingMechanisms.includes(item.value)} 
                      onCheckedChange={() => handleToggleCopingMechanism(item.value)}
                    />
                    <label
                      htmlFor={item.value}
                      className="w-full cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium">You're all set!</h3>
              <p className="text-slate-600 mt-2 max-w-md">
                Thank you for completing your onboarding. Your responses will help us personalize your wellbeing journey.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6 text-left">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Access your personalized dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Use the wellbeing tools like the journal and mindfulness activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Get recommendations based on your preferences</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Track your progress over time</span>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const renderTeacherSurveyStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="school-name">School Name</Label>
              <Input 
                id="school-name"
                placeholder="Enter your school name"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-grade-level">Grade Level You Teach</Label>
                <Input 
                  type="number" 
                  id="teacher-grade-level" 
                  min={6} 
                  max={12} 
                  value={teacherGradeLevel} 
                  onChange={(e) => setTeacherGradeLevel(parseInt(e.target.value))} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="class-section">Class/Section</Label>
                <Input 
                  id="class-section"
                  placeholder="e.g. 9A, Science"
                  value={classSection}
                  onChange={(e) => setClassSection(e.target.value)}
                />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>How would you rate the overall stress level of students in your class?</Label>
              <div className="pt-2">
                <Slider
                  defaultValue={[observedStudentStress]}
                  max={10}
                  step={1}
                  onValueChange={(values) => setObservedStudentStress(values[0])}
                />
                <div className="flex justify-between mt-2 text-sm text-slate-500">
                  <span>1 - Low Stress</span>
                  <span>5 - Moderate</span>
                  <span>10 - High Stress</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge variant="outline" className="bg-slate-100 text-indigo-900">
                  Your rating: {observedStudentStress}/10
                </Badge>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="class-atmosphere">How would you describe the general atmosphere in your classroom?</Label>
              <RadioGroup 
                id="class-atmosphere" 
                value={classAtmosphere} 
                onValueChange={setClassAtmosphere}
                className="flex flex-col space-y-1 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="positive" id="positive" />
                  <Label htmlFor="positive">Positive and energetic</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="focused" id="focused" />
                  <Label htmlFor="focused">Focused and productive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="mixed" id="mixed" />
                  <Label htmlFor="mixed">Mixed, depends on the day</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="tense" id="tense" />
                  <Label htmlFor="tense">Sometimes tense or anxious</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="struggling" id="struggling" />
                  <Label htmlFor="struggling">Students are struggling</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label className="text-base">What are the most common wellbeing challenges you observe in your students?</Label>
              <p className="text-sm text-slate-500 mb-4">
                Select all that apply. This helps us provide relevant resources.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {[
                  { value: 'test_anxiety', label: 'Test/Exam Anxiety' },
                  { value: 'social_issues', label: 'Social/Friendship Issues' },
                  { value: 'fatigue', label: 'Fatigue/Low Energy' },
                  { value: 'lack_focus', label: 'Difficulty Focusing' },
                  { value: 'low_motivation', label: 'Low Motivation' },
                  { value: 'perfectionism', label: 'Perfectionism' },
                  { value: 'home_stress', label: 'Home/Family Stress' },
                  { value: 'behavioral', label: 'Behavioral Concerns' },
                  { value: 'emotional', label: 'Emotional Regulation' },
                  { value: 'academic', label: 'Academic Pressure' }
                ].map(item => (
                  <div 
                    key={item.value}
                    className={`flex items-center space-x-2 rounded-md border p-3 cursor-pointer ${
                      commonChallenges.includes(item.value) 
                        ? 'bg-indigo-50 border-indigo-300' 
                        : 'hover:bg-slate-50'
                    }`}
                    onClick={() => handleToggleChallenge(item.value)}
                  >
                    <CheckboxItem 
                      id={`challenge-${item.value}`}
                      checked={commonChallenges.includes(item.value)} 
                      onCheckedChange={() => handleToggleChallenge(item.value)}
                    />
                    <label
                      htmlFor={`challenge-${item.value}`}
                      className="w-full cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="support-needed">
                What resources or support would help you better address student wellbeing in your classroom?
              </Label>
              <Textarea
                id="support-needed"
                placeholder="For example: training materials, classroom activities, etc."
                value={supportNeeded}
                onChange={(e) => setSupportNeeded(e.target.value)}
                className="h-24"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interventions">
                Do you have any specific intervention ideas that would help your students? (Optional)
              </Label>
              <Textarea
                id="interventions"
                placeholder="Share any ideas you have for interventions or activities..."
                value={interventions}
                onChange={(e) => setInterventions(e.target.value)}
                className="h-24"
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium">Thank you!</h3>
              <p className="text-slate-600 mt-2 max-w-md">
                You're all set! Your responses will help us provide the most relevant resources and insights for your classroom.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6 text-left">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Access your teacher dashboard with wellbeing analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Monitor class-level wellbeing trends and insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Get recommendations for classroom wellbeing activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Identify students who may need additional support</span>
                </li>
              </ul>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-blue-50 p-4 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-indigo-100 flex items-center justify-center">
            {isStudent ? (
              <BookOpen className="h-8 w-8 text-indigo-600" />
            ) : (
              <School className="h-8 w-8 text-indigo-600" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isStudent ? "Student Onboarding" : "Teacher Onboarding"}
          </CardTitle>
          <CardDescription>
            {isStudent 
              ? "Help us personalize your wellbeing experience" 
              : "Help us understand your classroom needs"
            }
          </CardDescription>
          
          <div className="w-full mt-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-slate-500">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>{progress}% Complete</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          {isStudent ? renderStudentSurveyStep() : renderTeacherSurveyStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={
                (isTeacher && currentStep === 1 && (!schoolName || !classSection)) ||
                (isTeacher && currentStep === 2 && !classAtmosphere) ||
                (isTeacher && currentStep === 3 && commonChallenges.length === 0) ||
                (isTeacher && currentStep === 4 && !supportNeeded)
              }
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              type="button" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Complete"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
