
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackagePlus } from 'lucide-react';
import CreateGlobalComponentClient from './components/create-global-component-client';

export default function GlobalComponentsPage() {
  return (
    <>
      <PageHeader
        title="Global UI Components"
        description="Manage and define reusable UI components for platform building."
        actions={<CreateGlobalComponentClient />}
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PackagePlus className="h-6 w-6 text-primary" />
            Component Library
          </CardTitle>
          <CardDescription>
            Browse existing global components or create new ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* TODO: Implement listing of existing global components here */}
          <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-lg">
            <PackagePlus className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground">Component Listing Coming Soon</h3>
            <p className="text-muted-foreground">Use the "Create New Global Component" button to add components.</p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
