import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, MessageSquare, BookOpen, HeartPulse, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { saveWellbeingMetric, getRecommendedActivities } from "@/utils/wellbeingUtils";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export default function StudentDashboard() {
  const { user, profile } = useAuth();
  const [wellbeingScore, setWellbeingScore] = useState<number>(7);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [studentData, setStudentData] = useState({
    streakDays: 0,
    journalEntries: 0,
    chatInteractions: 0,
    lastAssessmentDate: "Never",
    recentSentiment: "unknown",
    suggestedActivities: [
      "Loading your suggestions...",
      "Please wait...",
      "Analyzing your data..."
    ]
  });

  useEffect(() => {
    // Fetch actual student data from backend
    const fetchStudentData = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // Get wellbeing metrics
        const { data: metrics } = await supabase
          .from("wellbeing_metrics")
          .select("*")
          .eq("student_id", user.id)
          .order("measured_at", { ascending: false })
          .limit(10);

        // Get onboarding survey for preferences
        const { data: survey } = await supabase
          .from("onboarding_surveys")
          .select("*")
          .eq("student_id", user.id)
          .maybeSingle();

        if (metrics && metrics.length > 0) {
          // Set most recent wellbeing score
          setWellbeingScore(metrics[0].wellbeing_score || 7);
          
          // Calculate streak (consecutive days with interactions)
          // This is simplified - a real implementation would be more robust
          const uniqueDays = new Set();
          metrics.forEach(metric => {
            const date = new Date(metric.measured_at).toDateString();
            uniqueDays.add(date);
          });
          
          // Get AI-recommended activities
          const activitiesList = await getRecommendedActivities(
            metrics[0].wellbeing_score || 5,
            metrics[0].stress_level || 5,
            survey?.preferred_coping_mechanisms || []
          );
          
          setStudentData(prev => ({
            ...prev,
            streakDays: uniqueDays.size,
            chatInteractions: metrics.length,
            lastAssessmentDate: new Date(metrics[0].measured_at).toLocaleDateString(),
            suggestedActivities: activitiesList
          }));
        } else if (survey) {
          // If no metrics yet but we have survey data
          const activitiesList = await getRecommendedActivities(
            survey.baseline_wellbeing_score || 5,
            survey.baseline_wellbeing_score || 5,
            survey.preferred_coping_mechanisms || []
          );
          
          setStudentData(prev => ({
            ...prev,
            suggestedActivities: activitiesList
          }));
        }
      } catch (error) {
        console.error("Error fetching student data:", error);
        toast.error("Could not load your data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStudentData();
  }, [user]);

  // Mock function - in a real app, would store this in the database
  const handleQuickCheck = async (score: number) => {
    setWellbeingScore(score);
    
    if (!user) {
      toast.error("You must be logged in to save your check-in");
      return;
    }
    
    try {
      // Save the wellbeing metric
      const saved = await saveWellbeingMetric(user.id, score);
      if (saved) {
        toast.success("Thanks for checking in today!");
        
        // Refresh suggested activities
        const activitiesList = await getRecommendedActivities(score, 5);
        setStudentData(prev => ({
          ...prev,
          suggestedActivities: activitiesList
        }));
      }
    } catch (error) {
      console.error("Error saving wellbeing check:", error);
      toast.error("Unable to save your response");
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="p-4 space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-800">
            Welcome back, {profile?.first_name || "Student"}
          </h1>
          <p className="text-slate-600">How are you feeling today?</p>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-slate-500">Your wellbeing streak</div>
          <div className="text-xl font-bold text-indigo-600">{studentData.streakDays} days</div>
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-indigo-800">Today's Quick Check-in</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p>How would you rate your mood right now?</p>
              <div className="flex justify-between">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                  <Button 
                    key={score}
                    variant={wellbeingScore === score ? "default" : "outline"}
                    className={`h-12 w-12 rounded-full p-0 transition-all duration-300 ${
                      wellbeingScore === score 
                        ? "bg-indigo-600 ring-2 ring-indigo-300 ring-offset-2" 
                        : "border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50"
                    }`}
                    onClick={() => handleQuickCheck(score)}
                  >
                    {score}
                  </Button>
                ))}
              </div>
              <div className="flex justify-between text-sm text-slate-500 px-1">
                <span>Not good</span>
                <span>Excellent</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-slate-500">
              Your responses help us personalize your experience and provide better support.
            </p>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="mb-4 w-full bg-slate-100 p-1">
            <TabsTrigger 
              value="tools" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              Wellbeing Tools
            </TabsTrigger>
            <TabsTrigger 
              value="insights" 
              className="flex-1 data-[state=active]:bg-white data-[state=active]:text-indigo-700 data-[state=active]:shadow-sm"
            >
              Your Insights
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="overflow-hidden border border-slate-200 hover:border-indigo-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Chat Assistant</CardTitle>
                    <MessageSquare className="h-4 w-4 text-indigo-500" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-slate-500">
                    Talk about your day, concerns, or ask for advice.
                  </p>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <Link to="#chat" className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full group border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
                    >
                      Start Conversation
                      <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden border border-slate-200 hover:border-indigo-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Mindfulness</CardTitle>
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-slate-500">
                    Take a moment to breathe and center yourself.
                  </p>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <Link to="#mindfulness" className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full group border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
                    >
                      Start Session
                      <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              
              <Card className="overflow-hidden border border-slate-200 hover:border-indigo-300 transition-colors duration-300 shadow-sm hover:shadow-md">
                <CardHeader className="pb-2 bg-gradient-to-r from-indigo-50 to-indigo-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-medium">Journal</CardTitle>
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <p className="text-sm text-slate-500">
                    Express your thoughts, feelings, and experiences.
                  </p>
                </CardContent>
                <CardFooter className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <Link to="#journal" className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full group border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300"
                    >
                      Write Entry
                      <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>

            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-slate-100">
                <ul className="space-y-3 py-2">
                  {studentData.suggestedActivities.map((activity, index) => (
                    <motion.li 
                      key={index} 
                      className="flex items-center gap-3 py-2 px-2 rounded-md hover:bg-slate-50"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="rounded-full bg-indigo-100 p-1.5">
                        <Sparkles className="h-4 w-4 text-indigo-500" />
                      </div>
                      <span className="text-slate-700">{activity}</span>
                    </motion.li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="insights">
            <div className="space-y-6">
              <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
                  <CardTitle>Your Wellbeing Journey</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 py-6">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Journal Practice</span>
                      <span className="text-sm text-slate-500">{studentData.journalEntries} entries</span>
                    </div>
                    <Progress value={65} className="h-2 bg-slate-100" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Mindfulness Sessions</span>
                      <span className="text-sm text-slate-500">8 sessions</span>
                    </div>
                    <Progress value={40} className="h-2 bg-slate-100" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Chat Interactions</span>
                      <span className="text-sm text-slate-500">{studentData.chatInteractions} conversations</span>
                    </div>
                    <Progress value={85} className="h-2 bg-slate-100" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-4 rounded-md border border-indigo-100"
                  >
                    <h3 className="font-medium text-indigo-800 mb-2 flex items-center">
                      <HeartPulse className="inline h-5 w-5 mr-2 text-indigo-600" /> 
                      Wellbeing Analysis
                    </h3>
                    <p className="text-slate-700">
                      Your recent interactions show a {studentData.recentSentiment} sentiment. 
                      Your last wellbeing assessment was {studentData.lastAssessmentDate}.
                    </p>
                  </motion.div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
