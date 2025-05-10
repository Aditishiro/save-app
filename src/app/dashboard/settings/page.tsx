import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UploadCloud, Palette, ShieldCheck, Users, FileSpreadsheet } from 'lucide-react';

export default function SettingsPage() {
  return (
    <>
      <PageHeader
        title="Application Settings"
        description="Configure branding, submission rules, data export options, and user access."
      />
      <Tabs defaultValue="branding" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
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
                  <Input id="logoUpload" type="file" className="max-w-xs" />
                  <Button variant="outline"><UploadCloud className="mr-2 h-4 w-4" /> Upload</Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 200x50px. Formats: PNG, JPG, SVG.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="themeColor">Theme Color</Label>
                <Input id="themeColor" type="color" defaultValue="#60A5FA" className="w-24 h-10 p-1" />
                 <p className="text-xs text-muted-foreground">This will affect buttons and highlights. Current theme uses HSL variables from globals.css.</p>
              </div>
              <Button>Save Branding</Button>
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
                  <Label htmlFor="allowMultiple" className="font-medium">Allow Multiple Submissions</Label>
                  <p className="text-sm text-muted-foreground">Allow users to submit the same form multiple times.</p>
                </div>
                <Switch id="allowMultiple" defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label htmlFor="submissionLimit" className="font-medium">Enable Submission Limit</Label>
                  <p className="text-sm text-muted-foreground">Set a maximum number of submissions for a form.</p>
                </div>
                <Switch id="submissionLimit" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="autoResponseMessage">Auto-Response Message</Label>
                <Input id="autoResponseMessage" placeholder="Thank you for your submission!" />
              </div>
              <Button>Save Submission Rules</Button>
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
                <Select defaultValue="csv">
                  <SelectTrigger id="defaultFormat" className="w-[180px]">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                    <SelectItem value="json">JSON (.json)</SelectItem>
                    <SelectItem value="excel">Excel (.xlsx) - Coming Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="includeMetadata" />
                <Label htmlFor="includeMetadata" className="font-normal">Include submission metadata (timestamps, IP address)</Label>
              </div>
              <Button>Save Export Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="access">
          <Card>
            <CardHeader>
              <CardTitle>Access Control</CardTitle>
              <CardDescription>Manage user roles and permissions for forms.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Add User</Label>
                <div className="flex gap-2">
                  <Input type="email" placeholder="user@example.com" className="flex-grow" />
                  <Select defaultValue="viewer">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                      <SelectItem value="publisher">Publisher</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button>Add User</Button>
                </div>
              </div>
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Existing Users:</h4>
                {/* Mock user list */}
                <div className="flex justify-between items-center py-2 border-b">
                  <p>jane.doe@example.com</p>
                  <p className="text-sm text-muted-foreground">Editor</p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                </div>
                <div className="flex justify-between items-center py-2">
                  <p>mark.smith@example.com</p>
                  <p className="text-sm text-muted-foreground">Viewer</p>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                </div>
              </div>
               <Button>Save Access Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
