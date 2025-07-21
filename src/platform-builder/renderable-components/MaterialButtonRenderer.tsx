
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Button, type ButtonProps } from '@/components/ui/button';
import * as Lucide from 'lucide-react';

interface MaterialButtonRendererProps {
  instance: PlatformComponentInstance;
}

// A simple function to get a Lucide icon by name, with a fallback.
const getIcon = (name?: string): React.ComponentType<{className?: string}> | null => {
    if (!name) return null;
    const iconName = name.charAt(0).toUpperCase() + name.slice(1);
    const IconComponent = (Lucide as any)[iconName];
    return IconComponent || null;
}


export default function MaterialButtonRenderer({ instance }: MaterialButtonRendererProps) {
  const { configuredValues } = instance;

  const label = configuredValues?.label || 'Button';
  const isDisabled = configuredValues?.disabled === true;
  const action = configuredValues?.onClickAction;
  const startIconName = configuredValues?.startIcon;
  
  // Map Material variants to Shadcn variants
  const getVariant = (): ButtonProps['variant'] => {
      switch (configuredValues?.variant) {
          case 'contained':
              return 'default';
          case 'outlined':
              return 'outline';
          case 'text':
              return 'ghost';
          default:
              return 'default';
      }
  }

  const StartIcon = getIcon(startIconName);

  const handleClick = () => {
    if (action) {
      alert(`Action Triggered: ${action}`);
    } else {
      alert('Button clicked');
    }
  };

  return (
    <Button
      variant={getVariant()}
      disabled={isDisabled}
      onClick={handleClick}
    >
      {StartIcon && <StartIcon className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
