
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileSpreadsheet, BarChart2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface UsageData {
  name: string;
  visits: number;
  interactions: number;
  lastUsed: string | null;
}

interface AppUsageChartProps {
  usageData: UsageData[];
  loading: boolean;
}

const AppUsageChart = ({ usageData, loading }: AppUsageChartProps) => {
  const usageBarData = usageData
    .filter(item => item.interactions > 0)
    .sort((a, b) => b.interactions - a.interactions);
    
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>App Usage</span>
          <BarChart2 className="h-5 w-5 text-slate-400" />
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
  );
};

export default AppUsageChart;
