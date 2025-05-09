
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const challengeOptions = [
  { id: "academic-pressure", label: "Academic Pressure" },
  { id: "social-anxiety", label: "Social Anxiety" },
  { id: "family-issues", label: "Family Issues" },
  { id: "bullying", label: "Bullying" },
  { id: "concentration", label: "Concentration Difficulties" },
  { id: "motivation", label: "Lack of Motivation" },
  { id: "sleep", label: "Sleep Problems" },
  { id: "peer-pressure", label: "Peer Pressure" },
  { id: "self-esteem", label: "Low Self-esteem" },
  { id: "isolation", label: "Social Isolation" },
];

export function TeacherSurvey({ onComplete }: { onComplete: () => void }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    school_name: "",
    grade_level: 0,
    class_section: "",
    class_atmosphere: "",
    observed_student_stress: 5,
    common_challenges: [] as string[],
    intervention_suggestions: "",
    support_resources_needed: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSliderChange = (value: number[]) => {
    setFormData({ ...formData, observed_student_stress: value[0] });
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        common_challenges: [...formData.common_challenges, id],
      });
    } else {
      setFormData({
        ...formData,
        common_challenges: formData.common_challenges.filter((item) => item !== id),
      });
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to submit the survey.");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from("teacher_surveys").insert([
        {
          teacher_id: user.id,
          ...formData,
        },
      ]);
      
      if (error) throw error;
      
      toast.success("Survey submitted successfully!");
      onComplete();
    } catch (error: any) {
      toast.error(error.message || "Error submitting survey");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-indigo-950 dark:to-blue-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <Card className="shadow-lg border-indigo-100 dark:border-indigo-800 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <CardTitle className="text-2xl">Teacher Wellbeing Survey</CardTitle>
            <CardDescription className="text-indigo-100">
              Help us understand how to better support your classroom
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="mb-6">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full"
                  style={{ width: `${(step / 3) * 100}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-gray-500 dark:text-gray-400">
                <span>Classroom Info</span>
                <span>Student Wellbeing</span>
                <span>Support Needs</span>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="school_name">School Name</Label>
                    <Input
                      id="school_name"
                      name="school_name"
                      value={formData.school_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grade_level">Grade Level</Label>
                    <Select
                      value={formData.grade_level.toString()}
                      onValueChange={(value) => setFormData({ ...formData, grade_level: parseInt(value) })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a grade level" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Grade {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class_section">Class Section/Subject</Label>
                    <Input
                      id="class_section"
                      name="class_section"
                      value={formData.class_section}
                      onChange={handleInputChange}
                      placeholder="e.g., Mathematics A, English Literature"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="class_atmosphere">
                      How would you describe the general atmosphere in your classroom?
                    </Label>
                    <Textarea
                      id="class_atmosphere"
                      name="class_atmosphere"
                      value={formData.class_atmosphere}
                      onChange={handleInputChange}
                      placeholder="Please describe the general mood, energy level, and social dynamics of your class"
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label>
                      On a scale of 1-10, how would you rate the overall stress level among your students?
                    </Label>
                    <div className="space-y-2">
                      <Slider
                        value={[formData.observed_student_stress]}
                        min={1}
                        max={10}
                        step={1}
                        onValueChange={handleSliderChange}
                      />
                      <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                        <span>Low Stress (1)</span>
                        <span>High Stress (10)</span>
                      </div>
                      <div className="text-center font-medium text-indigo-600 dark:text-indigo-400">
                        Current selection: {formData.observed_student_stress}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>
                      What common wellbeing challenges have you observed among your students? (Select all that apply)
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {challengeOptions.map((option) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={option.id}
                            checked={formData.common_challenges.includes(option.id)}
                            onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                          />
                          <Label htmlFor={option.id} className="text-sm font-normal">
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="intervention_suggestions">
                      What interventions or activities have you found most effective in supporting student wellbeing?
                    </Label>
                    <Textarea
                      id="intervention_suggestions"
                      name="intervention_suggestions"
                      value={formData.intervention_suggestions}
                      onChange={handleInputChange}
                      placeholder="Share strategies that have worked for you in the classroom"
                      className="min-h-[100px]"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="support_resources_needed">
                      What additional resources or support would help you better address student wellbeing?
                    </Label>
                    <Textarea
                      id="support_resources_needed"
                      name="support_resources_needed"
                      value={formData.support_resources_needed}
                      onChange={handleInputChange}
                      placeholder="Training, materials, professional support, etc."
                      className="min-h-[100px]"
                      required
                    />
                  </div>
                </motion.div>
              )}
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-between border-t p-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1 || isSubmitting}
            >
              Previous
            </Button>
            
            <div>
              {step < 3 ? (
                <Button onClick={handleNext} disabled={isSubmitting}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Survey"
                  )}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
