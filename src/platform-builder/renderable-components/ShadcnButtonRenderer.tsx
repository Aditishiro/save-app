
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Button, type ButtonProps } from '@/components/ui/button'; // Ensure ButtonProps is exported from your button component

interface ShadcnButtonRendererProps {
  instance: PlatformComponentInstance;
}

export default function ShadcnButtonRenderer({ instance }: ShadcnButtonRendererProps) {
  const { configuredValues } = instance;

  const label = configuredValues?.label || 'Button';
  const variant = configuredValues?.variant as ButtonProps['variant'] || 'default';
  const size = configuredValues?.size as ButtonProps['size'] || 'default';
  const action = configuredValues?.onClickAction;

  const handleClick = () => {
    if (action) {
      if (typeof action === 'string' && (action.startsWith('http://') || action.startsWith('https://'))) {
        window.open(action, '_blank');
      } else if (typeof action === 'string') {
        console.log(`Button action triggered: ${action}`);
        // In a real app, you might use a global event bus or context to dispatch actions
        alert(`Action: ${action}`);
      } else {
        console.log('Button clicked, but action format is unrecognized or not a string.', action);
      }
    } else {
      console.log('Button clicked, no action configured.');
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
    >
      {label}
    </Button>
  );
}
