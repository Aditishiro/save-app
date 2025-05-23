
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Package } from 'lucide-react'; // Changed from PackagePlus
import CreateGlobalComponentClient from './components/create-global-component-client';
import GlobalComponentsListClient from './components/global-components-list-client'; // New import

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
            <Package className="h-6 w-6 text-primary" /> {/* Changed icon */}
            Component Library
          </CardTitle>
          <CardDescription>
            Browse existing global components or create new ones.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GlobalComponentsListClient /> {/* Use the new client component */}
        </CardContent>
      </Card>
    </>
  );
}
