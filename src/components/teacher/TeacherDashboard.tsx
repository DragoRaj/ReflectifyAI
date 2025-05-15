
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignOutButton } from "@/components/SignOutButton";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
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
  Minus,
  School
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [insights, setInsights] = useState<any[]>([]);
  const [notifications, setNotifications] = useState(3);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [schoolInfo, setSchoolInfo] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    async function fetchTeacherSchool() {
      if (!profile?.school_id) return null;
      
      try {
        const { data, error } = await supabase
          .from("schools")
          .select("id, name")
          .eq("id", profile.school_id)
          .single();
          
        if (error) throw error;
        
        setSchoolInfo(data);
        return data;
      } catch (error: any) {
        console.error("Error fetching school info:", error.message);
        toast.error("Failed to load school information");
        return null;
      }
    }
  
    async function fetchDashboardData() {
      try {
        setLoading(true);
        
        // First, fetch the teacher's school
        let school = null;
        if (profile?.school_id) {
          school = await fetchTeacherSchool();
        }
        
        if (!school) {
          toast.error("School information not found. Please complete onboarding.");
          setLoading(false);
          return;
        }
        
        // Fetch classes data for this teacher's school
        const { data: classesData, error: classesError } = await supabase
          .from("classes")
          .select("id, name, grade_level, school_id")
          .eq("school_id", school.id)
          .order("grade_level")
          .order("name");
          
        if (classesError) throw classesError;
        
        setClasses(classesData || []);
        
        // If a class is not selected, use the first class
        const classId = selectedClassId || (classesData?.length > 0 ? classesData[0].id : null);
        setSelectedClassId(classId);
        
        // Fetch students in this school
        const { data: studentsData, error: studentsError } = await supabase
          .from("profiles")
          .select(`
            id, 
            first_name, 
            last_name, 
            email, 
            school_id,
            wellbeing_metrics(wellbeing_score, measured_at),
            concern_flags(id, concern_level, reason, resolved, created_at)
          `)
          .eq("role", "student")
          .eq("school_id", school.id);
          
        if (studentsError) throw studentsError;
        
        // Process students with wellbeing data
        const processedStudents = studentsData.map((student: any) => {
          const metrics = student.wellbeing_metrics || [];
          
          // Calculate average wellbeing score
          const average = metrics.length > 0 
            ? metrics.reduce((sum: number, m: any) => sum + m.wellbeing_score, 0) / metrics.length 
            : null;
          
          // Determine trend
          let trend = 'stable';
          if (metrics.length > 1) {
            // Sort metrics by date
            const sortedMetrics = [...metrics].sort((a: any, b: any) => 
              new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
            );
            
            const firstScore = sortedMetrics[0].wellbeing_score;
            const lastScore = sortedMetrics[sortedMetrics.length - 1].wellbeing_score;
            
            if (lastScore - firstScore > 0.5) trend = 'improving';
            else if (firstScore - lastScore > 0.5) trend = 'declining';
          }
          
          // Get latest check-in date
          const lastCheckIn = metrics.length > 0
            ? new Date(Math.max(...metrics.map((m: any) => new Date(m.measured_at).getTime())))
            : null;
            
          return {
            ...student,
            wellbeing_score: average !== null ? parseFloat(average.toFixed(1)) : 7,
            trend,
            last_check_in: lastCheckIn ? lastCheckIn.toISOString() : null
          };
        });
        
        setStudents(processedStudents || []);
        
        // Generate some mock insights (in a real app, these would come from the backend)
        const mockInsights = [
          {
            id: 1,
            title: "Well-being Trend Alert",
            description: `${processedStudents.filter((s: any) => s.trend === 'declining').length} students showed declining wellbeing scores this week`,
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
        console.error("Error fetching dashboard data:", error.message);
        toast.error(`Failed to load dashboard data: ${error.message}`);
        setLoading(false);
      }
    }

    if (profile) {
      fetchDashboardData();
    }
  }, [profile, selectedClassId]);

  // Mock data for charts
  const wellbeingOverTimeData = [
    { month: "Jan", average: 7.2 },
    { month: "Feb", average: 7.0 },
    { month: "Mar", average: 7.5 },
    { month: "Apr", average: 7.8 },
    { month: "May", average: 7.4 },
  ];

  // Calculate real concern statistics from the students data
  const calculateConcernsByType = () => {
    const concerns: Record<string, number> = {
      "Academic": 0,
      "Social": 0, 
      "Emotional": 0,
      "Behavioral": 0,
      "Health": 0
    };
    
    students.forEach((student: any) => {
      if (student.concern_flags && student.concern_flags.length > 0) {
        student.concern_flags.forEach((flag: any) => {
          // Categorize concerns based on reason text
          if (flag.reason?.includes("test") || flag.reason?.includes("exam") || flag.reason?.includes("grade")) {
            concerns["Academic"]++;
          } else if (flag.reason?.includes("friend") || flag.reason?.includes("social") || flag.reason?.includes("peer")) {
            concerns["Social"]++;
          } else if (flag.reason?.includes("anxious") || flag.reason?.includes("sad") || flag.reason?.includes("mood")) {
            concerns["Emotional"]++;
          } else if (flag.reason?.includes("disrupt") || flag.reason?.includes("behav") || flag.reason?.includes("attention")) {
            concerns["Behavioral"]++;
          } else if (flag.reason?.includes("sick") || flag.reason?.includes("health") || flag.reason?.includes("sleep")) {
            concerns["Health"]++;
          } else {
            // Default category if no specific keywords are matched
            concerns["Emotional"]++;
          }
        });
      }
    });
    
    // Convert to array format for charts
    return Object.entries(concerns).map(([type, count]) => ({
      type,
      count,
      color: type === "Academic" ? "#8b5cf6" : 
             type === "Social" ? "#3b82f6" : 
             type === "Emotional" ? "#ef4444" : 
             type === "Behavioral" ? "#f97316" : 
             "#10b981"
    }));
  };

  const concernsByTypeData = calculateConcernsByType();
  
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

  // Calculate the average wellbeing score across all students
  const averageWellbeing = students.length > 0
    ? parseFloat((students.reduce((sum: number, student: any) => sum + student.wellbeing_score, 0) / students.length).toFixed(1))
    : 7.0;
    
  // Count students requiring attention
  const studentsNeedingAttention = students.filter((student: any) => 
    student.concern_flags?.some((flag: any) => !flag.resolved)
  ).length;

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            Teacher Dashboard
          </h1>
          {schoolInfo && (
            <div className="flex items-center text-slate-600 mt-1">
              <School className="h-4 w-4 mr-1" />
              <span>{schoolInfo.name}</span>
            </div>
          )}
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
      
      {classes.length > 0 && (
        <div className="mb-6">
          <Label htmlFor="class-filter" className="text-sm font-medium mb-2 block">Filter by Class</Label>
          <Select
            value={selectedClassId || ''}
            onValueChange={(value) => setSelectedClassId(value)}
          >
            <SelectTrigger className="w-full sm:w-[250px]">
              <SelectValue placeholder="Select a class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Classes</SelectItem>
              {classes.map((cls: any) => (
                <SelectItem key={cls.id} value={cls.id}>
                  {cls.name} (Grade {cls.grade_level})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
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
            <div className="text-3xl font-bold text-emerald-900">{averageWellbeing}<span className="text-sm text-emerald-700/70 ml-1">/ 10</span></div>
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
            <div className="text-3xl font-bold text-amber-900">{studentsNeedingAttention}</div>
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
                                {student.concern_flags?.some((flag: any) => !flag.resolved) && (
                                  <Badge variant="destructive" className="ml-2">
                                    <AlertCircle className="h-3 w-3 mr-1" /> Concern
                                  </Badge>
                                )}
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
                              {student.last_check_in ? new Date(student.last_check_in).toLocaleDateString() : "Never"}
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
                        The following students have shown declining wellbeing metrics that may require intervention:
                      </p>
                      
                      <div className="mt-4 space-y-3">
                        {students
                          .filter((s: any) => s.trend === 'declining' || s.concern_flags?.some((flag: any) => !flag.resolved))
                          .slice(0, 3)
                          .map((student: any) => (
                            <div key={student.id} className="flex items-center justify-between bg-red-50 rounded p-3 border border-red-100">
                              <div className="flex items-center">
                                <Avatar className="h-8 w-8 mr-3">
                                  <AvatarFallback className="bg-red-100 text-red-700">
                                    {student.first_name?.[0]}{student.last_name?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-medium">{student.first_name} {student.last_name}</p>
                                  <p className="text-xs text-slate-500">
                                    {student.concern_flags?.length > 0 
                                      ? student.concern_flags[0].reason 
                                      : "Declining wellbeing trend"}
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm" className="border-red-200 hover:bg-red-100 text-red-700">
                                Take Action
                              </Button>
                            </div>
                          ))}
                      </div>
                      
                      {students.filter((s: any) => s.trend === 'declining' || s.concern_flags?.some((flag: any) => !flag.resolved)).length > 3 && (
                        <div className="mt-3">
                          <Button variant="link" className="text-indigo-600 p-0">
                            View all students requiring attention
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-6 bg-green-50">
                  <h3 className="font-medium text-lg flex items-center text-green-700">
                    <FileText className="h-5 w-5 text-green-600 mr-2" />
                    Recommended Activities
                  </h3>
                  <p className="text-slate-600 mt-1">
                    Based on recent wellbeing trends, consider incorporating these activities:
                  </p>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h4 className="font-medium text-green-800">Mindfulness Sessions</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        5-10 minute guided mindfulness exercises at the start of class can help reduce anxiety.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h4 className="font-medium text-green-800">Peer Support Circles</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Facilitating small group discussions where students can share concerns in a safe space.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h4 className="font-medium text-green-800">Stress Management Workshop</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Teaching practical coping skills for academic stress ahead of exam periods.
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-green-100">
                      <h4 className="font-medium text-green-800">Positive Journaling</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Weekly gratitude or reflection prompts to build positive thinking habits.
                      </p>
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
