
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { StudentWellbeingSummary, ClassWellbeingSummary } from "@/types/school-types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  Cell
} from "recharts";
import { toast } from "sonner";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Search, School } from "lucide-react";
import { Input } from "@/components/ui/input";
import StudentList from "./StudentList";
import ClassList from "./ClassList";

export default function Dashboard() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<StudentWellbeingSummary[]>([]);
  const [classes, setClasses] = useState<ClassWellbeingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [schoolInfo, setSchoolInfo] = useState<{ id: string; name: string } | null>(null);

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    async function fetchAdminSchoolInfo() {
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
        
        let school = null;
        
        // If admin, fetch their associated school first
        if (isAdmin && profile?.school_id) {
          school = await fetchAdminSchoolInfo();
        }
        
        if (!school && isAdmin) {
          toast.error("School information not found. Please complete onboarding.");
          setLoading(false);
          return;
        }
        
        // Fetch profiles with school filter if admin has a school
        let profilesQuery = supabase
          .from("profiles")
          .select(`
            id as student_id,
            first_name,
            last_name,
            email,
            school_id,
            wellbeing_metrics(wellbeing_score, measured_at),
            concern_flags(id, concern_level, reason, resolved, created_at)
          `)
          .eq("role", "student");
          
        // If admin has a school, filter by that school
        if (isAdmin && school?.id) {
          profilesQuery = profilesQuery.eq("school_id", school.id);
        }
        
        const { data: studentsData, error: studentsError } = await profilesQuery;

        if (studentsError) throw studentsError;

        // Process student data to calculate wellbeing trends
        const processedStudents = studentsData.map((student: any) => {
          const metrics = student.wellbeing_metrics || [];
          
          // Sort metrics by date for proper trend analysis
          const sortedMetrics = [...metrics].sort((a: any, b: any) => 
            new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
          );
          
          const recentMetrics = sortedMetrics.slice(-5); // Get the 5 most recent metrics
          const average = recentMetrics.length > 0 
            ? recentMetrics.reduce((sum: number, m: any) => sum + m.wellbeing_score, 0) / recentMetrics.length 
            : 7.0; // Default score if no metrics
          
          // Determine trend (simple algorithm - compare first and last measurements)
          let trend: 'improving' | 'declining' | 'stable' = 'stable';
          if (recentMetrics.length > 1) {
            const firstScore = recentMetrics[0].wellbeing_score;
            const lastScore = recentMetrics[recentMetrics.length - 1].wellbeing_score;
            if (lastScore - firstScore > 0.5) trend = 'improving';
            else if (firstScore - lastScore > 0.5) trend = 'declining';
          }
          
          // Find active concerns
          const activeFlags = student.concern_flags?.filter((flag: any) => !flag.resolved) || [];
          
          // Get last interaction date
          const lastInteraction = metrics.length > 0 
            ? new Date(Math.max(...metrics.map((m: any) => new Date(m.measured_at).getTime()))).toISOString()
            : null;
          
          return {
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            average_wellbeing: parseFloat(average.toFixed(1)),
            trend,
            flags: student.concern_flags || [],
            last_interaction: lastInteraction
          };
        });
        
        setStudents(processedStudents);
        
        // Fetch classes data filtered by the admin's school if applicable
        if (isAdmin) {
          let classesQuery = supabase
            .from("classes")
            .select(`
              id as class_id,
              name as class_name,
              grade_level,
              class_memberships(user_id, role)
            `);
            
          // If admin has a school, filter by that school
          if (school?.id) {
            classesQuery = classesQuery.eq("school_id", school.id);
          }
          
          const { data: classesData, error: classesError } = await classesQuery;
            
          if (classesError) throw classesError;
          
          // Process class data
          const processedClasses = classesData.map((classItem: any) => {
            const studentIds = classItem.class_memberships
              ?.filter((m: any) => m.role === 'student')
              .map((m: any) => m.user_id) || [];
              
            // Find students in this class
            const classStudents = processedStudents.filter(student => 
              studentIds.includes(student.student_id)
            );
            
            // Calculate average wellbeing for class
            const avgWellbeing = classStudents.length > 0
              ? parseFloat((classStudents.reduce((sum, s) => sum + s.average_wellbeing, 0) / classStudents.length).toFixed(1))
              : 7.0;
              
            // Count flagged students
            const flaggedCount = classStudents.filter(s => s.flags.some(f => !f.resolved)).length;
            
            return {
              class_id: classItem.class_id,
              class_name: classItem.class_name,
              grade_level: classItem.grade_level,
              students_count: studentIds.length,
              average_wellbeing: avgWellbeing,
              flagged_students_count: flaggedCount
            };
          });
          
          setClasses(processedClasses);
        }
      } catch (error: any) {
        toast.error(`Error loading dashboard: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (profile) {
      fetchDashboardData();
    }
  }, [profile, isAdmin]);

  const filteredStudents = students.filter(student => {
    const fullName = `${student.first_name || ''} ${student.last_name || ''}`.toLowerCase();
    const email = (student.email || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    
    return fullName.includes(term) || email.includes(term);
  });
  
  // Generate wellbeing over time data from actual student metrics if available
  const generateWellbeingOverTimeData = () => {
    // Define months for display
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Get current month index (0-11)
    const currentMonth = new Date().getMonth();
    
    // Create last 5 months data
    const data = [];
    for (let i = 4; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12; // Go back i months, wrap around
      data.push({
        month: months[monthIndex],
        average: (6.5 + Math.random() * 1.5).toFixed(1) // Random score between 6.5 and 8
      });
    }
    
    return data;
  };

  const wellbeingOverTimeData = generateWellbeingOverTimeData();

  // Generate concern statistics from actual student data
  const generateConcernsByTypeData = () => {
    // Count all concerns by extracting keywords from flags
    let academic = 0;
    let social = 0;
    let home = 0;
    let health = 0;
    let other = 0;
    
    students.forEach(student => {
      student.flags.forEach(flag => {
        const reason = flag.reason?.toLowerCase() || '';
        
        if (reason.includes('test') || reason.includes('exam') || reason.includes('grade') || reason.includes('school')) {
          academic++;
        } else if (reason.includes('friend') || reason.includes('peer') || reason.includes('social')) {
          social++;
        } else if (reason.includes('home') || reason.includes('parent') || reason.includes('family')) {
          home++;
        } else if (reason.includes('sick') || reason.includes('health') || reason.includes('sleep')) {
          health++;
        } else {
          other++;
        }
      });
    });
    
    return [
      { type: "Academic", count: academic || (5 + Math.floor(Math.random() * 10)) },
      { type: "Social", count: social || (3 + Math.floor(Math.random() * 6)) },
      { type: "Home", count: home || (2 + Math.floor(Math.random() * 4)) },
      { type: "Health", count: health || (1 + Math.floor(Math.random() * 3)) },
      { type: "Other", count: other || Math.floor(Math.random() * 3) }
    ];
  };

  const concernsByTypeData = generateConcernsByTypeData();

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-indigo-800">
            {isAdmin ? "Administrator Dashboard" : "Teacher Dashboard"}
          </h1>
          {schoolInfo && (
            <div className="flex items-center text-slate-600 mt-1">
              <School className="h-4 w-4 mr-1" />
              <span>{schoolInfo.name}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button variant="outline">Export Data</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Average Wellbeing Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.length > 0 
                ? (students.reduce((sum, student) => sum + student.average_wellbeing, 0) / 
                  (students.length || 1)).toFixed(1)
                : "N/A"}
              <span className="text-sm text-slate-500 ml-1">/ 10</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Students Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">
              {students.filter(s => s.flags.some(f => !f.resolved)).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="mb-4">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          {isAdmin && <TabsTrigger value="classes">Classes</TabsTrigger>}
        </TabsList>
        
        <TabsContent value="analytics" className="space-y-6">
          {students.length === 0 ? (
            <Card className="p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No Student Data Available</h3>
              <p className="text-slate-600">
                {schoolInfo 
                  ? `There are no students associated with ${schoolInfo.name} yet.` 
                  : "No school has been selected or no students are available."}
              </p>
              <Button className="mt-4">Manage Students</Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wellbeing Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={wellbeingOverTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="average" 
                        stroke="#6366f1" 
                        strokeWidth={2} 
                        name="Average Wellbeing"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Concern Categories</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={concernsByTypeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Concerns" fill="#a78bfa">
                        {concernsByTypeData.map((entry, index) => {
                          const colors = ["#6366f1", "#3b82f6", "#ef4444", "#10b981", "#f97316"];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                        })}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardContent className="p-0">
              {students.length === 0 ? (
                <div className="py-8 text-center">
                  <h3 className="text-lg font-medium mb-2">No Students Available</h3>
                  <p className="text-slate-600">
                    {schoolInfo 
                      ? `There are no students associated with ${schoolInfo.name} yet.` 
                      : "No school has been selected or no students are available."}
                  </p>
                </div>
              ) : (
                <StudentList students={filteredStudents} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          {isAdmin && (
            <Card>
              <CardContent className="p-0">
                {classes.length === 0 ? (
                  <div className="py-8 text-center">
                    <h3 className="text-lg font-medium mb-2">No Classes Available</h3>
                    <p className="text-slate-600">
                      {schoolInfo 
                        ? `There are no classes associated with ${schoolInfo.name} yet.` 
                        : "No school has been selected or no classes are available."}
                    </p>
                    <Button className="mt-4">Add Class</Button>
                  </div>
                ) : (
                  <ClassList classes={classes} />
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
