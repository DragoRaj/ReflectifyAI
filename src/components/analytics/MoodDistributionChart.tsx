
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { FileSpreadsheet, PieChart as PieChartIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface MoodDistributionChartProps {
  moodData: any[];
  loading: boolean;
}

const MoodDistributionChart = ({ moodData, loading }: MoodDistributionChartProps) => {
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

  const renderMoodPieChart = () => {
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

  return (
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
  );
};

export default MoodDistributionChart;
