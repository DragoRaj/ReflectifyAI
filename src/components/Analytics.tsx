
import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Activity, Brain, TrendingUp, Calendar, Award, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Sample data - in a real app this would come from a database
const moodData = [
  { date: "Jan 01", value: 3, mood: "neutral" },
  { date: "Jan 05", value: 2, mood: "sad" },
  { date: "Jan 10", value: 4, mood: "happy" },
  { date: "Jan 15", value: 5, mood: "excited" },
  { date: "Jan 20", value: 3, mood: "neutral" },
  { date: "Jan 25", value: 4, mood: "calm" },
  { date: "Feb 01", value: 4, mood: "happy" },
  { date: "Feb 05", value: 2, mood: "angry" },
  { date: "Feb 10", value: 5, mood: "loving" },
  { date: "Feb 15", value: 4, mood: "peaceful" },
  { date: "Feb 20", value: 3, mood: "neutral" },
  { date: "Feb 25", value: 4, mood: "happy" },
];

const activityData = [
  { name: "Jan", meditation: 8, journal: 12, chat: 20 },
  { name: "Feb", meditation: 10, journal: 15, chat: 18 },
  { name: "Mar", meditation: 15, journal: 20, chat: 25 },
  { name: "Apr", meditation: 12, journal: 18, chat: 22 },
  { name: "May", meditation: 18, journal: 22, chat: 30 },
  { name: "Jun", meditation: 20, journal: 25, chat: 35 },
];

const moodDistribution = [
  { name: "Happy", value: 35, color: "#10b981" },
  { name: "Calm", value: 20, color: "#d97706" },
  { name: "Peaceful", value: 15, color: "#10b981" },
  { name: "Neutral", value: 15, color: "#6366f1" },
  { name: "Sad", value: 10, color: "#8b5cf6" },
  { name: "Angry", value: 5, color: "#ef4444" },
];

const progressMetrics = [
  {
    title: "Wellbeing Score",
    value: 78,
    change: 12,
    trend: "up",
    icon: <Activity className="h-4 w-4" />,
    color: "from-reflectify-blue to-reflectify-teal"
  },
  {
    title: "Mindfulness",
    value: 65,
    change: 8,
    trend: "up",
    icon: <Brain className="h-4 w-4" />,
    color: "from-reflectify-purple to-reflectify-blue"
  },
  {
    title: "Mood Stability",
    value: 82,
    change: 5,
    trend: "up",
    icon: <TrendingUp className="h-4 w-4" />,
    color: "from-reflectify-teal to-green-400"
  },
  {
    title: "Journaling Streak",
    value: 12,
    unit: "days",
    change: 4,
    trend: "up",
    icon: <Calendar className="h-4 w-4" />,
    color: "from-amber-500 to-orange-400"
  },
];

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("6m");
  
  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case "happy": return "#10b981";
      case "excited": return "#f59e0b";
      case "loving": return "#ec4899";
      case "neutral": return "#6366f1";
      case "calm": return "#d97706";
      case "peaceful": return "#34d399";
      case "sad": return "#8b5cf6";
      case "angry": return "#ef4444";
      default: return "#64748b";
    }
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in px-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-display font-semibold tracking-tight">Your Wellness Analytics</h2>
        <p className="text-muted-foreground">
          Track your progress and gain insights into your wellbeing journey over time.
        </p>
      </div>
      
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {progressMetrics.map((metric, index) => (
          <div 
            key={index} 
            className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20 animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex justify-between items-start mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} text-white`}>
                {metric.icon}
              </div>
              <div className={`flex items-center ${metric.trend === 'up' ? 'text-reflectify-teal' : 'text-red-500'}`}>
                <span className="text-xs font-medium">{metric.change}%</span>
                {metric.trend === 'up' ? (
                  <ArrowUpRight className="h-3 w-3 ml-0.5" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 ml-0.5" />
                )}
              </div>
            </div>
            <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
            <div className="flex items-baseline">
              <span className="text-2xl font-bold">{metric.value}</span>
              {metric.unit && <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>}
            </div>
          </div>
        ))}
      </div>
      
      {/* Time frame selector */}
      <div className="flex justify-center space-x-1 p-1 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm w-fit mx-auto">
        <button
          onClick={() => setTimeframe("1m")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            timeframe === "1m" ? "bg-reflectify-blue text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          1 Month
        </button>
        <button
          onClick={() => setTimeframe("3m")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            timeframe === "3m" ? "bg-reflectify-blue text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          3 Months
        </button>
        <button
          onClick={() => setTimeframe("6m")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            timeframe === "6m" ? "bg-reflectify-blue text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          6 Months
        </button>
        <button
          onClick={() => setTimeframe("1y")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            timeframe === "1y" ? "bg-reflectify-blue text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
        >
          1 Year
        </button>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Mood Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={moodData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const mood = payload[0].payload.mood;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium">{payload[0].payload.date}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMoodColor(mood) }}></div>
                            <span className="capitalize text-xs">{mood}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={(props) => {
                    const mood = props.payload.mood;
                    return (
                      <circle
                        cx={props.cx}
                        cy={props.cy}
                        r={4}
                        fill={getMoodColor(mood)}
                        stroke="none"
                        strokeWidth={2}
                      />
                    );
                  }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Activity Engagement */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Activity Engagement</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={activityData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-medium">{payload[0].payload.name}</p>
                          <div className="space-y-1 mt-1">
                            {payload.map((entry, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                <span className="text-xs">{entry.name}: {entry.value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="meditation" fill="#8884d8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="journal" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="chat" fill="#ffc658" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Mood Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={moodDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {moodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }}></div>
                            <span className="text-sm font-medium">{data.name}</span>
                          </div>
                          <p className="text-xs mt-1">{data.value}% of your moods</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Progress Analysis */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Progress Analysis</h3>
          <div className="py-6 px-4 space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-reflectify-blue to-reflectify-purple p-3 rounded-full text-white">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-medium">Your Wellbeing Journey</h4>
                <p className="text-sm text-muted-foreground">Day 45</p>
              </div>
            </div>
            
            <div className="border-l-2 border-reflectify-blue/20 pl-4 ml-6 space-y-4 py-2">
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-3 h-3 bg-reflectify-blue rounded-full"></div>
                <h5 className="font-medium">Consistent Progress</h5>
                <p className="text-sm text-muted-foreground">
                  You've been consistent in your journaling practice, with an impressive 12-day streak. Keep it up!
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-3 h-3 bg-reflectify-teal rounded-full"></div>
                <h5 className="font-medium">Mood Improvements</h5>
                <p className="text-sm text-muted-foreground">
                  Your mood stability has improved by 5% over the past month, showing great resilience.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-6 mt-1 w-3 h-3 bg-reflectify-purple rounded-full"></div>
                <h5 className="font-medium">Mindfulness Achievement</h5>
                <p className="text-sm text-muted-foreground">
                  You've completed 18 meditation sessions this month - that's 8% more than last month!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
