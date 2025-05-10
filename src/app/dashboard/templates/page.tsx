import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent } from '@/components/ui/card';
import { Layers } from 'lucide-react';

export default function TemplatesPage() {
  return (
    <>
      <PageHeader
        title="Form Templates"
        description="Browse and use pre-built templates to kickstart your form creation."
      />
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <Layers className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Template Library Coming Soon</h3>
            <p className="text-muted-foreground">Check back later for a selection of ready-to-use form templates.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
