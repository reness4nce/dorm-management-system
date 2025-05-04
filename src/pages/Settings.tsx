import React, { useState, useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "../components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { UserCog, ShieldCheck, Building, Bell } from 'lucide-react';

const useAuth = () => useContext(AuthContext);

const Settings = () => {
  const { currentUser } = useAuth() || {};
  const [systemName, setSystemName] = useState("Dorm Nexus");
  const [adminEmail, setAdminEmail] = useState(currentUser?.email || "");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveAdmin = () => {
    toast.success("Admin settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification settings saved successfully");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage system configuration and preferences</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full md:w-auto md:inline-flex grid-cols-3 mb-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="admin">Admin Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Configure general system settings and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="system-name">System Name</Label>
                <Input 
                  id="system-name" 
                  value={systemName}
                  onChange={(e) => setSystemName(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  This name will appear in the header and system-generated communications
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Color Theme</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="h-12 border-2 border-primary">Default</Button>
                  <Button variant="outline" className="h-12">Dark</Button>
                  <Button variant="outline" className="h-12">Light</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveGeneral}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Admin Account Settings */}
        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Admin Account Settings
              </CardTitle>
              <CardDescription>
                Update administrator account information and access controls
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Admin Email</Label>
                <Input 
                  id="admin-email" 
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Reset Password</Label>
                <Input id="admin-password" type="password" placeholder="New password" />
                <Input id="admin-password-confirm" type="password" placeholder="Confirm new password" />
              </div>

              <div className="space-y-2">
                <Label>Security Level</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" className="justify-start">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Standard
                  </Button>
                  <Button variant="default" className="justify-start">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Enhanced
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Maximum
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAdmin}>Update Admin Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Configure system notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive email alerts for important system events
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant={notificationsEnabled ? "default" : "outline"} 
                    onClick={() => setNotificationsEnabled(true)}
                  >
                    On
                  </Button>
                  <Button 
                    variant={!notificationsEnabled ? "default" : "outline"} 
                    onClick={() => setNotificationsEnabled(false)}
                  >
                    Off
                  </Button>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <h4 className="font-medium mb-2">Notification Types</h4>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>New resident registrations</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Checkout form submissions</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span>Clearance updates</span>
                    <Button variant="default" size="sm">Disabled</Button>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span>System reports</span>
                    <Button variant="outline" size="sm">Enabled</Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Notification Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
