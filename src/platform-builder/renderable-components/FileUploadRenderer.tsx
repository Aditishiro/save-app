
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud } from 'lucide-react';

interface FileUploadRendererProps {
  instance: PlatformComponentInstance;
}

export default function FileUploadRenderer({ instance }: FileUploadRendererProps) {
  const { configuredValues, id } = instance;

  const buttonLabel = configuredValues?.buttonLabel || 'Upload File';
  const description = configuredValues?.description;
  const inputId = `file-upload-${id}`;

  return (
    <div className="flex flex-col items-start gap-3">
        {description && <Label htmlFor={inputId} className="text-sm text-muted-foreground">{description}</Label>}
        <div className="flex items-center gap-2">
            <Input id={inputId} type="file" className="w-auto" />
            <Button>
                <UploadCloud className="mr-2 h-4 w-4" />
                {buttonLabel}
            </Button>
        </div>
    </div>
  );
}
