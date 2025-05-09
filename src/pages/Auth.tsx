
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, Loader2, Mail, Lock, LogIn, UserRound } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Role } from "@/types/school-types";

export default function Auth() {
  const { user, isLoading, signIn, signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<Role>("student");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      await signIn(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.message || "An error occurred during sign in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Validate form
      if (!firstName.trim() || !lastName.trim()) {
        throw new Error("First name and last name are required");
      }

      await signUp(email, password, firstName, lastName, role);
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up");
    } finally {
      setIsSubmitting(false);
    }
  };

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
                  <form onSubmit={handleSignIn}>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signin-email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="signin-email"
                            type="email"
                            placeholder="your.email@school.edu"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signin-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="signin-password"
                            type="password"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <div className="text-right">
                          <a href="#" className="text-xs text-indigo-600 hover:underline dark:text-indigo-400">Forgot password?</a>
                        </div>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Signing in...
                          </>
                        ) : (
                          <>
                            <LogIn className="mr-2 h-4 w-4" />
                            Sign In
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <div className="relative">
                            <UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                            <Input
                              id="first-name"
                              placeholder="John"
                              className="pl-10"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              required
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input
                            id="last-name"
                            placeholder="Doe"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">School Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="your.email@school.edu"
                            className="pl-10"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Input
                            id="signup-password"
                            type="password"
                            className="pl-10"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Password must be at least 6 characters
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>I am a:</Label>
                        <RadioGroup 
                          defaultValue="student" 
                          className="grid grid-cols-3 gap-2"
                          value={role}
                          onValueChange={(value) => setRole(value as Role)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="student" id="student" />
                            <Label htmlFor="student">Student</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="teacher" id="teacher" />
                            <Label htmlFor="teacher">Teacher</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="admin" />
                            <Label htmlFor="admin">Admin</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </div>
                  </form>
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
