
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { School, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface AdminSurveyProps {
  onComplete: () => void;
}

export default function AdminSurvey({ onComplete }: AdminSurveyProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetchingSchools, setFetchingSchools] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(33);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  
  // Admin survey fields
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("");
  const [position, setPosition] = useState<string>("");

  const totalSteps = 3;

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

  const handleSubmit = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get the school name for the selected school ID
      let schoolName = "";
      const selectedSchool = schools.find(s => s.id === selectedSchoolId);
      if (selectedSchool) {
        schoolName = selectedSchool.name;
      }

      // Submit admin survey
      const { error } = await supabase
        .from('admin_surveys')
        .insert({
          admin_id: user.id,
          school_id: selectedSchoolId,
          school_name: schoolName,
          position: position
        });
        
      if (error) throw error;
      
      // Update the admin's profile with the school_id
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ school_id: selectedSchoolId })
        .eq('id', user.id);
        
      if (profileError) throw profileError;
      
      // Refresh the profile to update any onboarding flags
      await refreshProfile();
      
      toast.success("Admin onboarding completed successfully!");
      onComplete();
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast.error(`Error saving your responses: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderAdminSurveyStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="school-select">Select Your School</Label>
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
                    <SelectValue placeholder="Select a school" />
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
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="position">Your Position</Label>
              <Select
                value={position}
                onValueChange={setPosition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="principal">Principal</SelectItem>
                  <SelectItem value="vice_principal">Vice Principal</SelectItem>
                  <SelectItem value="counselor">School Counselor</SelectItem>
                  <SelectItem value="district_admin">District Administrator</SelectItem>
                  <SelectItem value="other">Other Administrator</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="flex flex-col items-center justify-center py-4">
              <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium">You're all set!</h3>
              <p className="text-slate-600 mt-2 max-w-md">
                Thank you for completing your onboarding. You can now access your admin dashboard to monitor student wellbeing.
              </p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-6 text-left">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Access your admin dashboard with comprehensive analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Monitor all classes and students from your school</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Track wellbeing trends and identify areas needing attention</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" />
                  <span>Manage teachers and classes within your school</span>
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
            <School className="h-8 w-8 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">Administrator Onboarding</CardTitle>
          <CardDescription>
            Help us personalize your administrator experience
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
          {renderAdminSurveyStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handlePreviousStep}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          
          {currentStep < totalSteps ? (
            <Button 
              type="button" 
              onClick={handleNextStep}
              disabled={
                (currentStep === 1 && !selectedSchoolId) ||
                (currentStep === 2 && !position)
              }
            >
              Next
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
