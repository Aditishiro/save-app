
'use client';

import type { PlatformComponentInstance, GlobalComponentDefinition } from '@/platform-builder/data-models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface PlaceholderComponentProps {
  instance: PlatformComponentInstance;
  definition?: GlobalComponentDefinition; // Definition might not be found
}

export default function PlaceholderComponent({ instance, definition }: PlaceholderComponentProps) {
  return (
    <Card className="border-dashed border-destructive/50 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Placeholder: {definition?.displayName || instance.type || instance.definitionId}
        </CardTitle>
        <CardDescription className="text-xs text-destructive/80">
          Instance ID: {instance.id} | Definition ID: {instance.definitionId}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs">
        <p>This component type (<strong>{instance.type}</strong>) is not fully rendered or its definition was not found.</p>
        <p className="mt-1 font-medium">Configured Values:</p>
        <pre className="mt-1 p-2 bg-destructive/10 rounded-md text-xs overflow-auto max-h-32">
          {JSON.stringify(instance.configuredValues, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
}
