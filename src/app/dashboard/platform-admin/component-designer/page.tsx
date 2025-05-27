
import { PageHeader } from '@/components/common/page-header';
import DesignerClient from './components/designer-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Shapes } from 'lucide-react';

export default function ComponentDesignerPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Component Visual Designer"
        description="Visually design and configure new global UI components. (Conceptual - Under Development)"
      />
      <Card className="flex-1 flex flex-col shadow-lg min-h-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shapes className="h-6 w-6 text-primary" />
            Visual Designer Canvas
          </CardTitle>
          <CardDescription>
            Drag components from the palette, configure them, and define variants.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex min-h-0">
          <DesignerClient />
        </CardContent>
      </Card>
    </div>
  );
}
