
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface MoodChartsProps {
  moodChartData: any[];
  journalMoodData: any[];
  loading: boolean;
  onGenerateAnalysis: () => void;
  loadingInsights: boolean;
  moodInsights: any;
}

const MoodCharts = ({ 
  moodChartData, 
  journalMoodData, 
  loading, 
  onGenerateAnalysis,
  loadingInsights,
  moodInsights
}: MoodChartsProps) => {
  return (
    <>
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Mood Tracking</h2>
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
        </div>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Journal Mood Entries</h2>
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
        </div>
      </Card>

      <div className="flex justify-center mt-6">
        <Button 
          onClick={onGenerateAnalysis}
          disabled={loadingInsights || moodChartData.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {loadingInsights ? "Analyzing..." : "Get AI Mood Analysis"}
        </Button>
      </div>

      {moodInsights && (
        <Card className="border-indigo-200 shadow-lg">
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h2 className="flex items-center gap-2 text-xl font-bold">
              AI Mood Analysis
            </h2>
          </div>
          <div className="p-6">
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
          </div>
        </Card>
      )}
    </>
  );
};

export default MoodCharts;
