import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Edit3, Eye, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge'; // Assuming Badge component uses theme colors

// Mock data for forms - replace with actual data fetching
const forms = [
  { id: '1', name: 'New Client Onboarding', status: 'Published', lastModified: '2023-10-26', submissions: 120 },
  { id: '2', name: 'Loan Application Form - V2', status: 'Draft', lastModified: '2023-11-05', submissions: 0 },
  { id: '3', name: 'Customer Feedback Survey', status: 'Pending Review', lastModified: '2023-11-10', submissions: 45 },
];

export default function MyFormsPage() {
  return (
    <>
      <PageHeader
        title="My Forms"
        description="Create, manage, and publish your data collection forms."
        actions={
          <Button asChild>
            <Link href="/dashboard/my-forms/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
            </Link>
          </Button>
        }
      />

      {forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No forms created yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Get started by creating your first form.
          </p>
          <Button asChild>
            <Link href="/dashboard/my-forms/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <Card key={form.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{form.name}</CardTitle>
                <CardDescription>
                  Status:{" "}
                  <Badge 
                    variant={
                      form.status === 'Published' ? 'default' : // Assuming default uses success-like colors or primary
                      form.status === 'Draft' ? 'secondary' :    // Or a specific 'warning' variant if available
                      'outline' // For 'Pending Review' or other statuses
                    }
                    className={
                      form.status === 'Published' ? 'bg-success text-success-foreground' :
                      form.status === 'Draft' ? 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50' : // Using a direct yellow for draft for now
                      'text-blue-600 border-blue-300' // Example for Pending review
                    }
                  >
                    {form.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Last Modified: {form.lastModified}</p>
                <p className="text-sm text-muted-foreground">Submissions: {form.submissions}</p>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex w-full justify-between items-center">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/my-forms/${form.id}/edit`}>
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Link>
                  </Button>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" aria-label="Preview" asChild>
                      <Link href={`/dashboard/my-forms/${form.id}/preview`}>
                        <Eye className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
