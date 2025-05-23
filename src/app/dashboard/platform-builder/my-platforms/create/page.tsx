
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';
import { Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function CreatePlatformPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [platformName, setPlatformName] = useState<string>("");
  const [platformDescription, setPlatformDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSavePlatform = async () => {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }
    if (!platformName.trim()) {
      toast({ title: "Validation Error", description: "Platform name cannot be empty.", variant: "destructive" });
      return;
    }

    setIsSaving(true);

    try {
      const docRef = await addDoc(collection(db, "platforms"), {
        tenantId: currentUser.uid, // Using UID as tenantId proxy for now
        name: platformName,
        description: platformDescription,
        status: 'draft', // Default status
        createdAt: serverTimestamp() as Timestamp,
        lastModified: serverTimestamp() as Timestamp,
      });
      toast({
        title: "Platform Created",
        description: `Platform "${platformName}" has been successfully created as a draft.`,
      });
      router.push(`/dashboard/platform-builder/my-platforms/${docRef.id}/edit`); 
    } catch (error) {
      console.error("Error saving platform: ", error);
      toast({
        title: "Error Creating Platform",
        description: "Could not create the platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Create New Platform"
        description="Define the basic details for your new platform."
        actions={
          <Button onClick={handleSavePlatform} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Platform
          </Button>
        }
      />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Platform Details</CardTitle>
            <CardDescription>Enter the name and description for your new platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                id="platformName"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="e.g., Client Portal Q1"
                className="mt-1"
                disabled={isSaving}
                />
            </div>
            <div>
                <Label htmlFor="platformDescription">Description (Optional)</Label>
                <Textarea
                id="platformDescription"
                value={platformDescription}
                onChange={(e) => setPlatformDescription(e.target.value)}
                placeholder="A brief description of this platform's purpose."
                rows={3}
                className="mt-1"
                disabled={isSaving}
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
