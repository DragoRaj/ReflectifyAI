
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { OnboardingSurvey as OnboardingSurveyType } from "@/types/school-types";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<OnboardingSurveyType>>({
    grade_level: 9,
    baseline_wellbeing_score: 5,
    existing_conditions: "",
    preferred_coping_mechanisms: [],
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to complete the survey");
        return;
      }

      const { error } = await supabase.from("onboarding_surveys").insert({
        student_id: user.id,
        grade_level: formData.grade_level!,
        baseline_wellbeing_score: formData.baseline_wellbeing_score!,
        existing_conditions: formData.existing_conditions || null,
        preferred_coping_mechanisms: formData.preferred_coping_mechanisms || [],
        completed: true
      });

      if (error) throw error;

      toast.success("Survey completed successfully");
      onComplete();
    } catch (error: any) {
      toast.error(error.message || "Error submitting survey");
    }
  };

  const copingMechanisms = [
    "Deep breathing",
    "Physical exercise",
    "Talking with friends",
    "Journaling",
    "Art and creativity",
    "Music",
    "Meditation",
    "Time in nature",
    "Reading",
    "Other activities"
  ];

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="shadow-lg border-indigo-100">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl">Welcome to Reflectify</CardTitle>
          <p className="text-indigo-100">
            Help us get to know you better - Step {step} of 4
          </p>
        </CardHeader>
        <CardContent className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">About You</h2>
                <p className="text-slate-600 mb-4">
                  Let's start with some basic information to personalize your experience.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="grade_level">What grade are you in?</Label>
                  <RadioGroup 
                    id="grade_level"
                    value={formData.grade_level?.toString()}
                    onValueChange={(value) => handleChange("grade_level", parseInt(value))}
                    className="grid grid-cols-3 gap-2"
                  >
                    {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                      <div key={grade} className="flex items-center space-x-2">
                        <RadioGroupItem value={grade.toString()} id={`grade-${grade}`} />
                        <Label htmlFor={`grade-${grade}`}>Grade {grade}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Your Wellbeing</h2>
                <p className="text-slate-600 mb-4">
                  How would you rate your overall wellbeing right now?
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label>
                    On a scale from 1-10, how would you rate your wellbeing today?
                  </Label>
                  
                  <Slider
                    id="wellbeing"
                    min={1}
                    max={10}
                    step={1}
                    value={[formData.baseline_wellbeing_score || 5]}
                    onValueChange={(values) => handleChange("baseline_wellbeing_score", values[0])}
                    className="py-4"
                  />
                  
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>1 - Not so great</span>
                    <span>5 - Okay</span>
                    <span>10 - Excellent</span>
                  </div>
                  
                  <div className="text-center font-semibold text-xl mt-4">
                    {formData.baseline_wellbeing_score || 5}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Health Information</h2>
                <p className="text-slate-600 mb-4">
                  This information is kept confidential and helps us support you better.
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Note: This is optional. Only share what you're comfortable with.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="existing_conditions">
                    Do you have any conditions that might affect your wellbeing at school?
                  </Label>
                  <Textarea
                    id="existing_conditions"
                    placeholder="For example: anxiety, ADHD, depression, etc."
                    value={formData.existing_conditions || ""}
                    onChange={(e) => handleChange("existing_conditions", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-3">Your Coping Mechanisms</h2>
                <p className="text-slate-600 mb-4">
                  What activities help you feel better when you're stressed or upset?
                </p>
              </div>
              
              <div className="space-y-4">
                <CheckboxGroup 
                  value={formData.preferred_coping_mechanisms || []}
                  onValueChange={(value) => handleChange("preferred_coping_mechanisms", value)}
                  className="grid grid-cols-2 gap-2"
                >
                  {copingMechanisms.map((mechanism) => (
                    <div key={mechanism} className="flex items-center space-x-2">
                      <CheckboxItem value={mechanism} id={`mechanism-${mechanism}`} />
                      <Label htmlFor={`mechanism-${mechanism}`}>{mechanism}</Label>
                    </div>
                  ))}
                </CheckboxGroup>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {step < 4 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Complete</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
