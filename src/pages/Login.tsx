import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('staff');
  const {
    login
  } = useAuth();
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }
    setIsLoading(true);
    try {
      const success = await login(username, password);
      if (success) {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Clear form when switching tabs
    setUsername('');
    setPassword('');
  };
  return <div className="min-h-screen flex items-center justify-center bg-brick-pattern relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden px- px-px">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-[pulse_4s_infinite]"></div>
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-[pulse_7s_infinite]"></div>
      </div>

      <div className="w-full max-w-md p-8 relative z-10">
        {/* Logo and Title with enhanced animations */}
        <div className="mb-8 text-center">
          <h1 className="mb-3 animate-[fade-in_0.8s_ease-out] tracking-wider font-extrabold text-orange-950 text-3xl">
            <span className="inline-block transform hover:scale-105 transition-transform duration-300">A</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-100">L</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-200">G</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-300">C</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-400">I</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-500">T</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-50"> </span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-600 text-amber-950"> D</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-700">O</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-800">R</span>
            <span className="inline-block transform hover:scale-105 transition-transform duration-300 delay-900 text-red-950">M</span>
          </h1>
          
          <div className="relative h-1 w-32 mx-auto mb-3">
            <div className="absolute inset-0 bg-white/70 rounded-full animate-[width_2s_ease-out_forwards] origin-left"></div>
            <div className="absolute h-full w-4 bg-white rounded-full animate-[slide-in-right_3s_infinite_alternate] delay-1000"></div>
          </div>
          
          <h2 className="text-2xl font-light tracking-wider text-white mb-6 animate-[fade-in_1.2s_ease-out] opacity-0 animate-fill-forwards">
            MANAGEMENT SYSTEM
          </h2>
        </div>

        {/* Login Form with tabs for different user types */}
        <Card className="bg-white/95 backdrop-blur-sm border-none shadow-lg animate-[scale-in_0.5s_ease-out] transform hover:shadow-xl transition-all duration-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-dorm-primary text-2xl text-center flex items-center justify-center gap-2">
              Welcome Back
              <Sparkles className="h-5 w-5 text-yellow-500 animate-[pulse_2s_infinite]" />
            </CardTitle>
            <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <Tabs defaultValue="staff" className="w-full" onValueChange={handleTabChange}>
            <div className="px-6">
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="staff">Staff/Admin</TabsTrigger>
                <TabsTrigger value="resident">Resident</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="staff">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2 animate-[fade-in_0.6s_ease-out_0.2s] opacity-0 animate-fill-forwards">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="Enter your username" value={username} onChange={e => setUsername(e.target.value)} required className="border-dorm-primary/20 focus:border-dorm-primary transition-all duration-300 focus:scale-[1.01]" />
                  </div>
                  <div className="space-y-2 animate-[fade-in_0.6s_ease-out_0.4s] opacity-0 animate-fill-forwards">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required className="border-dorm-primary/20 focus:border-dorm-primary transition-all duration-300 focus:scale-[1.01]" />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 animate-[fade-in_0.6s_ease-out_0.6s] opacity-0 animate-fill-forwards">
                  <Button type="submit" className="w-full bg-dorm-primary hover:bg-dorm-secondary text-white transition-all duration-300 hover:scale-105 group relative overflow-hidden" disabled={isLoading}>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="resident">
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2 animate-[fade-in_0.6s_ease-out_0.2s] opacity-0 animate-fill-forwards">
                    <Label htmlFor="username">Username (firstname.lastname)</Label>
                    <Input id="username" type="text" placeholder="e.g., john.doe" value={username} onChange={e => setUsername(e.target.value)} required className="border-dorm-primary/20 focus:border-dorm-primary transition-all duration-300 focus:scale-[1.01]" />
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Info className="h-3 w-3" />
                      Use your first and last name, all lowercase
                    </p>
                  </div>
                  <div className="space-y-2 animate-[fade-in_0.6s_ease-out_0.4s] opacity-0 animate-fill-forwards">
                    <Label htmlFor="password">Password (123.lastname)</Label>
                    <Input id="password" type="password" placeholder="e.g., 123.doe" value={password} onChange={e => setPassword(e.target.value)} required className="border-dorm-primary/20 focus:border-dorm-primary transition-all duration-300 focus:scale-[1.01]" />
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Info className="h-3 w-3" />
                      Use "123." followed by your last name, all lowercase
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4 animate-[fade-in_0.6s_ease-out_0.6s] opacity-0 animate-fill-forwards">
                  <Button type="submit" className="w-full bg-dorm-primary hover:bg-dorm-secondary text-white transition-all duration-300 hover:scale-105 group relative overflow-hidden" disabled={isLoading}>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>;
};
export default Login;