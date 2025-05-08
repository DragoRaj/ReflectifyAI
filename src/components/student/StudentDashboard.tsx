
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { SignOutButton } from "@/components/SignOutButton";
import { 
  MessageCircle, 
  Sparkles, 
  BookText, 
  Activity,
  BarChart2, 
  User,
  Calendar,
  TrendingUp,
  Bell,
  ArrowRight,
  CheckCircle2,
  Lightbulb
} from "lucide-react";

export default function StudentDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState<string>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  // Mock data
  const wellbeingScore = 7.8;
  const journalStreak = 5;
  const completedMindfulnessSessions = 12;
  const upcomingReminders = [
    { id: 1, title: "Daily Journal", time: "Today", isPriority: false },
    { id: 2, title: "Mindfulness Session", time: "Tomorrow, 9:00 AM", isPriority: true },
  ];
  const wellbeingTips = [
    "Take a 5-minute breathing break between study sessions",
    "Stay hydrated throughout the day",
    "Try to get 8 hours of sleep tonight"
  ];

  const navigateToAnalytics = () => {
    // Create dedicated analytics path instead of using hash navigation
    navigate("/analytics");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-indigo-50/30">
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-indigo-800">
              {greeting}, {profile?.first_name || "Student"}
            </h1>
            <p className="text-slate-600">Welcome to your wellbeing dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button className="p-2 relative rounded-full bg-white border hover:bg-gray-50">
                <Bell className="h-5 w-5 text-indigo-700" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  2
                </span>
              </button>
            </div>
            <Avatar>
              <AvatarFallback className="bg-indigo-100 text-indigo-700">
                {profile?.first_name?.[0]}{profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <SignOutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="col-span-full md:col-span-2 bg-gradient-to-r from-indigo-50 to-indigo-100 border-none shadow-md relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-200/30 rounded-full -mr-10 -mt-10"></div>
            <div className="absolute right-16 bottom-0 w-16 h-16 bg-indigo-200/30 rounded-full -mr-6 -mb-6"></div>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-indigo-900">Your Wellbeing Status</CardTitle>
              <CardDescription>How are you feeling today?</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                <div className="text-center sm:text-left space-y-4 relative z-10">
                  <div className="flex flex-col mt-2">
                    <span className="text-5xl font-bold text-indigo-700">{wellbeingScore}</span>
                    <span className="text-indigo-600 text-sm">out of 10</span>
                  </div>
                  <div className="w-full sm:max-w-xs">
                    <div className="flex justify-between mb-1 text-xs">
                      <span className="text-indigo-700">Current Wellbeing Score</span>
                      <span className="text-indigo-700 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Improving
                      </span>
                    </div>
                    <Progress 
                      value={wellbeingScore * 10} 
                      className="h-2 bg-indigo-200" 
                    />
                  </div>
                </div>
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 transition-all w-full sm:w-auto shadow-md"
                  onClick={() => navigate("/chat")}
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Start Conversation
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-indigo-600">
                Based on your recent activity and check-ins
              </p>
            </CardFooter>
          </Card>

          <Card className="shadow-md border-indigo-100/50 hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                <Calendar className="h-4 w-4 text-indigo-600" />
                Your Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <BookText className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Journal Streak</p>
                    <p className="text-sm text-slate-500">Keep it going!</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-purple-600">{journalStreak}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Mindfulness</p>
                    <p className="text-sm text-slate-500">Sessions completed</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-emerald-600">{completedMindfulnessSessions}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0 flex justify-end">
              <Button 
                variant="ghost" 
                className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 -mr-2"
                onClick={navigateToAnalytics}
              >
                Full Report
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Tabs defaultValue="tools" className="space-y-6">
          <TabsList className="bg-white shadow border p-1">
            <TabsTrigger value="tools" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900">Wellbeing Tools</TabsTrigger>
            <TabsTrigger value="reminders" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900">Reminders</TabsTrigger>
            <TabsTrigger value="tips" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900">Daily Tips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="tools" className="space-y-0 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md border-emerald-100/50 hover:shadow-lg transition-all group hover:translate-y-[-5px] duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-800">
                    <Sparkles className="h-5 w-5 text-emerald-600" />
                    Mindfulness
                  </CardTitle>
                  <CardDescription className="text-emerald-700/70">Take a moment to center yourself</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Guided mindfulness exercises to help you relax, focus, and recharge</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-emerald-600 hover:bg-emerald-700 group-hover:shadow-md"
                    onClick={() => navigate("/mindfulness")}
                  >
                    Start Session
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md border-purple-100/50 hover:shadow-lg transition-all group hover:translate-y-[-5px] duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <BookText className="h-5 w-5 text-purple-600" />
                    Journal
                  </CardTitle>
                  <CardDescription className="text-purple-700/70">Express your thoughts</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Record your thoughts, feelings, and reflections in your private journal</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 group-hover:shadow-md"
                    onClick={() => navigate("/journal")}
                  >
                    Write Entry
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md border-blue-100/50 hover:shadow-lg transition-all group hover:translate-y-[-5px] duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                    Wellbeing Chat
                  </CardTitle>
                  <CardDescription className="text-blue-700/70">Talk through your feelings</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">Have a supportive conversation with our wellbeing assistant</p>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700 group-hover:shadow-md"
                    onClick={() => navigate("/chat")}
                  >
                    Start Chat
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="reminders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                  <Bell className="h-5 w-5 text-indigo-600" />
                  Upcoming Reminders
                </CardTitle>
                <CardDescription>Stay on track with your wellbeing goals</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingReminders.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingReminders.map(reminder => (
                      <div 
                        key={reminder.id} 
                        className={`p-4 rounded-lg border flex items-center justify-between ${
                          reminder.isPriority ? 'bg-amber-50 border-amber-200' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                            reminder.isPriority ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-600'
                          }`}>
                            {reminder.isPriority ? (
                              <Bell className="h-5 w-5" />
                            ) : (
                              <Calendar className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{reminder.title}</p>
                            <p className="text-sm text-slate-500">{reminder.time}</p>
                          </div>
                        </div>
                        <Button size="sm" variant={reminder.isPriority ? "default" : "outline"}>
                          {reminder.isPriority ? 'Do Now' : 'Mark Complete'}
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <CheckCircle2 className="h-12 w-12 text-emerald-200 mb-2" />
                    <p className="text-slate-600">No upcoming reminders</p>
                    <Button variant="link" className="mt-2 text-indigo-600 hover:text-indigo-700">
                      Add a reminder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tips" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Today's Wellbeing Tips
                </CardTitle>
                <CardDescription>Simple actions to improve your wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wellbeingTips.map((tip, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-white flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Lightbulb className="h-5 w-5" />
                      </div>
                      <p className="text-slate-800">{tip}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50">
                <Button variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  View All Tips
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
