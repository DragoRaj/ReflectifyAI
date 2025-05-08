
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignOutButton } from "@/components/SignOutButton";
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
import { AlertCircle, FileText, Users, User, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function TeacherDashboard() {
  const { profile } = useAuth();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

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
        
        setStudents(studentsData || []);
        setLoading(false);
        
      } catch (error) {
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
    { type: "Academic", count: 8 },
    { type: "Social", count: 5 },
    { type: "Emotional", count: 7 },
    { type: "Behavioral", count: 3 },
    { type: "Health", count: 4 },
  ];

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">
            Teacher Dashboard
          </h1>
          <p className="text-slate-600">Monitor student wellbeing and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Profile
          </Button>
          <SignOutButton />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
            <CardTitle className="text-base font-medium">Class Average Wellbeing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.4<span className="text-sm text-slate-500 ml-1">/ 10</span></div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Students Needing Attention</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">3</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
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
                      name="Class Average Wellbeing"
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
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Wellbeing Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600">No recent updates to display.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Student Directory</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </CardHeader>
            <CardContent>
              {students.length > 0 ? (
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.filter(student => 
                        (student.first_name + ' ' + student.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
                        student.email.toLowerCase().includes(searchTerm.toLowerCase())
                      ).map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{student.first_name} {student.last_name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button variant="ghost" size="sm">View Profile</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-slate-600">No students found.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Wellbeing Insights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Class Overview</h3>
                      <p className="text-sm text-slate-600">Overall wellbeing score has increased by 0.3 points in the past month.</p>
                    </div>
                    <div className="text-emerald-500 bg-emerald-50 px-2 py-1 rounded text-sm font-medium">
                      Improving
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <AlertCircle className="h-4 w-4 text-orange-500 mr-2" />
                        3 Students Require Attention
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">Based on recent wellbeing metrics and sentiment analysis.</p>
                    </div>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium flex items-center">
                        <FileText className="h-4 w-4 text-blue-500 mr-2" />
                        Recommended Resources
                      </h3>
                      <p className="text-sm text-slate-600 mt-1">Access lesson plans and activities to support student wellbeing.</p>
                    </div>
                    <Button size="sm" variant="outline">Access Resources</Button>
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
