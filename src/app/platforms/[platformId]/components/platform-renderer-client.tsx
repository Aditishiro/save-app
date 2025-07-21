
'use client';

import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase/firebase';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import type { PlatformData, PlatformLayout, PlatformComponentInstance } from '@/platform-builder/data-models';
import { getRenderableComponent } from '@/platform-builder/component-registry';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, ShieldAlert, UserX } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context'; // Import useAuth

interface PlatformRendererClientProps {
  platformId: string;
}

export default function PlatformRendererClient({ platformId }: PlatformRendererClientProps) {
  const { currentUser } = useAuth(); // No authLoading in public-only mode
  const [platform, setPlatform] = useState<PlatformData | null>(null);
  const [layout, setLayout] = useState<PlatformLayout | null>(null);
  const [componentInstances, setComponentInstances] = useState<PlatformComponentInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!platformId) {
      setError("Platform ID is missing.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const platformDocRef = doc(db, 'platforms', platformId);
    const unsubscribePlatform = onSnapshot(platformDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const platformData = { id: docSnap.id, ...docSnap.data() } as PlatformData;

        // In public mode, all platforms are viewable
        setPlatform(platformData);
        setError(null); 

        if (platformData.defaultLayoutId) {
          const layoutDocRef = doc(db, 'platforms', platformId, 'layouts', platformData.defaultLayoutId);
          const unsubscribeLayout = onSnapshot(layoutDocRef, (layoutSnap) => {
            if (layoutSnap.exists()) {
              setLayout({ id: layoutSnap.id, ...layoutSnap.data() } as PlatformLayout);
            } else {
              setError(`Default layout "${platformData.defaultLayoutId}" not found for this platform.`);
              setLayout(null);
              setComponentInstances([]);
              setIsLoading(false); 
            }
          }, (err) => {
            console.error("Error fetching platform layout:", err);
            setError("Failed to load platform layout.");
            setLayout(null);
            setComponentInstances([]);
            setIsLoading(false);
          });
          return () => unsubscribeLayout();
        } else {
          setError("No default layout specified for this platform.");
          setLayout(null);
          setComponentInstances([]);
          setIsLoading(false);
        }
      } else {
        setError("Platform not found.");
        setPlatform(null);
        setLayout(null);
        setComponentInstances([]);
        setIsLoading(false);
      }
    }, (err) => {
      console.error("Error fetching platform data:", err);
      setError("Failed to load platform data.");
      setPlatform(null);
      setLayout(null);
      setComponentInstances([]);
      setIsLoading(false);
    });

    return () => unsubscribePlatform();
  }, [platformId]);


  useEffect(() => {
    if (!layout || !platformId) {
      setComponentInstances([]);
      return;
    }
    
    const instancesQuery = query(
      collection(db, 'platforms', platformId, 'components'),
      where('layoutId', '==', layout.id),
      orderBy('order', 'asc')
    );

    const unsubscribeInstances = onSnapshot(instancesQuery, (querySnapshot) => {
      const instances: PlatformComponentInstance[] = [];
      querySnapshot.forEach((doc) => {
        instances.push({ id: doc.id, ...doc.data() } as PlatformComponentInstance);
      });
      setComponentInstances(instances);
      setIsLoading(false); 
    }, (err) => {
      console.error("Error fetching component instances:", err);
      setError("Failed to load platform components.");
      setComponentInstances([]);
      setIsLoading(false);
    });

    return () => unsubscribeInstances();
  }, [layout, platformId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-muted-foreground">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p>Loading platform...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-2xl mx-auto mt-10 border-destructive bg-destructive/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <ShieldAlert className="h-6 w-6" />
            Platform Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!platform) {
     return (
      <Card className="max-w-2xl mx-auto mt-10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
             <AlertTriangle className="h-6 w-6 text-muted-foreground" />
            Platform Unavailable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">The requested platform could not be loaded or is not available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="platform-render-area space-y-4">
      <header className="mb-6 pb-4 border-b">
        <h1 className="text-3xl font-bold">{platform.name}</h1>
        {platform.description && <p className="text-muted-foreground">{platform.description}</p>}
      </header>
      
      {componentInstances.length === 0 && layout && (
        <p className="text-center text-muted-foreground py-10">This platform layout ("{layout.name}") currently has no components.</p>
      )}

      {componentInstances.map((instance) => {
        const ComponentToRender = getRenderableComponent(instance.type);
        return <ComponentToRender key={instance.id} instance={instance} />;
      })}
    </div>
  );
}
