
'use client';

import type { PlatformComponentInstance } from '@/platform-builder/data-models';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MaterialCardRendererProps {
  instance: PlatformComponentInstance;
}

export default function MaterialCardRenderer({ instance }: MaterialCardRendererProps) {
  const { configuredValues } = instance;

  const title = configuredValues?.title;
  const subtitle = configuredValues?.subtitle;
  const contentPadding = configuredValues?.contentPadding || '1rem';
  const primaryActionText = configuredValues?.primaryActionText;
  const primaryActionLink = configuredValues?.primaryActionLink;
  const isOutlined = configuredValues?.outlined === true;

  const cardStyle = {
    border: isOutlined ? '1px solid hsl(var(--border))' : 'none',
    boxShadow: isOutlined ? 'none' : `0 ${configuredValues?.elevation || 1}px ${((configuredValues?.elevation || 1) * 2) + 1}px rgba(0,0,0,0.1)`,
  };

  const handleActionClick = () => {
    if (primaryActionLink) {
        alert(`Action Triggered: ${primaryActionLink}`);
    }
  }

  return (
    <Card style={cardStyle}>
        {(title || subtitle) && (
            <CardHeader>
                {title && <CardTitle>{title}</CardTitle>}
                {subtitle && <CardDescription>{subtitle}</CardDescription>}
            </CardHeader>
        )}
      <CardContent style={{ padding: contentPadding }}>
        <div className="card-content-area text-sm text-muted-foreground">
          (Content for this card would be added here in the editor)
        </div>
      </CardContent>
      {primaryActionText && (
          <CardFooter>
            <Button onClick={handleActionClick}>{primaryActionText}</Button>
          </CardFooter>
      )}
    </Card>
  );
}
