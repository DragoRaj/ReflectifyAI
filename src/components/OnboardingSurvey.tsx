
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

const OnboardingSurvey = ({ onComplete }: OnboardingSurveyProps) => {
  const { user, profile, refreshProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [fetchingSchools, setFetchingSchools] = useState(true);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);

  // Student survey fields
  const [gradeLevel, setGradeLevel] = useState<number>(9);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [wellbeingScore, setWellbeingScore] = useState<number>(5);
  const [existingConditions, setExistingConditions] = useState<string>("");
  const [copingMechanisms, setCopingMechanisms] = useState<string[]>([]);
  
  // Progress tracking
  const totalSteps = 4;
  const [progress, setProgress] = useState(25);
  
  useEffect(() => {
    setProgress(Math.round((currentStep / totalSteps) * 100));
  }, [currentStep, totalSteps]);

  useEffect(() => {
    async function fetchSchools() {
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("id, name")
          .order("name");

        if (error) throw error;
        
        setSchools(data || []);
      } catch (error: any) {
        console.error("Error fetching schools:", error.message);
        toast.error("Failed to load schools");
      } finally {
        setFetchingSchools(false);
      }
    }

    fetchSchools();
  }, []);

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
    setCopingMechanisms(prev => 
      prev.includes(value) 
        ? prev.filter(item => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Submit onboarding survey
      const { error } = await supabase
        .from('onboarding_surveys')
        .insert({
          student_id: user.id,
          grade_level: gradeLevel,
          baseline_wellbeing_score: wellbeingScore,
          existing_conditions: existingConditions || null,
          preferred_coping_mechanisms: copingMechanisms
        });
      
      if (error) throw error;
      
      // Update the student's profile with the school_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ school_id: selectedSchoolId })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Refresh the profile to update any onboarding flags
      await refreshProfile();
      
      toast.success("Onboarding completed successfully!");
      onComplete();
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast.error(`Error saving your responses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="school">Your School</Label>
              {fetchingSchools ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                </div>
              ) : (
                <Select
                  value={selectedSchoolId}
                  onValueChange={setSelectedSchoolId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your school" />
                  </SelectTrigger>
                  <SelectContent>
                    {schools.map(school => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="grade-level">Grade Level</Label>
              <Input 
                id="grade-level" 
                type="number" 
                min={3} 
                max={12} 
                value={gradeLevel} 
                onChange={(e) => setGradeLevel(parseInt(e.target.value))}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>How would you rate your overall wellbeing right now?</Label>
              <div className="flex items-center space-x-2 pt-2">
                <span className="text-sm text-slate-500">1</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={wellbeingScore}
                  onChange={(e) => setWellbeingScore(parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-sm text-slate-500">10</span>
              </div>
              <div className="flex justify-between mt-1 text-xs text-slate-500">
                <span>Not Good</span>
                <span>Neutral</span>
                <span>Excellent</span>
              </div>
              <div className="text-center mt-2">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-medium">
                  {wellbeingScore}/10
                </span>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="existing-conditions">
                Do you have any health conditions you'd like us to be aware of? (Optional)
              </Label>
              <Textarea
                id="existing-conditions"
                placeholder="e.g., anxiety, ADHD, etc. This information remains private."
                value={existingConditions}
                onChange={(e) => setExistingConditions(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label>What helps you feel better when you're stressed? (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {[
                  { value: 'deep_breathing', label: 'Deep breathing exercises' },
                  { value: 'physical_activity', label: 'Physical activity' },
                  { value: 'talking', label: 'Talking to someone' },
                  { value: 'music', label: 'Listening to music' },
                  { value: 'art', label: 'Drawing or art' },
                  { value: 'quiet_time', label: 'Quiet time alone' },
                  { value: 'writing', label: 'Writing or journaling' },
                  { value: 'nature', label: 'Spending time in nature' }
                ].map(item => (
                  <div key={item.value} className="flex items-center space-x-2">
                    <Checkbox 
                      id={item.value} 
                      checked={copingMechanisms.includes(item.value)} 
                      onCheckedChange={() => handleToggleCopingMechanism(item.value)}
                    />
                    <label htmlFor={item.value} className="text-sm cursor-pointer">
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
                Thank you for completing your profile. Your responses will help us provide the most helpful support for your wellbeing journey.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6 text-left">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Access your personalized wellbeing dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Get resources tailored to your needs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Track your wellbeing progress over time</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Connect with support when you need it</span>
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
          <CardTitle className="text-2xl">Student Onboarding</CardTitle>
          <CardDescription>
            Help us get to know you better so we can support your wellbeing journey
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
          {renderStep()}
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
                (currentStep === 1 && !selectedSchoolId) ||
                (currentStep === 3 && copingMechanisms.length === 0)
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
};

export default OnboardingSurvey;
