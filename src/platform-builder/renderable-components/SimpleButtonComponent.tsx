
'use client';

import type { PlatformComponentInstance, GlobalComponentDefinition } from '@/platform-builder/data-models';
import { Button } from '@/components/ui/button';

interface SimpleButtonComponentProps {
  instance: PlatformComponentInstance;
  definition: GlobalComponentDefinition;
}

export default function SimpleButtonComponent({ instance, definition }: SimpleButtonComponentProps) {
  const { configuredValues } = instance;
  const label = configuredValues?.label || definition?.configurablePropertiesSchema?.label?.defaultValue || 'Click Me';
  const variant = configuredValues?.variant || definition?.configurablePropertiesSchema?.variant?.defaultValue || 'default';
  const action = configuredValues?.onClickAction || definition?.configurablePropertiesSchema?.onClickAction?.defaultValue;

  const handleClick = () => {
    if (action) {
      if (typeof action === 'string' && action.startsWith('http')) {
        window.open(action, '_blank');
      } else if (typeof action === 'string') {
        // For now, just log non-URL string actions.
        // In a real scenario, this could trigger a custom event, navigate, or call a function.
        console.log(`Button clicked, action: ${action}`);
        alert(`Button Action (dev): ${action}`);
      } else {
        console.log('Button clicked, no specific string action defined.', action);
        alert('Button clicked!');
      }
    } else {
      console.log('Button clicked, no action defined.');
      alert('Button clicked!');
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      variant={variant as any} 
      // Add other configurable props like size, color based on definition
    >
      {label}
    </Button>
  );
}
