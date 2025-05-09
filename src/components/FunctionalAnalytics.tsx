
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  BarChart2, 
  Calendar, 
  ChevronDown,
  Download,
  Lightbulb, 
  LineChart as LineChartIcon 
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { analyzeMoodTrends, getAIWellbeingInsights } from "@/utils/aiUtils";
import { Button } from "./ui/button";
import AnalyticsSummary from "./analytics/AnalyticsSummary";
import AppUsageChart from "./analytics/AppUsageChart";
import MoodDistributionChart from "./analytics/MoodDistributionChart";
import MoodCharts from "./analytics/MoodCharts";
import InsightsTab from "./analytics/InsightsTab";

export default function FunctionalAnalytics() {
  const { user } = useAuth();
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
        <AnalyticsSummary 
          journalEntries={journalEntries} 
          moodData={moodData} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AppUsageChart 
            usageData={usageData} 
            loading={loading} 
          />
          
          <MoodDistributionChart 
            moodData={moodData} 
            loading={loading} 
          />
        </div>
      </TabsContent>

      <TabsContent value="mood" className="mt-4 space-y-6">
        <MoodCharts 
          moodChartData={moodChartData}
          journalMoodData={journalMoodData}
          loading={loading}
          onGenerateAnalysis={generateMoodAnalysis}
          loadingInsights={loadingInsights}
          moodInsights={moodInsights}
        />
      </TabsContent>

      <TabsContent value="insights" className="mt-4">
        <InsightsTab 
          journalEntries={journalEntries}
          insights={insights}
          loadingInsights={loadingInsights}
          onGenerateInsights={generateInsights}
        />
      </TabsContent>
    </div>
  );
}
