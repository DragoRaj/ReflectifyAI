
import React, { useState, useEffect } from "react";
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
import { Activity, Brain, TrendingUp, Calendar, Award, ArrowUpRight, Info, Sparkles } from "lucide-react";

// Sample data with empty state alternatives
const getEmptyLineChartData = () => {
  return [
    { date: "Day 1", value: 0, mood: "neutral" },
    { date: "Day 7", value: 0, mood: "neutral" },
    { date: "Day 14", value: 0, mood: "neutral" },
    { date: "Day 21", value: 0, mood: "neutral" },
    { date: "Day 30", value: 0, mood: "neutral" },
  ];
};

const getEmptyBarChartData = () => {
  return [
    { name: "Week 1", meditation: 0, journal: 0, chat: 0 },
    { name: "Week 2", meditation: 0, journal: 0, chat: 0 },
    { name: "Week 3", meditation: 0, journal: 0, chat: 0 },
    { name: "Week 4", meditation: 0, journal: 0, chat: 0 },
  ];
};

const getEmptyMoodDistribution = () => {
  return [
    { name: "No Data", value: 100, color: "#64748b" }
  ];
};

const Analytics = () => {
  const [timeframe, setTimeframe] = useState("1m");
  const [hasData, setHasData] = useState(false);
  const [daysSinceStart, setDaysSinceStart] = useState(0);
  const [moodData, setMoodData] = useState(getEmptyLineChartData());
  const [activityData, setActivityData] = useState(getEmptyBarChartData());
  const [moodDistribution, setMoodDistribution] = useState(getEmptyMoodDistribution());
  
  // Simulating user data loading and checking
  useEffect(() => {
    // Check if user has stored start date
    const startDate = localStorage.getItem("userStartDate");
    
    if (startDate) {
      const start = new Date(startDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDaysSinceStart(diffDays);
      
      // If user has been using the app for at least 7 days, we could show some data
      setHasData(diffDays >= 7);
    } else {
      // Set today as start date if not exist
      localStorage.setItem("userStartDate", new Date().toISOString());
      setDaysSinceStart(0);
      setHasData(false);
    }
  }, []);
  
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
        {!hasData ? (
          <div className="col-span-full glass-card rounded-xl p-6 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 rounded-full bg-reflectify-blue/10 text-reflectify-blue">
                <Info className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Your analytics are being prepared</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                As you continue to use Reflectify, we'll gather insights about your wellbeing journey.
                Check back soon to see your personalized analytics.
              </p>
              <div className="mt-2 text-sm text-reflectify-blue">
                Day {daysSinceStart} of your journey
              </div>
            </div>
          </div>
        ) : (
          // Your normal metrics here when hasData is true
          [
            {
              title: "Wellbeing Score",
              value: "N/A",
              change: 0,
              trend: "up",
              icon: <Activity className="h-4 w-4" />,
              color: "from-reflectify-blue to-reflectify-teal"
            },
            {
              title: "Mindfulness",
              value: "N/A",
              change: 0,
              trend: "up",
              icon: <Brain className="h-4 w-4" />,
              color: "from-reflectify-purple to-reflectify-blue"
            },
            {
              title: "Mood Stability",
              value: "N/A",
              change: 0,
              trend: "up",
              icon: <TrendingUp className="h-4 w-4" />,
              color: "from-reflectify-teal to-green-400"
            },
            {
              title: "Journaling Streak",
              value: 0,
              unit: "days",
              change: 0,
              trend: "up",
              icon: <Calendar className="h-4 w-4" />,
              color: "from-amber-500 to-orange-400"
            }
          ].map((metric, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-2">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${metric.color} text-white`}>
                  {metric.icon}
                </div>
                <div className={`flex items-center ${metric.trend === 'up' ? 'text-reflectify-teal' : 'text-muted-foreground'}`}>
                  <span className="text-xs font-medium">{metric.change}%</span>
                  {metric.trend === 'up' && (
                    <ArrowUpRight className="h-3 w-3 ml-0.5" />
                  )}
                </div>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold">{metric.value}</span>
                {metric.unit && <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Time frame selector - only show if hasData */}
      {hasData && (
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
      )}
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trends */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Mood Trends</h3>
          
          {!hasData ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Sparkles className="h-7 w-7 text-reflectify-blue/60" />
                </div>
                <h4 className="text-base font-medium mb-2">No mood data yet</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  As you log your moods in the chat and journaling features, you'll see trends appear here.
                </p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
        
        {/* Activity Engagement */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Activity Engagement</h3>
          
          {!hasData ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Activity className="h-7 w-7 text-reflectify-blue/60" />
                </div>
                <h4 className="text-base font-medium mb-2">No activity data yet</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Your activity data will appear here as you use meditation, journaling, and chat features.
                </p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Mood Distribution</h3>
          
          {!hasData ? (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <TrendingUp className="h-7 w-7 text-reflectify-blue/60" />
                </div>
                <h4 className="text-base font-medium mb-2">Mood distribution coming soon</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  As you track your moods, we'll analyze the distribution to help you understand your emotional patterns.
                </p>
              </div>
            </div>
          ) : (
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
          )}
        </div>
        
        {/* Progress Analysis */}
        <div className="glass-card rounded-xl p-4 border border-reflectify-blue/10 shadow-lg shadow-reflectify-blue/5 transition-all duration-300 hover:border-reflectify-blue/20">
          <h3 className="font-display font-medium mb-4">Progress Analysis</h3>
          
          {!hasData ? (
            <div className="py-6 px-4 h-64 flex items-center justify-center">
              <div className="text-center p-6">
                <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Award className="h-7 w-7 text-reflectify-blue/60" />
                </div>
                <h4 className="text-base font-medium mb-2">Your journey is just beginning</h4>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Day {daysSinceStart} of your wellbeing journey. Keep using Reflectify to unlock insights about your progress.
                </p>
              </div>
            </div>
          ) : (
            <div className="py-6 px-4 space-y-4">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-reflectify-blue to-reflectify-purple p-3 rounded-full text-white">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-medium">Your Wellbeing Journey</h4>
                  <p className="text-sm text-muted-foreground">Day {daysSinceStart}</p>
                </div>
              </div>
              
              <div className="border-l-2 border-reflectify-blue/20 pl-4 ml-6 space-y-4 py-2">
                <div className="relative">
                  <div className="absolute -left-6 mt-1 w-3 h-3 bg-reflectify-blue rounded-full"></div>
                  <h5 className="font-medium">Just Started</h5>
                  <p className="text-sm text-muted-foreground">
                    You're at the beginning of your wellbeing journey. Keep using Reflectify to see your progress!
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
