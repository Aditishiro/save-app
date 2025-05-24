
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Building, Edit3, Eye, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import type { PlatformData } from '@/platform-builder/data-models';

export default function MyPlatformsPage() {
  const { currentUser } = useAuth();
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      const platformsCollectionRef = collection(db, 'platforms');
      // For now, tenantId is currentUser.uid
      const q = query(platformsCollectionRef, where('tenantId', '==', currentUser.uid), orderBy('lastModified', 'desc'));

      getDocs(q)
        .then((querySnapshot) => {
          const fetchedPlatforms = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as PlatformData));
          setPlatforms(fetchedPlatforms);
        })
        .catch((err) => {
          console.error("Error fetching platforms: ", err);
          setError("Failed to fetch platforms. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setPlatforms([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleDeletePlatform = async (platformId: string, platformName: string) => {
    try {
      await deleteDoc(doc(db, 'platforms', platformId));
      setPlatforms(prevPlatforms => prevPlatforms.filter(platform => platform.id !== platformId));
      toast({
        title: "Platform Deleted",
        description: `Platform "${platformName}" has been successfully deleted.`,
      });
    } catch (err) {
      console.error("Error deleting platform: ", err);
      toast({
        title: "Error Deleting Platform",
        description: `Could not delete platform "${platformName}". Please try again.`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="My Platforms"
          description="Manage your custom-built platforms."
          actions={
            <Button asChild disabled>
              <Link href="/dashboard/platform-builder/my-platforms/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Platform
              </Link>
            </Button>
          }
        />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading your platforms...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
       <>
        <PageHeader
          title="My Platforms"
          description="Manage your custom-built platforms."
         actions={
            <Button asChild>
              <Link href="/dashboard/platform-builder/my-platforms/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Platform
              </Link>
            </Button>
          }
        />
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">{error}</h3>
          <p className="mb-4 mt-2 text-sm text-destructive/80">
            Please check your connection or try refreshing the page.
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="My Platforms"
        description="Manage your custom-built platforms."
        actions={
          <Button asChild>
            <Link href="/dashboard/platform-builder/my-platforms/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Platform
            </Link>
          </Button>
        }
      />

      {platforms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Building className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No platforms created yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Get started by creating your first platform.
          </p>
          <Button asChild>
            <Link href="/dashboard/platform-builder/my-platforms/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Platform
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((platform) => (
            <Card key={platform.id} className="flex flex-col shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{platform.name}</CardTitle>
                <CardDescription>
                  Status:{" "}
                  <Badge
                    variant={
                      platform.status === 'published' ? 'default' :
                      platform.status === 'draft' ? 'secondary' :
                      'outline' 
                    }
                    className={
                      platform.status === 'published' ? 'bg-success text-success-foreground' :
                      platform.status === 'draft' ? 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50' :
                      ''
                    }
                  >
                    {platform.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2"> {/* Increased spacing slightly */}
                {platform.description && (
                  <p 
                    className="text-sm text-muted-foreground line-clamp-2" // Use line-clamp for truncation
                    title={platform.description}
                  >
                    {platform.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">Last Modified: {formatDate(platform.lastModified)}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full justify-between items-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/platform-builder/my-platforms/${platform.id}/edit`}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Preview" asChild>
                      <Link href={`/platforms/${platform.id}`} target="_blank"> {/* Assuming live platforms are at /platforms/:id */}
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the platform "{platform.name}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeletePlatform(platform.id, platform.name)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
