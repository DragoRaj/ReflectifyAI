
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignOutButton } from "@/components/SignOutButton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart, 
  Pie, 
  Cell
} from "recharts";
import { 
  AlertCircle, 
  FileText, 
  Users, 
  User, 
  Search,
  Bell,
  BarChart2,
  Brain,
  CalendarClock,
  MessageCircleQuestion,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [insights, setInsights] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(3); // Mock notification count

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch students data
        const { data: studentsData, error: studentsError } = await supabase
          .from("profiles")
          .select(`
            id, 
            first_name, 
            last_name, 
            email, 
            role
          `)
          .eq("role", "student");

        if (studentsError) throw studentsError;
        
        // Process students with well-being data (mock data for now)
        const processedStudents = studentsData.map((student: any) => {
          return {
            ...student,
            wellbeing_score: Math.floor(Math.random() * 3 + 6), // Random score between 6-9
            trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
            last_check_in: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString() // Random date in last 7 days
          };
        });
        
        setStudents(processedStudents || []);
        
        // Fetch mock insights
        const mockInsights = [
          {
            id: 1,
            title: "Well-being Trend Alert",
            description: "3 students showed declining wellbeing scores this week",
            type: "alert", 
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            title: "Journal Analysis",
            description: "Several students mentioned exam stress in recent journal entries",
            type: "insight",
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3, 
            title: "Activity Recommendation",
            description: "Consider scheduling a mindfulness session before the upcoming exams",
            type: "recommendation",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setInsights(mockInsights);
        setLoading(false);
        
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        setLoading(false);
      }
    }

    if (profile) {
      fetchDashboardData();
    }
  }, [profile]);

  // Mock data for charts
  const wellbeingOverTimeData = [
    { month: "Jan", average: 7.2 },
    { month: "Feb", average: 7.0 },
    { month: "Mar", average: 7.5 },
    { month: "Apr", average: 7.8 },
    { month: "May", average: 7.4 },
  ];

  const concernsByTypeData = [
    { type: "Academic", count: 8, color: "#8b5cf6" },
    { type: "Social", count: 5, color: "#3b82f6" },
    { type: "Emotional", count: 7, color: "#ef4444" },
    { type: "Behavioral", count: 3, color: "#f97316" },
    { type: "Health", count: 4, color: "#10b981" },
  ];
  
  const activityData = [
    { name: "Journal Entries", value: 42, color: "#8b5cf6" },
    { name: "Chat Sessions", value: 28, color: "#3b82f6" },
    { name: "Mindfulness", value: 15, color: "#10b981" }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            Teacher Dashboard
          </h1>
          <p className="text-slate-600">Monitor student wellbeing and insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <button className="p-2 relative rounded-full bg-white border hover:bg-gray-50">
              <Bell className="h-5 w-5 text-indigo-700" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {notifications}
              </span>
            </button>
          </div>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-white shadow-sm border hover:bg-gray-50">
            <User className="h-4 w-4" />
            My Profile
          </Button>
          <SignOutButton />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-8">
        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 shadow border-indigo-100/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-indigo-700" />
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-indigo-900">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 shadow border-emerald-100/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Brain className="h-4 w-4 text-emerald-700" />
              Average Wellbeing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900">7.4<span className="text-sm text-emerald-700/70 ml-1">/ 10</span></div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 shadow border-amber-100/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-700" />
              Need Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-900">3</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 shadow border-purple-100/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-purple-700" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">18<span className="text-sm text-purple-700/70 ml-1">today</span></div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white shadow border p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900">Overview</TabsTrigger>
          <TabsTrigger value="students" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900">Students</TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-900">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <Card className="lg:col-span-8 shadow-md border-indigo-100/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-indigo-600" />
                  Wellbeing Trends
                </CardTitle>
                <CardDescription>Class average over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={wellbeingOverTimeData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" />
                    <YAxis domain={[0, 10]} stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e2e8f0' 
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#6366f1" 
                      strokeWidth={2} 
                      name="Class Average Wellbeing"
                      dot={{r: 4, fill: "#6366f1", stroke: "#4f46e5", strokeWidth: 1}}
                      activeDot={{r: 6, fill: "#4f46e5"}}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="lg:col-span-4 shadow-md border-indigo-100/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                  <MessageCircleQuestion className="h-5 w-5 text-indigo-600" />
                  Activity Breakdown
                </CardTitle>
                <CardDescription>Student engagement by feature</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={activityData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      label={(entry) => entry.name}
                    >
                      {activityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} sessions`, name]}
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e2e8f0' 
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-md border-indigo-100/50">
              <CardHeader>
                <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-indigo-600" />
                  Concern Categories
                </CardTitle>
                <CardDescription>Distribution of student concerns</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={concernsByTypeData} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="type" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        borderRadius: '8px', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                        border: '1px solid #e2e8f0' 
                      }} 
                    />
                    <Legend verticalAlign="bottom" height={36} />
                    <Bar 
                      dataKey="count" 
                      name="Number of Concerns" 
                      radius={[4, 4, 0, 0]}
                    >
                      {concernsByTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card className="shadow-md border-indigo-100/50">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    Teacher Insights
                  </CardTitle>
                  <CardDescription>AI-generated recommendations</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">
                  View All
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <div 
                      key={insight.id} 
                      className="rounded-lg border p-4 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-indigo-900 flex items-center gap-2">
                            {insight.type === 'alert' && <AlertCircle className="h-4 w-4 text-red-500" />}
                            {insight.type === 'insight' && <BarChart2 className="h-4 w-4 text-blue-500" />}
                            {insight.type === 'recommendation' && <FileText className="h-4 w-4 text-green-500" />}
                            {insight.title}
                            {insight.type === 'alert' && <Badge variant="destructive" className="ml-2 text-xs">Action needed</Badge>}
                          </h3>
                          <p className="text-sm text-slate-600 mt-1">{insight.description}</p>
                          <p className="text-xs text-slate-500 mt-2">
                            {new Date(insight.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" className="rounded-full h-8 w-8">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-slate-50/50 px-6 py-3">
                <Button variant="ghost" className="w-full justify-center text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                  Load More Insights
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="students">
          <Card className="shadow-md border-indigo-100/50">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6">
              <CardTitle className="text-lg text-indigo-900">Student Directory</CardTitle>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-white"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-b">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Wellbeing</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Trend</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Last Check-in</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students
                        .filter((student: any) => {
                          const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
                          const email = (student.email || '').toLowerCase();
                          const term = searchTerm.toLowerCase();
                          return fullName.includes(term) || email.includes(term);
                        })
                        .map((student: any) => (
                          <tr 
                            key={student.id}
                            className="hover:bg-slate-50"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback className="bg-indigo-100 text-indigo-700">
                                    {student.first_name?.[0]}{student.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="font-medium text-slate-900">
                                  {student.first_name} {student.last_name}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {student.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-50 text-blue-700">
                                {student.wellbeing_score} / 10
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {getTrendIcon(student.trend)}
                                <span className="ml-1 text-sm capitalize">
                                  {student.trend}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                              {new Date(student.last_check_in).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700">View Profile</Button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8">
                  <Users className="h-12 w-12 text-slate-300 mb-2" />
                  <p className="text-slate-600">No students found.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t flex justify-between items-center p-4">
              <div className="text-sm text-slate-500">
                Showing {students.length} students
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm" disabled>Next</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card className="shadow-md border-indigo-100/50">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-900 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-600" />
                Wellbeing Insights
              </CardTitle>
              <CardDescription>AI-powered analysis and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-6 bg-gradient-to-br from-indigo-50 to-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg text-indigo-900">Class Overview</h3>
                      <p className="text-slate-600 mt-1">Overall wellbeing score has increased by 0.3 points in the past month.</p>
                      <div className="mt-2 space-x-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Improving</Badge>
                        <Badge variant="outline" className="text-slate-600">May 2025</Badge>
                      </div>
                    </div>
                    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">View Details</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                      <h3 className="font-medium text-lg flex items-center text-red-700">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                        Students Requiring Attention
                      </h3>
                      <p className="text-slate-600 mt-1">
                        The following students have shown declining wellbeing metrics that may require intervention.
                      </p>
                      
                      <div className="mt-4 space-y-3">
                        {students
                          .filter((s: any) => s.trend === 'declining')
                          .map((student: any) => (
                            <div key={student.id} className="flex items-center justify-between rounded-lg border p-3 bg-red-50 border-red-200">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-2">
                                  <AvatarFallback className="bg-red-100 text-red-700">
                                    {student.first_name?.[0]}{student.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium text-red-900">{student.first_name} {student.last_name}</p>
                                  <p className="text-xs text-red-700">Score: {student.wellbeing_score}/10</p>
                                </div>
                              </div>
                              <Button size="sm" variant="destructive" className="bg-red-600 hover:bg-red-700">Review</Button>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="w-full">
                      <h3 className="font-medium text-lg flex items-center text-indigo-900">
                        <FileText className="h-5 w-5 text-blue-500 mr-2" />
                        Recommended Resources
                      </h3>
                      <p className="text-slate-600 mt-1">
                        Resources and activities that may benefit your students based on recent wellbeing data.
                      </p>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                          <h4 className="font-medium text-blue-900">Exam Stress Management</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            A collection of activities and techniques to help students manage exam-related anxiety.
                          </p>
                          <Button size="sm" variant="link" className="mt-2 pl-0 text-blue-600 hover:text-blue-800">
                            View Resource
                          </Button>
                        </div>
                        
                        <div className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                          <h4 className="font-medium text-blue-900">Group Mindfulness Session</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Guided mindfulness activities designed for classroom settings.
                          </p>
                          <Button size="sm" variant="link" className="mt-2 pl-0 text-blue-600 hover:text-blue-800">
                            View Resource
                          </Button>
                        </div>
                        
                        <div className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                          <h4 className="font-medium text-blue-900">Social Connection Activities</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Classroom activities to strengthen social bonds and build community.
                          </p>
                          <Button size="sm" variant="link" className="mt-2 pl-0 text-blue-600 hover:text-blue-800">
                            View Resource
                          </Button>
                        </div>
                        
                        <div className="rounded-lg border p-4 hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
                          <h4 className="font-medium text-blue-900">Emotional Intelligence Workshop</h4>
                          <p className="text-sm text-slate-600 mt-1">
                            Materials for teaching emotional awareness and healthy expression.
                          </p>
                          <Button size="sm" variant="link" className="mt-2 pl-0 text-blue-600 hover:text-blue-800">
                            View Resource
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
