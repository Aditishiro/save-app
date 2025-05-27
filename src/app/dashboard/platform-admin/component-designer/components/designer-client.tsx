
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Brush, LayoutDashboard, Settings2, PlusCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase/firebase';
import { collection, query, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import type { GlobalComponentDefinition } from '@/platform-builder/data-models';
import { useToast } from '@/hooks/use-toast';


export default function DesignerClient() {
  const [globalComponents, setGlobalComponents] = useState<GlobalComponentDefinition[]>([]);
  const [isLoadingPalette, setIsLoadingPalette] = useState(true);
  const [errorPalette, setErrorPalette] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingPalette(true);
    setErrorPalette(null);
    const componentsColRef = collection(db, 'components');
    const q = query(componentsColRef, orderBy('displayName', 'asc'));

    getDocs(q)
      .then((snapshot) => {
        const fetchedComponents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as GlobalComponentDefinition));
        setGlobalComponents(fetchedComponents);
      })
      .catch((err) => {
        console.error("Error fetching global components for palette:", err);
        setErrorPalette("Failed to load component palette.");
        toast({ title: "Error", description: "Could not load global components.", variant: "destructive" });
      })
      .finally(() => {
        setIsLoadingPalette(false);
      });
  }, [toast]);

  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-4 overflow-hidden">
      {/* Left Panel: Component Palette */}
      <div className="md:col-span-3 flex flex-col gap-4 min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="shrink-0">
            <CardTitle className="text-base flex items-center gap-1">
              <Brush className="h-4 w-4 text-primary" /> Base Components
            </CardTitle>
            <CardDescription className="text-xs">Drag to canvas or select to use as a base.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="space-y-2 py-2">
              {isLoadingPalette && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground mx-auto my-4" />}
              {errorPalette && <p className="text-xs text-destructive p-2">{errorPalette}</p>}
              {!isLoadingPalette && globalComponents.length === 0 && !errorPalette && (
                <p className="text-xs text-muted-foreground p-2 text-center">No global components found.</p>
              )}
              {globalComponents.map(comp => (
                <Button
                  key={comp.id}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs h-8"
                  // onClick={() => {/* TODO: Handle component selection or drag start */}}
                  disabled // Disabled for placeholder
                >
                  {comp.iconUrl ? <img src={comp.iconUrl} alt="" className="h-3 w-3 mr-2" data-ai-hint="component icon"/> : <LayoutDashboard className="h-3 w-3 mr-2"/>}
                  {comp.displayName}
                </Button>
              ))}
            </CardContent>
          </ScrollArea>
        </Card>
      </div>

      {/* Center Panel: Canvas */}
      <div className="md:col-span-6 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col border-2 border-dashed min-h-0 items-center justify-center bg-muted/20">
           <CardHeader className="text-center">
            <CardTitle className="text-lg">Visual Design Canvas</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <LayoutDashboard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Future: Drag components here to design visually.
            </p>
            <Alert variant="default" className="mt-6 text-left bg-background/50">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Feature Under Development</AlertTitle>
              <AlertDescription className="text-xs">
                The visual component designer with real-time editing (resize, text input, variants) is a complex feature planned for the future. This area is a placeholder.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>

      {/* Right Panel: Properties & Variants */}
      <div className="md:col-span-3 flex flex-col min-h-0">
        <Card className="flex-1 flex flex-col min-h-0">
          <CardHeader className="shrink-0">
            <CardTitle className="text-base flex items-center gap-1">
              <Settings2 className="h-4 w-4 text-primary" /> Properties & Variants
            </CardTitle>
            <CardDescription className="text-xs">Configure the selected component and manage its variants.</CardDescription>
          </CardHeader>
          <ScrollArea className="flex-1">
            <CardContent className="py-2">
              <p className="text-xs text-muted-foreground text-center py-10">
                Select a component on the canvas to edit its properties and variants (Future Feature).
              </p>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    </div>
  );
}
