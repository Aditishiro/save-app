
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ShadcnCardRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnCardRenderer({ instance }: ShadcnCardRendererProps) {
  const { configuredValues } = instance;

  const title = configuredValues?.title;
  const description = configuredValues?.description;
  const content = configuredValues?.content || 'Card content goes here.';
  const footer = configuredValues?.footer;

  return (
    <Card>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>
        {/* If content can be HTML, use dangerouslySetInnerHTML carefully */}
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </CardContent>
      {footer && (
        <CardFooter>
          <p>{footer}</p>
        </CardFooter>
      )}
    </Card>
  );
}
