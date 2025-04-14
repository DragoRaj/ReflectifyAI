
import React, { useState, useEffect } from 'react';
import { format, differenceInDays, formatDistanceToNow } from 'date-fns';
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
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { Shield, MessageCircle, BookText, Sparkles, Calendar, Smile, Frown, Meh, ArrowRight, Trophy, BarChart2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';

// User model for this component
interface UserStats {
  startDate: string | null;
  daysActive: number;
  moodEntries: { date: string; mood: string; value: number }[];
  journalEntries: number;
  mindfulnessMinutes: number;
  chatInteractions: number;
  expressInteractions: number;
  healthChecks: number;
  contentAnalysis: number;
  milestones: {
    reached: string[];
    upcoming: string[];
  }
}

const EmptyStatePlaceholder = ({ message, icon: Icon }: { message: string, icon: React.ElementType }) => (
  <div className="flex flex-col items-center justify-center h-60 p-8 text-center animate-fadeIn">
    <div className="mb-4 p-4 rounded-full bg-secondary/50 text-muted-foreground">
      <Icon className="h-10 w-10" />
    </div>
    <p className="text-muted-foreground max-w-xs">{message}</p>
  </div>
);

const FunctionalAnalytics = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from a database
    setLoading(true);
    
    // Retrieve real user data from localStorage
    const loadUserStats = () => {
      // Get app start date from localStorage
      const startDateStr = localStorage.getItem('appStartDate');
      const startDate = startDateStr ? new Date(startDateStr) : new Date();
      
      if (!startDateStr) {
        // First time use - set start date
        localStorage.setItem('appStartDate', new Date().toISOString());
      }
      
      // Get mood entries from localStorage
      const moodEntriesStr = localStorage.getItem('moodEntries');
      const moodEntries = moodEntriesStr ? JSON.parse(moodEntriesStr) : [];
      
      // Calculate days active
      const daysActive = differenceInDays(new Date(), startDate) + 1;
      
      // Get journal entries count
      const journalCount = parseInt(localStorage.getItem('journalEntryCount') || '0');
      
      // Get mindfulness minutes
      const mindfulnessMinutes = parseInt(localStorage.getItem('mindfulnessMinutes') || '0');
      
      // Get chat interactions
      const chatInteractions = parseInt(localStorage.getItem('chatInteractionCount') || '0');
      
      // Get express interactions
      const expressInteractions = parseInt(localStorage.getItem('expressInteractionCount') || '0');
      
      // Get health checks
      const healthChecks = parseInt(localStorage.getItem('healthCheckCount') || '0');
      
      // Get content analysis count
      const contentAnalysis = parseInt(localStorage.getItem('contentAnalysisCount') || '0');
      
      // Calculate milestones
      const milestones = calculateMilestones({
        daysActive,
        journalEntries: journalCount,
        mindfulnessMinutes,
        chatInteractions,
        expressInteractions,
        healthChecks,
        contentAnalysis
      });

      return {
        startDate: startDateStr,
        daysActive,
        moodEntries,
        journalEntries: journalCount,
        mindfulnessMinutes,
        chatInteractions,
        expressInteractions,
        healthChecks,
        contentAnalysis,
        milestones
      };
    };
    
    // Set timeout to simulate loading
    setTimeout(() => {
      const userStats = loadUserStats();
      setStats(userStats);
      setLoading(false);
    }, 1000);
  }, []);
  
  const calculateMilestones = (data: any) => {
    const milestones = {
      reached: [] as string[],
      upcoming: [] as string[]
    };
    
    // Day-based milestones
    if (data.daysActive >= 1) milestones.reached.push("First day using Reflectify");
    else milestones.upcoming.push("First day using Reflectify");
    
    if (data.daysActive >= 7) milestones.reached.push("One week with Reflectify");
    else milestones.upcoming.push("One week with Reflectify");
    
    if (data.daysActive >= 30) milestones.reached.push("One month wellbeing journey");
    else milestones.upcoming.push("One month wellbeing journey");
    
    // Activity-based milestones
    if (data.journalEntries >= 1) milestones.reached.push("First journal entry");
    else milestones.upcoming.push("First journal entry");
    
    if (data.mindfulnessMinutes >= 10) milestones.reached.push("10 minutes of mindfulness");
    else milestones.upcoming.push("10 minutes of mindfulness");
    
    if (data.chatInteractions >= 5) milestones.reached.push("5 wellbeing chats");
    else milestones.upcoming.push("5 wellbeing chats");
    
    if (data.expressInteractions >= 3) milestones.reached.push("3 express sessions");
    else milestones.upcoming.push("3 express sessions");
    
    if (data.healthChecks >= 1) milestones.reached.push("First health check");
    else milestones.upcoming.push("First health check");
    
    if (data.contentAnalysis >= 2) milestones.reached.push("2 content analyses");
    else milestones.upcoming.push("2 content analyses");
    
    return milestones;
  };
  
  const generateProgressData = () => {
    if (!stats) return [];
    
    const today = new Date();
    const data = [];
    
    // Generate data for the past week or since start date (whichever is more recent)
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const formattedDate = format(date, 'MMM dd');
      
      // Generate some placeholder data if we don't have real data yet
      data.push({
        date: formattedDate,
        journalEntries: 0,
        mindfulnessMinutes: 0,
        interactions: 0
      });
    }
    
    return data;
  };

  const generateActivityBreakdown = () => {
    if (!stats) return [];
    
    return [
      { name: 'Content Analysis', value: stats.contentAnalysis || 0 },
      { name: 'Chat', value: stats.chatInteractions || 0 },
      { name: 'Express', value: stats.expressInteractions || 0 },
      { name: 'Mindfulness', value: stats.mindfulnessMinutes || 0 },
      { name: 'Journal', value: stats.journalEntries || 0 },
      { name: 'Health', value: stats.healthChecks || 0 }
    ];
  };

  const generateWellbeingRadarData = () => {
    if (!stats) return [];
    
    // This would ideally be calculated from real user data
    // Currently returning empty or minimal data to reflect real use
    return [
      { subject: 'Emotional', A: 0, fullMark: 100 },
      { subject: 'Physical', A: 0, fullMark: 100 },
      { subject: 'Social', A: 0, fullMark: 100 },
      { subject: 'Intellectual', A: 0, fullMark: 100 },
      { subject: 'Spiritual', A: 0, fullMark: 100 },
      { subject: 'Environmental', A: 0, fullMark: 100 },
    ];
  };

  const COLORS = ['#16a34a', '#0891b2', '#8b5cf6', '#ec4899', '#f97316', '#06b6d4'];

  const renderNoDataYet = () => (
    <EmptyStatePlaceholder 
      message="No data available yet. As you use Reflectify, your analytics will appear here." 
      icon={BarChart2}
    />
  );

  const renderCustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
  
    return null;
  };

  if (loading) {
    return (
      <div className="w-full py-12 flex flex-col items-center justify-center animate-pulse">
        <BarChart2 className="h-16 w-16 text-emerald-500/50 mb-4" />
        <p className="text-muted-foreground">Loading your analytics...</p>
      </div>
    );
  }

  const hasNoActivity = !stats || (
    stats.journalEntries === 0 &&
    stats.mindfulnessMinutes === 0 &&
    stats.chatInteractions === 0 &&
    stats.expressInteractions === 0 &&
    stats.healthChecks === 0 &&
    stats.contentAnalysis === 0
  );

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 animate-fadeIn">
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-semibold tracking-tight reflectify-gradient-text">Your Wellbeing Analytics</h2>
        <p className="text-muted-foreground max-w-3xl">
          Track your progress, discover insights about your wellbeing journey, and see how your habits are evolving over time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 hover-glow staggered-item">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-medium">Wellbeing Journey</h3>
            </div>
            {stats?.startDate && (
              <span className="text-xs text-muted-foreground">
                Since {format(new Date(stats.startDate), 'MMM d, yyyy')}
              </span>
            )}
          </div>
          
          <div className="text-3xl font-semibold mb-1">
            {stats?.daysActive || 0}
            <span className="text-base font-normal text-muted-foreground ml-2">days</span>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {stats?.startDate ? (
              `You started your wellbeing journey ${formatDistanceToNow(new Date(stats.startDate))} ago`
            ) : (
              "You're just starting your wellbeing journey today"
            )}
          </p>
          
          <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full" style={{ 
              width: `${Math.min((stats?.daysActive || 0) / 30 * 100, 100)}%`
            }}></div>
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Day 1</span>
            <span>30 days</span>
          </div>
        </div>
        
        <div className="glass-card rounded-xl p-6 hover-glow staggered-item">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Milestones</h3>
          </div>
          
          {stats?.milestones.reached.length ? (
            <div className="space-y-3 mb-4">
              <p className="text-sm font-medium">Reached:</p>
              <div className="space-y-2">
                {stats.milestones.reached.map((milestone, index) => (
                  <div key={`reached-${index}`} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></div>
                    <span>{milestone}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground mb-4">No milestones reached yet</p>
          )}
          
          {stats?.milestones.upcoming.length ? (
            <>
              <p className="text-sm font-medium">Upcoming:</p>
              <div className="space-y-2 text-muted-foreground">
                {stats.milestones.upcoming.slice(0, 3).map((milestone, index) => (
                  <div key={`upcoming-${index}`} className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                    <span>{milestone}</span>
                  </div>
                ))}
                {stats.milestones.upcoming.length > 3 && (
                  <p className="text-xs">+{stats.milestones.upcoming.length - 3} more</p>
                )}
              </div>
            </>
          ) : null}
        </div>
        
        <div className="glass-card rounded-xl p-6 hover-glow staggered-item">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
              <Smile className="h-5 w-5" />
            </div>
            <h3 className="font-medium">Mood Tracking</h3>
          </div>
          
          {(stats?.moodEntries?.length || 0) > 0 ? (
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={stats?.moodEntries.slice(-7)}
                  margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={renderCustomTooltip} />
                  <Line type="monotone" dataKey="value" stroke="#16a34a" strokeWidth={2} dot={{ stroke: '#16a34a', strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Meh className="h-5 w-5 text-gray-400" />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <Smile className="h-5 w-5 text-emerald-400" />
              </div>
              <p className="text-sm text-muted-foreground">Use the Chat feature to start tracking your mood</p>
            </div>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-emerald-50 dark:bg-indigo-900/50">
          <TabsTrigger value="overview">Activity Overview</TabsTrigger>
          <TabsTrigger value="breakdown">Feature Usage</TabsTrigger>
          <TabsTrigger value="insights">Wellbeing Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-medium mb-6">Activity Timeline</h3>
            
            {hasNoActivity ? (
              <EmptyStatePlaceholder
                message="Start using Reflectify features to see your activity timeline." 
                icon={Calendar}
              />
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={generateProgressData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={renderCustomTooltip} />
                    <Legend />
                    <Bar name="Journal Entries" dataKey="journalEntries" stackId="a" fill="#16a34a" />
                    <Bar name="Mindfulness (min)" dataKey="mindfulnessMinutes" stackId="a" fill="#0891b2" />
                    <Bar name="Interactions" dataKey="interactions" stackId="a" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="breakdown" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-medium mb-6">Feature Usage</h3>
            
            {hasNoActivity ? (
              <EmptyStatePlaceholder
                message="As you use different features, your usage patterns will appear here." 
                icon={MessageCircle}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={generateActivityBreakdown()}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                        label
                      >
                        {generateActivityBreakdown().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={renderCustomTooltip} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium mb-4">Feature Breakdown</h4>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm">Content Analysis</span>
                      </div>
                      <span className="font-medium">{stats?.contentAnalysis || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-teal-500" />
                        <span className="text-sm">Chat</span>
                      </div>
                      <span className="font-medium">{stats?.chatInteractions || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Express</span>
                      </div>
                      <span className="font-medium">{stats?.expressInteractions || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-pink-500" />
                        <span className="text-sm">Mindfulness</span>
                      </div>
                      <span className="font-medium">{stats?.mindfulnessMinutes || 0}min</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <BookText className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Journal</span>
                      </div>
                      <span className="font-medium">{stats?.journalEntries || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-xl font-medium mb-6">Wellbeing Insights</h3>
            
            {hasNoActivity ? (
              <EmptyStatePlaceholder
                message="Use Reflectify regularly to generate personalized wellbeing insights." 
                icon={Sparkles}
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={generateWellbeingRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="Wellbeing Score" dataKey="A" stroke="#16a34a" fill="#16a34a" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="glass-card rounded-xl p-6">
                  <h4 className="text-lg font-medium mb-4">Personal Insights</h4>
                  
                  <div className="space-y-4 text-sm text-muted-foreground">
                    <p>
                      Continue using Reflectify to unlock personalized insights about your wellbeing patterns and trends.
                    </p>
                    <p>
                      As you use more features, we'll analyze your data to provide actionable recommendations and observations.
                    </p>
                    <button 
                      onClick={() => toast.info('Keep using Reflectify features to generate personalized insights!', {
                        description: 'Your data will help us provide better recommendations for your wellbeing journey.',
                        action: {
                          label: 'Explore Features',
                          onClick: () => console.log('Explore features clicked')
                        },
                      })}
                      className="reflectify-button text-sm mt-2"
                    >
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FunctionalAnalytics;
