
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import SignInForm from "@/components/auth/SignInForm";
import SignUpForm from "@/components/auth/SignUpForm";

export default function Auth() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-indigo-50 to-blue-100 dark:from-indigo-950 dark:to-blue-900">
      <div className="w-full max-w-md px-4">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6"
        >
          <h1 className="text-3xl font-bold text-indigo-700 dark:text-indigo-400">Reflectify</h1>
          <p className="text-slate-600 dark:text-slate-300">School Wellbeing Platform</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="shadow-lg border-indigo-100 dark:border-indigo-700 dark:bg-slate-800">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center dark:text-white">Welcome</CardTitle>
              <CardDescription className="text-center dark:text-slate-300">
                Sign in to access your Reflectify account or create a new one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Create Account</TabsTrigger>
                </TabsList>

                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <TabsContent value="signin">
                  <SignInForm setError={setError} />
                </TabsContent>

                <TabsContent value="signup">
                  <SignUpForm setError={setError} />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-sm text-center text-slate-500 dark:text-slate-400">
              By continuing, you agree to the terms of service and privacy policy.
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
