
'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Palette, ShieldCheck, Users, FileSpreadsheet, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserAccess {
  id: string;
  email: string;
  role: 'viewer' | 'editor' | 'publisher';
}

export default function SettingsPage() {
  const { toast } = useToast();

  // Branding State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoFileName, setLogoFileName] = useState<string>('');
  const [themeColor, setThemeColor] = useState<string>("#60A5FA"); // Default to current primary

  // Submission Rules State
  const [allowMultipleSubmissions, setAllowMultipleSubmissions] = useState<boolean>(true);
  const [enableSubmissionLimit, setEnableSubmissionLimit] = useState<boolean>(false);
  const [submissionLimitCount, setSubmissionLimitCount] = useState<number>(100);
  const [autoResponseMessage, setAutoResponseMessage] = useState<string>("Thank you for your submission!");

  // Data Export State
  const [defaultExportFormat, setDefaultExportFormat] = useState<string>("csv");
  const [includeMetadata, setIncludeMetadata] = useState<boolean>(false);

  // Access Control State
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserRole, setNewUserRole] = useState<'viewer' | 'editor' | 'publisher'>('viewer');
  const [userAccessList, setUserAccessList] = useState<UserAccess[]>([
    { id: '1', email: 'jane.doe@example.com', role: 'editor' },
    { id: '2', email: 'mark.smith@example.com', role: 'viewer' },
  ]);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setLogoFile(event.target.files[0]);
      setLogoFileName(event.target.files[0].name);
    } else {
      setLogoFile(null);
      setLogoFileName('');
    }
  };

  const handleSaveBranding = () => {
    toast({
      title: "Branding Settings Saved",
      description: `Logo: ${logoFileName || 'None'}, Theme Color: ${themeColor}`,
    });
    // In a real app, you'd upload the logo and save the themeColor.
    console.log("Branding Settings:", { logoFile, themeColor });
  };

  const handleSaveSubmissionRules = () => {
    toast({
      title: "Submission Rules Saved",
      description: "Your submission rules have been updated.",
    });
    console.log("Submission Rules:", { allowMultipleSubmissions, enableSubmissionLimit, submissionLimitCount, autoResponseMessage });
  };

  const handleSaveExportSettings = () => {
    toast({
      title: "Export Settings Saved",
      description: "Your data export settings have been updated.",
    });
    console.log("Export Settings:", { defaultExportFormat, includeMetadata });
  };

  const handleAddUserAccess = () => {
    if (!newUserEmail.trim()) {
      toast({ title: "Error", description: "Please enter a user email.", variant: "destructive" });
      return;
    }
    const newUser: UserAccess = {
      id: Date.now().toString(),
      email: newUserEmail,
      role: newUserRole,
    };
    setUserAccessList(prev => [...prev, newUser]);
    setNewUserEmail('');
    setNewUserRole('viewer');
    toast({ title: "User Added", description: `${newUser.email} has been added with ${newUser.role} role.` });
  };

  const handleRemoveUserAccess = (userId: string) => {
    setUserAccessList(prev => prev.filter(user => user.id !== userId));
    toast({ title: "User Removed", description: "The user access has been revoked." });
  };
  
  const handleSaveAccessSettings = () => {
    toast({
      title: "Access Settings Saved",
      description: "User access configurations have been updated.",
    });
    console.log("Access Settings:", { userAccessList });
  };


  return (
    <>
      <PageHeader
        title="Application Settings"
        description="Configure branding, submission rules, data export options, and user access."
      />
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="branding"><Palette className="mr-2 h-4 w-4 inline-block" />Branding</TabsTrigger>
          <TabsTrigger value="submission"><ShieldCheck className="mr-2 h-4 w-4 inline-block" />Submission Rules</TabsTrigger>
          <TabsTrigger value="export"><FileSpreadsheet className="mr-2 h-4 w-4 inline-block" />Data Export</TabsTrigger>
          <TabsTrigger value="access"><Users className="mr-2 h-4 w-4 inline-block" />Access Control</TabsTrigger>
        </TabsList>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the look and feel of your forms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="logoUpload">Upload Logo</Label>
                <div className="flex items-center gap-4">
                  <Input id="logoUpload" type="file" className="max-w-xs" onChange={handleLogoUpload} accept="image/png, image/jpeg, image/svg+xml" />
                  {logoFileName && <p className="text-sm text-muted-foreground">Selected: {logoFileName}</p>}
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 200x50px. Formats: PNG, JPG, SVG.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="themeColor">Theme Color (Primary)</Label>
                <Input id="themeColor" type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="w-24 h-10 p-1" />
                 <p className="text-xs text-muted-foreground">This will affect buttons and highlights. Current theme uses HSL variables from globals.css. Live update not implemented here.</p>
              </div>
              <Button onClick={handleSaveBranding}>Save Branding</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="submission">
          <Card>
            <CardHeader>
              <CardTitle>Submission Rules</CardTitle>
              <CardDescription>Define rules for form submissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="allowMultiple" className="font-medium">Allow Multiple Submissions per User</Label>
                  <p className="text-sm text-muted-foreground">Allow users to submit the same form multiple times.</p>
                </div>
                <Switch id="allowMultiple" checked={allowMultipleSubmissions} onCheckedChange={setAllowMultipleSubmissions} />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="submissionLimitSwitch" className="font-medium">Enable Global Submission Limit per Form</Label>
                  <p className="text-sm text-muted-foreground">Set a maximum number of total submissions for any form.</p>
                </div>
                <Switch id="submissionLimitSwitch" checked={enableSubmissionLimit} onCheckedChange={setEnableSubmissionLimit} />
              </div>
              {enableSubmissionLimit && (
                <div className="space-y-2 pl-4 border-l-2 ml-2">
                  <Label htmlFor="submissionLimitCount">Maximum Submissions</Label>
                  <Input id="submissionLimitCount" type="number" value={submissionLimitCount} onChange={(e) => setSubmissionLimitCount(parseInt(e.target.value, 10) || 0)} className="w-32" />
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="autoResponseMessage">Auto-Response Email Message (on successful submission)</Label>
                <Input id="autoResponseMessage" placeholder="Thank you for your submission!" value={autoResponseMessage} onChange={(e) => setAutoResponseMessage(e.target.value)} />
                 <p className="text-xs text-muted-foreground">This message would be sent if email integration is configured.</p>
              </div>
              <Button onClick={handleSaveSubmissionRules}>Save Submission Rules</Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="export">
          <Card>
            <CardHeader>
              <CardTitle>Data Export Settings</CardTitle>
              <CardDescription>Configure how data is exported from submissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                <Label htmlFor="defaultFormat">Default Export Format</Label>
                <Select value={defaultExportFormat} onValueChange={setDefaultExportFormat}>
                  <SelectTrigger id="defaultFormat" className="w-[200px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                    <SelectItem value="excel" disabled>Excel (.xlsx) - Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 rounded-lg border p-4">
                <Switch id="includeMetadata" checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                <div className="flex-1">
                  <Label htmlFor="includeMetadata" className="font-medium">Include submission metadata</Label>
                  <p className="text-sm text-muted-foreground">Include details like submission ID, timestamp, and submitter ID (if available) in exports.</p>
                </div>
              </div>
              <Button onClick={handleSaveExportSettings}>Save Export Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage user roles and permissions for the application (mock implementation).</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-medium mb-2">Add New User</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input 
                    type="email" 
                    placeholder="user@example.com" 
                    className="flex-grow" 
                    value={newUserEmail} 
                    onChange={(e) => setNewUserEmail(e.target.value)} 
                  />
                  <Select value={newUserRole} onValueChange={(value) => setNewUserRole(value as 'viewer' | 'editor' | 'publisher')}>
                    <SelectTrigger className="w-full sm:w-[180px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="publisher">Publisher</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleAddUserAccess} className="w-full sm:w-auto">Add User</Button>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Existing Users ({userAccessList.length}):</h4>
                {userAccessList.length > 0 ? (
                  <div className="space-y-2">
                    {userAccessList.map((user) => (
                      <div key={user.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b last:border-b-0 gap-2">
                        <div className="flex-1">
                          <p className="font-medium">{user.email}</p>
                          <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveUserAccess(user.id)}>
                          <Trash2 className="mr-1 h-3 w-3" /> Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No users configured.</p>
                )}
              </div>
               <Button onClick={handleSaveAccessSettings}>Save Access Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
