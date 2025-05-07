
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Sparkles, MessageSquare, BookOpen, HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [wellbeingScore, setWellbeingScore] = useState<number>(7);
  
  // In a real app, we would fetch this data from the backend
  const studentData = {
    streakDays: 5,
    journalEntries: 12,
    chatInteractions: 23,
    lastAssessmentDate: "3 days ago",
    recentSentiment: "mostly positive",
    suggestedActivities: [
      "5-minute breathing exercise",
      "Quick mindfulness check-in",
      "Express yourself in the journal"
    ]
  };

  // Mock function - in a real app, would store this in the database
  const handleQuickCheck = (score: number) => {
    setWellbeingScore(score);
    
    // Here you would also send this to the backend
    toast.success("Thanks for checking in today!");
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
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
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
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
                  className={`h-10 w-10 rounded-full p-0 ${
                    wellbeingScore === score ? "bg-indigo-600" : ""
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

      <Tabs defaultValue="tools">
        <TabsList className="mb-4">
          <TabsTrigger value="tools">Wellbeing Tools</TabsTrigger>
          <TabsTrigger value="insights">Your Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
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
              <CardFooter>
                <Link to="#chat" className="w-full">
                  <Button variant="outline" className="w-full">Start Conversation</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
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
              <CardFooter>
                <Link to="#mindfulness" className="w-full">
                  <Button variant="outline" className="w-full">Start Session</Button>
                </Link>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
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
              <CardFooter>
                <Link to="#journal" className="w-full">
                  <Button variant="outline" className="w-full">Write Entry</Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommended for You</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {studentData.suggestedActivities.map((activity, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Wellbeing Journey</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Journal Practice</span>
                    <span className="text-sm text-slate-500">{studentData.journalEntries} entries</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Mindfulness Sessions</span>
                    <span className="text-sm text-slate-500">8 sessions</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Chat Interactions</span>
                    <span className="text-sm text-slate-500">{studentData.chatInteractions} conversations</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                
                <div className="bg-indigo-50 p-4 rounded-md">
                  <h3 className="font-medium text-indigo-800 mb-2">
                    <HeartPulse className="inline h-4 w-4 mr-1" /> 
                    Wellbeing Analysis
                  </h3>
                  <p className="text-sm text-slate-700">
                    Your recent interactions show a {studentData.recentSentiment} sentiment. 
                    Your last wellbeing assessment was {studentData.lastAssessmentDate}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
