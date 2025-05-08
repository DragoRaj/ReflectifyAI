
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SignOutButton } from "@/components/SignOutButton";
import {
  Home,
  User,
  Sparkles,
  Play,
  Pause,
  RefreshCcw,
  CheckCircle,
  Clock,
  Calendar,
  BarChart2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const breathingAnimations = [
  { text: "Breathe in slowly...", duration: 4000 },
  { text: "Hold...", duration: 2000 },
  { text: "Breathe out slowly...", duration: 6000 },
  { text: "Hold...", duration: 2000 }
];

export default function MindfulnessPage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [animationStep, setAnimationStep] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const [pastSessions, setPastSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({
    total: 0,
    thisWeek: 0,
    averageDuration: 0
  });

  useEffect(() => {
    async function fetchMindfulnessSessions() {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("mindfulness_sessions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);

        if (error) {
          throw error;
        }

        setPastSessions(data || []);
        
        // Calculate stats
        if (data && data.length > 0) {
          const totalSessions = data.length;
          const totalDuration = data.reduce((sum, session) => sum + session.duration_seconds, 0);
          const averageDuration = Math.round(totalDuration / totalSessions);
          
          // Get sessions from this week
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
          const sessionsThisWeek = data.filter(session => 
            new Date(session.created_at) >= oneWeekAgo
          ).length;
          
          setSessionStats({
            total: totalSessions,
            thisWeek: sessionsThisWeek,
            averageDuration: averageDuration
          });
        }
        
      } catch (error) {
        console.error("Error fetching mindfulness sessions:", error);
        toast.error("Failed to load session history");
      } finally {
        setLoading(false);
      }
    }

    fetchMindfulnessSessions();
  }, [user]);

  const formatTimeDisplay = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const startSession = (duration = 120) => {
    setSessionDuration(duration);
    setElapsedTime(0);
    setSessionActive(true);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => {
        if (prev + 1 >= duration) {
          endSession();
          return duration;
        }
        return prev + 1;
      });
    }, 1000);
    
    // Start breathing animation
    runBreathingAnimation();
    
    toast.success(`${duration / 60} minute session started`);
  };
  
  const runBreathingAnimation = () => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    const currentStep = animationStep % breathingAnimations.length;
    const step = breathingAnimations[currentStep];
    
    // Start animation for current step
    let progress = 0;
    const animationInterval = setInterval(() => {
      progress += 1;
      setProgressValue(progress * (100 / (step.duration / 100)));
      if (progress * 100 >= step.duration) {
        clearInterval(animationInterval);
      }
    }, 100);
    
    // Schedule next step
    animationRef.current = setTimeout(() => {
      setAnimationStep(prev => prev + 1);
      runBreathingAnimation();
    }, step.duration);
  };

  const endSession = async () => {
    // Clear timers
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (animationRef.current) {
      clearTimeout(animationRef.current);
      animationRef.current = null;
    }
    
    setSessionActive(false);
    
    // Save session to database if it lasted at least 10 seconds
    if (elapsedTime >= 10) {
      try {
        const { error } = await supabase
          .from("mindfulness_sessions")
          .insert([
            {
              user_id: user.id,
              duration_seconds: elapsedTime,
              completed: elapsedTime >= sessionDuration * 0.9 // Mark as completed if at least 90% of planned time
            }
          ]);

        if (error) {
          throw error;
        }
        
        toast.success("Mindfulness session recorded");
        
        // Refresh the session list
        const { data } = await supabase
          .from("mindfulness_sessions")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
          
        setPastSessions(data || []);
        
      } catch (error) {
        console.error("Error saving mindfulness session:", error);
        toast.error("Failed to save session data");
      }
    }
  };

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            Mindfulness
          </h1>
          <p className="text-slate-600">Take a moment to center yourself and find calm</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/")} 
            className="flex items-center gap-1"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Sparkles className="h-5 w-5" />
                Mindfulness Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 mb-4">
                Taking time for mindfulness can help reduce stress, improve focus, and boost your overall wellbeing.
              </p>
              <div className="space-y-2">
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => startSession(60)}
                  disabled={sessionActive}
                >
                  1 Minute Session
                </Button>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => startSession(180)}
                  disabled={sessionActive}
                >
                  3 Minute Session
                </Button>
                <Button 
                  className="w-full bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => startSession(300)}
                  disabled={sessionActive}
                >
                  5 Minute Session
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Your Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Sessions</span>
                  <span className="font-medium">{sessionStats.total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">This week</span>
                  <span className="font-medium">{sessionStats.thisWeek}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Average duration</span>
                  <span className="font-medium">
                    {sessionStats.averageDuration > 0 ? `${formatTimeDisplay(sessionStats.averageDuration)}` : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className={`${sessionActive ? 'bg-emerald-50 border-emerald-100' : ''} h-80`}>
            {sessionActive ? (
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <div className="text-5xl font-bold text-emerald-700 mb-6">
                  {formatTimeDisplay(elapsedTime)}
                </div>
                
                <div className="w-full max-w-md mb-6">
                  <Progress value={progressValue} className="h-3 bg-emerald-100" />
                  <p className="text-emerald-800 mt-2 text-lg">
                    {breathingAnimations[animationStep % breathingAnimations.length].text}
                  </p>
                </div>
                
                <div className="flex gap-4">
                  <Button 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50" 
                    onClick={endSession}
                  >
                    End Session
                  </Button>
                </div>
              </CardContent>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full p-6 text-center">
                <Sparkles className="h-16 w-16 text-emerald-200 mb-4" />
                <h2 className="text-2xl font-bold mb-2">Begin Your Mindfulness Journey</h2>
                <p className="text-slate-600 mb-6 max-w-md">
                  Select a session length from the options on the left to start. 
                  Find a quiet place, sit comfortably, and focus on your breathing.
                </p>
                <Button 
                  className="bg-emerald-600 hover:bg-emerald-700" 
                  onClick={() => startSession(120)}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start 2 Minute Session
                </Button>
              </CardContent>
            )}
          </Card>
          
          <div className="mt-6">
            <h3 className="font-semibold text-lg mb-4">Recent Sessions</h3>
            
            {loading ? (
              <div className="text-center py-8">Loading sessions...</div>
            ) : pastSessions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pastSessions.slice(0, 4).map((session) => (
                  <Card key={session.id} className="border-l-4 border-l-emerald-400">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-emerald-600" />
                          <span className="font-medium">{formatTimeDisplay(session.duration_seconds)}</span>
                        </div>
                        {session.completed ? (
                          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        ) : (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                            Partial
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-slate-500 flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {format(new Date(session.created_at), "PPP")}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-50">
                <CardContent className="p-6 text-center">
                  <p className="text-slate-500">No past sessions yet. Start your mindfulness journey today!</p>
                </CardContent>
              </Card>
            )}
            
            {pastSessions.length > 4 && (
              <div className="mt-4 text-center">
                <Button variant="outline" className="text-emerald-700">
                  <BarChart2 className="h-4 w-4 mr-2" />
                  View All Sessions
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
