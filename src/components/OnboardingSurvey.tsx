
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { CheckboxGroup, CheckboxItem } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { OnboardingSurvey as OnboardingSurveyType } from "@/types/school-types";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface OnboardingSurveyProps {
  onComplete: () => void;
}

export default function OnboardingSurvey({ onComplete }: OnboardingSurveyProps) {
  const { user, profile, refreshProfile } = useAuth();
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<OnboardingSurveyType>>({
    grade_level: 9,
    baseline_wellbeing_score: 5,
    existing_conditions: "",
    preferred_coping_mechanisms: [],
    student_name: profile?.first_name || "",
    gender: "",
    class_section: "",
    mood_today: 5,
    sleep_hours: 7,
    stress_level: 5,
    social_support_level: 5,
    physical_activity_level: "moderate",
    screen_time_hours: 3,
    age: undefined,
    school_name: "",
    diet_quality: "",
    academic_pressure: undefined
  });

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNext = () => {
    window.scrollTo(0, 0);
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async () => {
    try {
      if (!user) {
        toast.error("You must be logged in to complete the survey");
        return;
      }

      setIsSubmitting(true);

      // First, update the user's profile with name if provided
      if (formData.student_name) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ first_name: formData.student_name })
          .eq("id", user.id);
          
        if (profileError) throw profileError;
      }

      // Check if a survey already exists for this user
      const { data: existingSurvey, error: checkError } = await supabase
        .from("onboarding_surveys")
        .select("id")
        .eq("student_id", user.id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let error;
      
      // Only store fields that are defined in the onboarding_surveys table
      const surveyData = {
        grade_level: formData.grade_level!,
        baseline_wellbeing_score: formData.baseline_wellbeing_score!,
        existing_conditions: formData.existing_conditions || null,
        preferred_coping_mechanisms: formData.preferred_coping_mechanisms || [],
        gender: formData.gender || null,
        class_section: formData.class_section || null,
        mood_today: formData.mood_today || 5,
        sleep_hours: formData.sleep_hours || null,
        stress_level: formData.stress_level || null,
        social_support_level: formData.social_support_level || null,
        physical_activity_level: formData.physical_activity_level || null,
        screen_time_hours: formData.screen_time_hours || null,
        completed: true
      };
      
      if (existingSurvey) {
        // Update existing survey
        const { error: updateError } = await supabase
          .from("onboarding_surveys")
          .update(surveyData)
          .eq("id", existingSurvey.id);
          
        error = updateError;
      } else {
        // Create new survey
        const { error: insertError } = await supabase.from("onboarding_surveys").insert({
          student_id: user.id,
          ...surveyData
        });
        
        error = insertError;
      }

      if (error) throw error;

      // Also create/update wellbeing metric
      const { error: metricError } = await supabase.from("wellbeing_metrics").upsert({
        student_id: user.id,
        wellbeing_score: formData.baseline_wellbeing_score,
        sentiment_score: 0,
        stress_level: formData.stress_level
      }, { onConflict: 'student_id' });
      
      if (metricError) throw metricError;

      // Refresh user profile to get any updates
      await refreshProfile();

      toast.success("Survey completed successfully");
      onComplete();
    } catch (error: any) {
      console.error("Survey submission error:", error);
      toast.error(error.message || "Error submitting survey");
    } finally {
      setIsSubmitting(false);
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
    "Mindfulness apps",
    "Talking to a counselor",
    "Sports",
    "Cooking/baking",
    "Playing with pets",
    "Other activities"
  ];

  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 min-h-screen flex items-center justify-center">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeVariants}
        className="w-full"
      >
        <Card className="shadow-xl border-indigo-100 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
            <CardTitle className="text-2xl font-bold">Welcome to Reflectify</CardTitle>
            <div className="flex flex-col gap-2">
              <p className="text-indigo-100">
                Help us personalize your experience - Step {step} of {totalSteps}
              </p>
              <Progress 
                value={(step / totalSteps) * 100} 
                className="h-2 bg-indigo-200/30"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3">About You</h2>
                  <p className="text-slate-600 mb-6">
                    Let's start with some basic information about you.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student_name">Your Full Name</Label>
                    <Input
                      id="student_name"
                      value={formData.student_name || ""}
                      onChange={(e) => handleChange("student_name", e.target.value)}
                      placeholder="Enter your full name"
                      className="border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Your Age</Label>
                    <RadioGroup 
                      id="age"
                      value={formData.age?.toString() || ""}
                      onValueChange={(value) => handleChange("age", parseInt(value))}
                      className="grid grid-cols-4 gap-2"
                    >
                      {[10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((age) => (
                        <div key={age} className="flex items-center space-x-2">
                          <RadioGroupItem value={age.toString()} id={`age-${age}`} />
                          <Label htmlFor={`age-${age}`}>{age} years</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <RadioGroup 
                      id="gender"
                      value={formData.gender || ""}
                      onValueChange={(value) => handleChange("gender", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="male" id="gender-male" />
                        <Label htmlFor="gender-male">Male</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="female" id="gender-female" />
                        <Label htmlFor="gender-female">Female</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="other" id="gender-other" />
                        <Label htmlFor="gender-other">Other</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="prefer_not_to_say" id="gender-prefer" />
                        <Label htmlFor="gender-prefer">Prefer not to say</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3">School Information</h2>
                  <p className="text-slate-600 mb-6">
                    Tell us about your grade and class.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="grade_level">What grade are you in?</Label>
                    <RadioGroup 
                      id="grade_level"
                      value={formData.grade_level?.toString() || ""}
                      onValueChange={(value) => handleChange("grade_level", parseInt(value))}
                      className="grid grid-cols-2 md:grid-cols-4 gap-2"
                    >
                      {[6, 7, 8, 9, 10, 11, 12].map((grade) => (
                        <div key={grade} className="flex items-center space-x-2">
                          <RadioGroupItem value={grade.toString()} id={`grade-${grade}`} />
                          <Label htmlFor={`grade-${grade}`}>Grade {grade}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="class_section">Class Section</Label>
                    <Input
                      id="class_section"
                      value={formData.class_section || ""}
                      onChange={(e) => handleChange("class_section", e.target.value)}
                      placeholder="e.g. A, B, Science, etc."
                      className="border-indigo-200 focus:border-indigo-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="school_name">School Name</Label>
                    <Input
                      id="school_name"
                      value={formData.school_name || ""}
                      onChange={(e) => handleChange("school_name", e.target.value)}
                      placeholder="Enter your school name"
                      className="border-indigo-200 focus:border-indigo-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3">Your Wellbeing</h2>
                  <p className="text-slate-600 mb-6">
                    How would you rate your overall wellbeing?
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>
                      On a scale from 1-10, how would you rate your overall wellbeing?
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
                    
                    <div className="text-center font-semibold text-xl mt-4 text-indigo-600">
                      {formData.baseline_wellbeing_score || 5}
                    </div>
                  </div>
                
                  <div className="space-y-4">
                    <Label>
                      How would you describe your mood today?
                    </Label>
                    
                    <Slider
                      id="mood_today"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.mood_today || 5]}
                      onValueChange={(values) => handleChange("mood_today", values[0])}
                      className="py-4"
                    />
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1 - Very Low</span>
                      <span>10 - Very High</span>
                    </div>
                    
                    <div className="text-center font-semibold text-xl mt-4 text-indigo-600">
                      {formData.mood_today || 5}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3">Lifestyle Information</h2>
                  <p className="text-slate-600 mb-6">
                    These questions help us understand your daily habits.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="sleep_hours">
                      How many hours do you typically sleep each night?
                    </Label>
                    <RadioGroup 
                      id="sleep_hours"
                      value={formData.sleep_hours?.toString() || ""}
                      onValueChange={(value) => handleChange("sleep_hours", parseInt(value))}
                      className="grid grid-cols-2 md:grid-cols-4 gap-2"
                    >
                      {[5, 6, 7, 8, 9, 10].map((hours) => (
                        <div key={hours} className="flex items-center space-x-2">
                          <RadioGroupItem value={hours.toString()} id={`sleep-${hours}`} />
                          <Label htmlFor={`sleep-${hours}`}>{hours} hours</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="physical_activity">
                      How would you describe your physical activity level?
                    </Label>
                    <RadioGroup 
                      id="physical_activity"
                      value={formData.physical_activity_level || ""}
                      onValueChange={(value) => handleChange("physical_activity_level", value)}
                      className="grid grid-cols-1 gap-2"
                    >
                      {["sedentary", "light", "moderate", "active", "very active"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={`activity-${level}`} />
                          <Label htmlFor={`activity-${level}`}>
                            {level === "sedentary" ? "Sedentary (very little exercise)" : 
                             level === "light" ? "Light (light exercise 1-2 days/week)" :
                             level === "moderate" ? "Moderate (moderate exercise 2-3 days/week)" :
                             level === "active" ? "Active (intense exercise 3-5 days/week)" :
                             "Very Active (intense exercise 6-7 days/week)"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="diet_quality">
                      How would you rate the quality of your diet?
                    </Label>
                    <RadioGroup 
                      id="diet_quality"
                      value={formData.diet_quality || ""}
                      onValueChange={(value) => handleChange("diet_quality", value)}
                      className="grid grid-cols-1 gap-2"
                    >
                      {["poor", "fair", "good", "very_good", "excellent"].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level} id={`diet-${level}`} />
                          <Label htmlFor={`diet-${level}`}>
                            {level === "poor" ? "Poor (mostly processed foods, irregular meals)" : 
                             level === "fair" ? "Fair (some healthy foods, somewhat balanced)" :
                             level === "good" ? "Good (mostly balanced, regular meals)" :
                             level === "very_good" ? "Very Good (well-balanced, nutritious)" :
                             "Excellent (optimal nutrition, very well balanced)"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="screen_time">
                      How many hours do you spend on screens daily (outside of school work)?
                    </Label>
                    <RadioGroup 
                      id="screen_time"
                      value={formData.screen_time_hours?.toString() || ""}
                      onValueChange={(value) => handleChange("screen_time_hours", parseInt(value))}
                      className="grid grid-cols-2 md:grid-cols-3 gap-2"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((hours) => (
                        <div key={hours} className="flex items-center space-x-2">
                          <RadioGroupItem value={hours.toString()} id={`screen-${hours}`} />
                          <Label htmlFor={`screen-${hours}`}>
                            {hours < 8 ? `${hours} hours` : "8+ hours"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3">Mental Health and Support</h2>
                  <p className="text-slate-600 mb-6">
                    This helps us understand your support systems and challenges.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>
                      On a scale from 1-10, what is your current stress level?
                    </Label>
                    
                    <Slider
                      id="stress_level"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.stress_level || 5]}
                      onValueChange={(values) => handleChange("stress_level", values[0])}
                      className="py-4"
                    />
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1 - Very Low Stress</span>
                      <span>10 - Very High Stress</span>
                    </div>
                    
                    <div className="text-center font-semibold text-xl mt-4 text-indigo-600">
                      {formData.stress_level || 5}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label>
                      How strong is your social support network?
                    </Label>
                    
                    <Slider
                      id="social_support"
                      min={1}
                      max={10}
                      step={1}
                      value={[formData.social_support_level || 5]}
                      onValueChange={(values) => handleChange("social_support_level", values[0])}
                      className="py-4"
                    />
                    
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>1 - Limited Support</span>
                      <span>10 - Strong Support</span>
                    </div>
                    
                    <div className="text-center font-semibold text-xl mt-4 text-indigo-600">
                      {formData.social_support_level || 5}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="academic_pressure">
                      How would you rate your current level of academic pressure?
                    </Label>
                    <RadioGroup 
                      id="academic_pressure"
                      value={formData.academic_pressure?.toString() || ""}
                      onValueChange={(value) => handleChange("academic_pressure", parseInt(value))}
                      className="grid grid-cols-5 gap-2"
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className="flex items-center space-x-2">
                          <RadioGroupItem value={level.toString()} id={`academic-${level}`} />
                          <Label htmlFor={`academic-${level}`}>
                            {level === 1 ? "Very Low" : 
                             level === 2 ? "Low" :
                             level === 3 ? "Moderate" :
                             level === 4 ? "High" :
                             "Very High"}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="existing_conditions">
                      Do you have any conditions that might affect your wellbeing at school?
                    </Label>
                    <Textarea
                      id="existing_conditions"
                      placeholder="For example: anxiety, ADHD, depression, etc."
                      value={formData.existing_conditions || ""}
                      onChange={(e) => handleChange("existing_conditions", e.target.value)}
                      className="min-h-[100px] border-indigo-200 focus:border-indigo-400"
                    />
                    <p className="text-xs text-slate-500">This information is kept confidential and helps us support you better.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-semibold mb-3">Your Coping Strategies</h2>
                  <p className="text-slate-600 mb-6">
                    What activities help you feel better when you're stressed or upset?
                  </p>
                </div>
                
                <div className="space-y-4">
                  <CheckboxGroup 
                    value={formData.preferred_coping_mechanisms || []}
                    onValueChange={(value) => handleChange("preferred_coping_mechanisms", value)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                  >
                    {copingMechanisms.map((mechanism) => (
                      <div key={mechanism} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50 transition-colors duration-300">
                        <CheckboxItem value={mechanism} id={`mechanism-${mechanism}`} />
                        <Label htmlFor={`mechanism-${mechanism}`} className="cursor-pointer w-full">
                          {mechanism}
                        </Label>
                      </div>
                    ))}
                  </CheckboxGroup>
                  
                  <div className="bg-blue-50 p-4 rounded-md mt-4 border border-blue-100 transition-all duration-300 transform hover:scale-[1.01]">
                    <p className="text-sm text-blue-800">
                      Thank you for completing this survey! Your responses will help us personalize your Reflectify experience.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>
          
          <CardFooter className="px-6 py-4 bg-slate-50 flex justify-between">
            {step > 1 ? (
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
                disabled={isSubmitting}
              >
                Back
              </Button>
            ) : (
              <div></div>
            )}
            
            {step < totalSteps ? (
              <Button 
                onClick={handleNext}
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                Continue
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-indigo-600 hover:bg-indigo-700 text-white transition-all duration-300 transform hover:scale-[1.02]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Complete Survey"
                )}
              </Button>
            )}
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
