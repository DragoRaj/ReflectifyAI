
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
} from "recharts";
import { toast } from "sonner";
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import StudentList from "./StudentList";
import ClassList from "./ClassList";

export default function Dashboard() {
  const { profile } = useAuth();
  const [students, setStudents] = useState<StudentWellbeingSummary[]>([]);
  const [classes, setClasses] = useState<ClassWellbeingSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const isAdmin = profile?.role === "admin";

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // In a real app, these would be separate API calls to edge functions
        // for better performance and processing
        
        // Fetch students data
        const { data: studentsData, error: studentsError } = await supabase
          .from("profiles")
          .select(`
            id as student_id,
            first_name,
            last_name,
            email,
            wellbeing_metrics!inner(wellbeing_score, measured_at),
            concern_flags(id, concern_level, reason, resolved, created_at)
          `)
          .eq("role", "student");

        if (studentsError) throw studentsError;

        // Process student data to calculate wellbeing trends
        const processedStudents = studentsData.map((student: any) => {
          const metrics = student.wellbeing_metrics.sort((a: any, b: any) => 
            new Date(a.measured_at).getTime() - new Date(b.measured_at).getTime()
          );
          
          const recentMetrics = metrics.slice(-5);
          const average = recentMetrics.reduce((sum: number, m: any) => sum + m.wellbeing_score, 0) / 
            (recentMetrics.length || 1);
          
          // Determine trend (simple algorithm - compare first and last measurements)
          let trend: 'improving' | 'declining' | 'stable' = 'stable';
          if (recentMetrics.length > 1) {
            const firstScore = recentMetrics[0].wellbeing_score;
            const lastScore = recentMetrics[recentMetrics.length - 1].wellbeing_score;
            if (lastScore - firstScore > 0.5) trend = 'improving';
            else if (firstScore - lastScore > 0.5) trend = 'declining';
          }
          
          return {
            student_id: student.student_id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            average_wellbeing: parseFloat(average.toFixed(1)),
            trend,
            flags: student.concern_flags,
            last_interaction: metrics.length > 0 ? metrics[metrics.length - 1].measured_at : null
          };
        });
        
        setStudents(processedStudents);
        
        // Fetch classes data
        if (isAdmin) {
          const { data: classesData, error: classesError } = await supabase
            .from("classes")
            .select(`
              id as class_id,
              name as class_name,
              grade_level,
              class_memberships!inner(user_id, role)
            `);
            
          if (classesError) throw classesError;
          
          // Process class data - in real app, this would come from a database view or function
          const processedClasses = classesData.map((classItem: any) => {
            const studentIds = classItem.class_memberships
              .filter((m: any) => m.role === 'student')
              .map((m: any) => m.user_id);
              
            return {
              class_id: classItem.class_id,
              class_name: classItem.class_name,
              grade_level: classItem.grade_level,
              students_count: studentIds.length,
              average_wellbeing: 7.2, // Mocked data - would be calculated from actual metrics
              flagged_students_count: Math.floor(Math.random() * 3) // Mocked data
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
  
  // Mock data for charts
  const wellbeingOverTimeData = [
    { month: "Jan", average: 6.2 },
    { month: "Feb", average: 6.5 },
    { month: "Mar", average: 6.8 },
    { month: "Apr", average: 7.1 },
    { month: "May", average: 6.9 },
  ];

  const concernsByTypeData = [
    { type: "Academic", count: 14 },
    { type: "Social", count: 8 },
    { type: "Home", count: 5 },
    { type: "Health", count: 3 },
    { type: "Other", count: 2 },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-800">
          {isAdmin ? "Administrator Dashboard" : "Teacher Dashboard"}
        </h1>
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
              {(students.reduce((sum, student) => sum + student.average_wellbeing, 0) / 
                (students.length || 1)).toFixed(1)}
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
                    <Bar dataKey="count" name="Number of Concerns" fill="#a78bfa" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardContent className="p-0">
              <StudentList students={filteredStudents} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          {isAdmin && (
            <Card>
              <CardContent className="p-0">
                <ClassList classes={classes} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
