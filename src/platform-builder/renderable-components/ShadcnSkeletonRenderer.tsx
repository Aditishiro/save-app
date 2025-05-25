
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Skeleton } from "@/components/ui/skeleton";

interface ShadcnSkeletonRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnSkeletonRenderer({ instance }: ShadcnSkeletonRendererProps) {
  const { configuredValues } = instance;

  const width = configuredValues?.width || '100px';
  const height = configuredValues?.height || '20px';
  const borderRadius = configuredValues?.borderRadius || '4px'; // Or use theme default

  return (
    <Skeleton style={{ width, height, borderRadius }} />
  );
}
