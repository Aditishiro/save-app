
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ShadcnAvatarRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnAvatarRenderer({ instance }: ShadcnAvatarRendererProps) {
  const { configuredValues } = instance;

  const src = configuredValues?.src || 'https://placehold.co/40x40.png';
  const alt = configuredValues?.alt || 'User Avatar';
  const fallbackText = configuredValues?.fallbackText || 'U';

  return (
    <Avatar>
      <AvatarImage src={src} alt={alt} data-ai-hint="user avatar" />
      <AvatarFallback>{fallbackText}</AvatarFallback>
    </Avatar>
  );
}
