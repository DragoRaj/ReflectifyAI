
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { 
  BarChart2, 
  Calendar, 
  ChevronDown,
  FileSpreadsheet, 
  LineChart as LineChartIcon, 
  Lightbulb, 
  Download,
  PieChart as PieChartIcon 
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeMoodTrends, getAIWellbeingInsights } from "@/utils/aiUtils";

export default function FunctionalAnalytics() {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [usageData, setUsageData] = useState([]);
  const [insights, setInsights] = useState(null);
  const [moodInsights, setMoodInsights] = useState(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [timeframe, setTimeframe] = useState("week");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get journal entries from Supabase if user is logged in
        if (user?.id) {
          const { data: journalData, error: journalError } = await supabase
            .from("journal_entries")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });

          if (journalError) throw journalError;
          setJournalEntries(journalData || []);
        }

        // Get mood data from local storage
        const moodEntriesStr = localStorage.getItem('moodEntries');
        const storedMoodEntries = moodEntriesStr ? JSON.parse(moodEntriesStr) : [];
        setMoodData(storedMoodEntries);

        // Generate usage data from local storage
        const usageMetrics = [
          {
            name: "Journal",
            visits: parseInt(localStorage.getItem('journalVisitCount') || '0'),
            interactions: parseInt(localStorage.getItem('journalEntriesCount') || '0'),
            lastUsed: localStorage.getItem('journalLastUsed')
          },
          {
            name: "Chat",
            visits: parseInt(localStorage.getItem('chatVisitCount') || '0'),
            interactions: parseInt(localStorage.getItem('chatInteractionCount') || '0'),
            lastUsed: localStorage.getItem('chatLastUsed')
          },
          {
            name: "Express",
            visits: parseInt(localStorage.getItem('expressVisitCount') || '0'),
            interactions: parseInt(localStorage.getItem('expressInteractionCount') || '0'),
            lastUsed: localStorage.getItem('expressLastUsed')
          },
          {
            name: "Content",
            visits: parseInt(localStorage.getItem('contentVisitCount') || '0'),
            interactions: parseInt(localStorage.getItem('contentAnalysisCount') || '0'),
            lastUsed: localStorage.getItem('contentLastUsed')
          },
          {
            name: "Mindfulness",
            visits: parseInt(localStorage.getItem('mindfulnessVisitCount') || '0'),
            interactions: parseInt(localStorage.getItem('mindfulnessSessionCount') || '0'),
            lastUsed: localStorage.getItem('mindfulnessLastUsed')
          }
        ];
        
        setUsageData(usageMetrics);

      } catch (error) {
        console.error("Error loading analytics data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const generateInsights = async () => {
    if (journalEntries.length === 0) {
      toast.error("You need journal entries to generate insights");
      return;
    }

    try {
      setLoadingInsights(true);
      const aiInsights = await getAIWellbeingInsights(journalEntries);
      setInsights(aiInsights);
      toast.success("Generated wellbeing insights");
    } catch (error) {
      console.error("Error generating insights:", error);
      toast.error("Failed to generate insights");
    } finally {
      setLoadingInsights(false);
    }
  };

  const generateMoodAnalysis = async () => {
    if (moodData.length === 0) {
      toast.error("You need mood data to generate analysis");
      return;
    }

    try {
      setLoadingInsights(true);
      const analysis = await analyzeMoodTrends(moodData);
      setMoodInsights(analysis);
      toast.success("Generated mood analysis");
    } catch (error) {
      console.error("Error analyzing mood:", error);
      toast.error("Failed to analyze mood data");
    } finally {
      setLoadingInsights(false);
    }
  };

  // Filter data based on timeframe selection
  const getTimeframeFilteredData = (data, dateField = "date") => {
    if (!data || data.length === 0) return [];
    
    const now = new Date();
    const filtered = data.filter(item => {
      const itemDate = new Date(item[dateField]);
      // Fix: Convert date strings to timestamps for proper numeric comparison
      const diffInTime = now.getTime() - itemDate.getTime();
      const diffDays = Math.floor(diffInTime / (24 * 60 * 60 * 1000));
      
      switch(timeframe) {
        case "week": return diffDays <= 7;
        case "month": return diffDays <= 30;
        case "year": return diffDays <= 365;
        default: return true;
      }
    });
    
    return filtered;
  };

  // Prepare chart data
  const moodChartData = getTimeframeFilteredData(moodData).map(entry => ({
    date: entry.date,
    value: entry.value,
    mood: entry.mood
  }));

  const journalMoodData = getTimeframeFilteredData(journalEntries, "created_at").map(entry => ({
    date: new Date(entry.created_at).toLocaleDateString(),
    mood: entry.mood
  }));

  // Aggregate mood counts for pie chart
  const moodCounts = moodData.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {});

  const moodPieData = Object.keys(moodCounts).map(mood => ({
    name: mood,
    value: moodCounts[mood]
  }));

  // Colors for pie chart
  const MOOD_COLORS = {
    "happy": "#4ade80",
    "excited": "#fbbf24",
    "loving": "#fb7185",
    "neutral": "#60a5fa",
    "calm": "#b45309",
    "peaceful": "#34d399",
    "sad": "#a78bfa",
    "angry": "#ef4444"
  };

  // Calculate average mood - Fix: Ensure we're working with numbers
  const calculateAverageMood = () => {
    if (journalEntries.length === 0) return "N/A";
    
    const sum = journalEntries.reduce((total, entry) => {
      // Ensure the mood is treated as a number
      const moodValue = typeof entry.mood === 'number' ? entry.mood : 0;
      return total + moodValue;
    }, 0);
    
    return (sum / journalEntries.length).toFixed(1);
  };

  const renderMoodPieChart = () => {
    if (moodPieData.length === 0) return null;
    
    return (
      <PieChart width={300} height={300}>
        <Pie
          data={moodPieData}
          cx={150}
          cy={150}
          innerRadius={60}
          outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          nameKey="name"
          label={({name}) => name}
        >
          {moodPieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={MOOD_COLORS[entry.name] || `#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </Pie>
        <Tooltip formatter={(value, name) => [`${value} times`, name]} />
      </PieChart>
    );
  };

  const usageBarData = usageData
    .filter(item => item.interactions > 0)
    .sort((a, b) => b.interactions - a.interactions);

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-800">Analytics Dashboard</h1>
        <p className="text-slate-600">Track your wellbeing patterns and app usage</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="mood" className="flex items-center gap-2">
              <LineChartIcon className="h-4 w-4" />
              Mood Tracking
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              AI Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex items-center gap-2">
          <div className="relative inline-block text-left">
            <div className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-2 text-sm font-medium shadow-sm">
              <Calendar className="h-4 w-4" />
              <span>{timeframe === "week" ? "Last 7 days" : timeframe === "month" ? "Last 30 days" : "Last Year"}</span>
              <ChevronDown className="h-4 w-4" />
            </div>
            <select
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <TabsContent value="overview" className="mt-4 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Journal Entries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{journalEntries.length}</div>
              <p className="text-sm text-slate-500">
                {journalEntries.length > 0 
                  ? `Last entry: ${new Date(journalEntries[0].created_at).toLocaleDateString()}`
                  : "No entries yet"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Mood Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodData.length}</div>
              <p className="text-sm text-slate-500">
                {moodData.length > 0 
                  ? `Latest mood: ${moodData[moodData.length - 1].mood}`
                  : "No mood data yet"}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Average Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calculateAverageMood()}
                <span className="text-sm text-slate-500 ml-1">/ 10</span>
              </div>
              <p className="text-sm text-slate-500">Based on journal entries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>App Usage</span>
                <PieChartIcon className="h-5 w-5 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-[250px] w-full" />
                </div>
              ) : usageBarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={usageBarData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="visits" name="Visits" fill="#60a5fa" />
                    <Bar dataKey="interactions" name="Interactions" fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No usage data available</p>
                  <p className="text-sm mt-1">Start using the app to see analytics</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Mood Distribution</span>
                <PieChartIcon className="h-5 w-5 text-slate-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center">
              {loading ? (
                <Skeleton className="h-[250px] w-[250px] rounded-full" />
              ) : moodPieData.length > 0 ? (
                renderMoodPieChart()
              ) : (
                <div className="text-center py-12 text-slate-500">
                  <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>No mood data available</p>
                  <p className="text-sm mt-1">Log your mood to see distribution</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="mood" className="mt-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : moodChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={moodChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip formatter={(value, name) => [value, name === "value" ? "Mood Score" : name]} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="Mood Score"
                    stroke="#6366f1" 
                    activeDot={{ r: 8 }} 
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No mood data available</p>
                <p className="text-sm mt-1">Use the chat feature to log your mood</p>
                <Button className="mt-4" onClick={() => window.location.hash = "chat"}>
                  Log Mood
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Journal Mood Entries</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-[400px] w-full" />
            ) : journalMoodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={journalMoodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    name="Journal Mood"
                    stroke="#a78bfa" 
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12 text-slate-500">
                <FileSpreadsheet className="h-12 w-12 mx-auto mb-4 opacity-30" />
                <p>No journal mood data available</p>
                <p className="text-sm mt-1">Create journal entries to track mood</p>
                <Button className="mt-4" onClick={() => window.location.hash = "journal"}>
                  Create Journal Entry
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-center mt-6">
          <Button 
            onClick={generateMoodAnalysis}
            disabled={loadingInsights || moodData.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loadingInsights ? "Analyzing..." : "Get AI Mood Analysis"}
          </Button>
        </div>

        {moodInsights && (
          <Card className="border-indigo-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-600" />
                AI Mood Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Overall Trend</h3>
                  <p className="text-slate-700">{moodInsights.overallTrend}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 mt-6">
                  {moodInsights.insights.map((insight, index) => (
                    <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100">
                      <h4 className="font-medium text-indigo-800 mb-2">{insight.title}</h4>
                      <p className="text-slate-700 mb-3">{insight.description}</p>
                      <p className="text-sm font-medium text-indigo-600">Suggestion: {insight.suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="insights" className="mt-4 space-y-6">
        <div className="flex justify-center mb-6">
          <Button 
            onClick={generateInsights}
            disabled={loadingInsights || journalEntries.length === 0}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {loadingInsights ? "Generating..." : "Generate AI Wellbeing Insights"}
          </Button>
        </div>

        {!insights && !loadingInsights && (
          <div className="text-center py-12">
            <Lightbulb className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium">No AI insights yet</h3>
            <p className="text-slate-500 max-w-lg mx-auto mt-2">
              Click the button above to generate AI insights based on your journal entries and tracked mood data.
            </p>
            {journalEntries.length === 0 && (
              <div className="mt-4">
                <p className="text-sm text-amber-600">You need journal entries to generate insights.</p>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => window.location.hash = "journal"}
                >
                  Create Journal Entry
                </Button>
              </div>
            )}
          </div>
        )}

        {loadingInsights && (
          <div className="space-y-4">
            <div className="max-w-2xl mx-auto">
              <Skeleton className="h-8 w-1/3 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-5/6 mb-1" />
              <Skeleton className="h-4 w-4/6" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
              </div>
              <div>
                <Skeleton className="h-8 w-1/2 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-full mb-1" />
              </div>
            </div>
          </div>
        )}

        {insights && (
          <Card className="border-indigo-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-indigo-600" />
                Wellbeing Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Mood Trend</h3>
                  <p className="text-slate-700">{insights.moodTrend}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-amber-700">Areas of Concern</h3>
                    <ul className="space-y-2">
                      {insights.concerns.map((concern, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="bg-amber-100 text-amber-800 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-slate-700">{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2 text-emerald-700">Positive Patterns</h3>
                    <ul className="space-y-2">
                      {insights.positives.map((positive, index) => (
                        <li key={index} className="flex gap-2">
                          <span className="bg-emerald-100 text-emerald-800 rounded-full w-5 h-5 flex items-center justify-center text-xs shrink-0 mt-0.5">
                            {index + 1}
                          </span>
                          <span className="text-slate-700">{positive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 text-indigo-700">Suggestions for Improvement</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {insights.suggestions.map((suggestion, index) => (
                      <div key={index} className="p-4 rounded-lg bg-gradient-to-r from-indigo-50/50 to-purple-50/50 border border-indigo-100">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-indigo-100 text-indigo-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <h4 className="font-medium">Suggestion</h4>
                        </div>
                        <p className="text-slate-700">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </div>
  );
}
