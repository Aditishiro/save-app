
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from 'react';

interface ShadcnProgressRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnProgressRenderer({ instance }: ShadcnProgressRendererProps) {
  const { configuredValues } = instance;
  
  const initialValue = typeof configuredValues?.value === 'number' ? configuredValues.value : 50;
  const [progress, setProgress] = useState(initialValue);

  useEffect(() => {
    // Simulate progress for demo if no dynamic value source
    if (configuredValues?.value === undefined) {
      const timer = setTimeout(() => setProgress(Math.min(100, initialValue + 10)), 800);
      return () => clearTimeout(timer);
    } else {
      setProgress(typeof configuredValues?.value === 'number' ? configuredValues.value : 50);
    }
  }, [progress, configuredValues?.value, initialValue]);


  return <Progress value={progress} className="w-[60%]" />;
}
