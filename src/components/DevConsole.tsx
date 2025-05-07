import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, Monitor, Users, Settings, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function DevConsole() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isHybrid, setIsHybrid] = useState(false);
  const { user, profile } = useAuth();

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return;
      
      // Check if this is the special hybrid account
      if (user.email === "teketirajnish@gmail.com") {
        setIsHybrid(true);
        setIsAdmin(true);
        return;
      }
      
      // Otherwise check normal role
      setIsAdmin(profile?.role === "teacher" || profile?.role === "admin");
    };

    checkAdminAccess();
  }, [user, profile]);

  if (!user || (!isAdmin && !isHybrid)) return null;

  if (!isOpen) {
    return (
      <Button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-800 text-white p-3 rounded-full shadow-lg hover:bg-slate-700"
        size="icon"
      >
        <Terminal size={20} />
      </Button>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 bg-slate-900 text-white shadow-lg z-50 border-t border-slate-700 max-h-[50vh] overflow-auto">
      <div className="flex justify-between items-center p-2 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Terminal size={18} />
          <h2 className="text-sm font-semibold">Reflectify Dev Console</h2>
          {isHybrid && (
            <span className="text-xs bg-purple-600 px-2 py-0.5 rounded-full">Hybrid Account</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-6 w-6 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full"
        >
          <X size={14} />
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard" className="p-4">
        <TabsList className="bg-slate-800 border border-slate-700">
          <TabsTrigger value="dashboard">
            <Monitor size={14} className="mr-2" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users size={14} className="mr-2" />
            Users
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings size={14} className="mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                    View Dashboard
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                    Analytics
                  </Button>
                  <Button size="sm" variant="outline" className="border-slate-600 hover:bg-slate-700">
                    Student View
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span>Database:</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>API:</span>
                    <span className="text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Auth:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs space-y-2">
                  <div className="border-l-2 border-blue-500 pl-2">
                    <p className="font-medium">User Login</p>
                    <p className="text-slate-400">2 minutes ago</p>
                  </div>
                  <div className="border-l-2 border-green-500 pl-2">
                    <p className="font-medium">Survey Completed</p>
                    <p className="text-slate-400">15 minutes ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="p-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">User management interface would be displayed here.</p>
              <div className="mt-4">
                <Button size="sm" variant="secondary" className="mr-2">View All Users</Button>
                <Button size="sm" variant="outline" className="border-slate-600">Role Management</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings" className="p-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">System configuration options would be displayed here.</p>
              <div className="mt-4">
                <Button size="sm" variant="secondary">Open Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default DevConsole;
