
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';
import { Loader2, AlertTriangle, ArrowLeft, Save } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import type { PlatformData } from '@/platform-builder/data-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function EditPlatformPage() {
  const params = useParams();
  const platformId = params.platformId as string; 
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [platform, setPlatform] = useState<PlatformData | null>(null);
  const [platformName, setPlatformName] = useState<string>("");
  const [platformDescription, setPlatformDescription] = useState<string>("");
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!platformId || !currentUser) {
        if (!platformId) router.push('/dashboard/platform-builder/my-platforms'); 
        return;
    };

    setIsLoading(true);
    setError(null);
    const platformDocRef = doc(db, 'platforms', platformId);

    getDoc(platformDocRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as Omit<PlatformData, 'id'>;
           // Assuming tenantId is currentUser.uid for now
          if (data.tenantId !== currentUser.uid) { 
             setError("You are not authorized to edit this platform.");
             toast({ title: "Access Denied", description: "You do not have permission.", variant: "destructive"});
             router.push('/dashboard/platform-builder/my-platforms');
             return;
          }
          setPlatform({ id: docSnap.id, ...data });
          setPlatformName(data.name);
          setPlatformDescription(data.description || "");
        } else {
          setError(`Platform with ID "${platformId}" could not be found.`);
          toast({ title: "Platform Not Found", description: `Platform ID "${platformId}" does not exist.`, variant: "destructive"});
          router.push('/dashboard/platform-builder/my-platforms');
        }
      })
      .catch((err) => {
        console.error("Error fetching platform: ", err);
        setError("Failed to load platform data. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [platformId, currentUser, router, toast]);

  const handleSaveChanges = async () => {
    if (!currentUser || !platform) {
      toast({ title: "Error", description: "Not authorized or platform data missing.", variant: "destructive"});
      return;
    }
    if (!platformName.trim()) {
      toast({ title: "Validation Error", description: "Platform name cannot be empty.", variant: "destructive" });
      return;
    }

    setIsSaving(true);
    const platformDocRef = doc(db, 'platforms', platform.id);

    const updateData: Partial<PlatformData> = {
      name: platformName,
      description: platformDescription,
      lastModified: serverTimestamp() as Timestamp,
    };

    try {
      await updateDoc(platformDocRef, updateData);
      toast({
        title: "Changes Saved",
        description: `Platform "${platformName}" has been updated.`,
      });
      setPlatform(prev => prev ? {...prev, ...updateData, name: platformName, description: platformDescription} : null);
    } catch (error) {
      console.error("Error updating platform: ", error);
      toast({
        title: "Error Saving Changes",
        description: "Could not save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
     return (
      <div className="flex flex-col h-full">
        <PageHeader title="Loading Platform..." description="Please wait while we fetch your platform details." />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
         <PageHeader title="Error Loading Platform" description={error} />
          <Button variant="outline" asChild>
            <Link href="/dashboard/platform-builder/my-platforms">Back to My Platforms</Link>
          </Button>
      </div>
    );
  }
  
  if (!platform) {
     return (
      <div className="flex flex-col items-center justify-center h-full">
         <PageHeader title="Platform Not Found" />
          <Button variant="outline" asChild>
            <Link href="/dashboard/platform-builder/my-platforms">Back to My Platforms</Link>
          </Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title={`Edit Platform: ${platform.name}`}
        description={`Platform ID: ${platform.id}. Status: ${platform.status}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/platform-builder/my-platforms">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Platforms
                </Link>
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} Save Changes
            </Button>
          </div>
        }
      />
      
      <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 p-6 overflow-y-auto">
        {/* Left Panel: Platform Settings & Global Component Palette */}
        <div className="md:col-span-3 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Platform Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="editPlatformName">Platform Name</Label>
                        <Input id="editPlatformName" value={platformName} onChange={(e) => setPlatformName(e.target.value)} disabled={isSaving} />
                    </div>
                    <div>
                        <Label htmlFor="editPlatformDescription">Description</Label>
                        <Textarea id="editPlatformDescription" value={platformDescription} onChange={(e) => setPlatformDescription(e.target.value)} rows={3} disabled={isSaving}/>
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Component Palette</CardTitle>
                    <CardDescription>Drag components onto the canvas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Global components will be listed here...</p>
                    {/* TODO: Implement fetching and displaying GlobalComponentDefinitions */}
                </CardContent>
            </Card>
        </div>

        {/* Center Panel: Canvas */}
        <div className="md:col-span-6">
            <Card className="h-full min-h-[400px] flex items-center justify-center border-dashed">
                <CardContent className="text-center">
                    <p className="text-lg font-medium text-muted-foreground">Platform Builder Canvas</p>
                    <p className="text-sm text-muted-foreground">Drag and drop components here to build your platform page.</p>
                </CardContent>
            </Card>
        </div>

        {/* Right Panel: Properties of Selected Component */}
        <div className="md:col-span-3">
            <Card>
                <CardHeader>
                    <CardTitle>Component Properties</CardTitle>
                    <CardDescription>Configure the selected component.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Select a component on the canvas to see its properties.</p>
                    {/* TODO: Implement properties panel for selected PlatformComponentInstance */}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
