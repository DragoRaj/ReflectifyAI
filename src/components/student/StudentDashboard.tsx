
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/SignOutButton";
import { 
  MessageCircle, 
  Sparkles, 
  BookText, 
  Activity,
  BarChart2, 
  User
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

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            {greeting}, {profile?.first_name || "Student"}
          </h1>
          <p className="text-slate-600">Welcome to your wellbeing dashboard</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
          <SignOutButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-full md:col-span-2 bg-gradient-to-r from-indigo-50 to-indigo-100 border-none shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Your Wellbeing Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-medium">How are you feeling today?</h3>
                <p className="text-slate-600">Take a moment to check in with yourself</p>
              </div>
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 transition-all w-full sm:w-auto"
                onClick={() => navigate("/chat")}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Start Conversation
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-indigo-100/50 hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Weekly Stats</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-6">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <BarChart2 size={32} />
            </div>
            <p className="text-slate-600">View your wellbeing analytics and track your progress</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              variant="outline" 
              className="w-full border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50"
              onClick={() => navigate("/#analytics")}
            >
              See Analytics
            </Button>
          </CardFooter>
        </Card>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-indigo-800">Wellbeing Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 shadow-md border-emerald-100/50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              Mindfulness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Take a moment to center yourself with guided mindfulness exercises</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              onClick={() => navigate("/mindfulness")}
            >
              Start Session
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 shadow-md border-purple-100/50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookText className="h-5 w-5 text-purple-600" />
              Journal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Express your thoughts, feelings, and reflections in your private journal</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={() => navigate("/journal")}
            >
              Write Entry
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md border-blue-100/50 hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Health Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">Track important aspects of your physical health that impact wellbeing</p>
          </CardContent>
          <CardFooter className="pt-0">
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => navigate("/#health")}
            >
              Track Health
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Access to teacher dashboard for hybrid users */}
      {profile?.email === "teketirajnish@gmail.com" && (
        <div className="mt-8 bg-amber-50 rounded-lg p-4 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-amber-800">Teacher Access</h3>
              <p className="text-sm text-amber-700">You have access to the teacher dashboard</p>
            </div>
            <Button 
              variant="outline"
              className="border-amber-300 hover:bg-amber-100 text-amber-800"
              onClick={() => navigate("/teacher-dashboard")}
            >
              Go to Teacher Dashboard
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
