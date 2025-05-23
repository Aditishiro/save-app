
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, Edit3, Eye, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, Timestamp, orderBy } from 'firebase/firestore';
import { FormFieldData } from '@/components/form-builder/form-field-display';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

export interface FormDocument {
  id: string;
  ownerId: string;
  title: string;
  description?: string;
  intendedUseCase: string;
  formConfiguration: string; // JSON string
  status: 'Draft' | 'Published' | 'Archived';
  submissionsCount: number;
  createdAt: Timestamp;
  lastModified: Timestamp;
  isPublic?: boolean;
  tags?: string[];
}

export default function MyFormsPage() {
  const { currentUser } = useAuth();
  const [forms, setForms] = useState<FormDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      const formsCollectionRef = collection(db, 'forms');
      const q = query(formsCollectionRef, where('ownerId', '==', currentUser.uid), orderBy('lastModified', 'desc'));

      getDocs(q)
        .then((querySnapshot) => {
          const fetchedForms = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as FormDocument));
          setForms(fetchedForms);
        })
        .catch((err) => {
          console.error("Error fetching forms: ", err);
          setError("Failed to fetch forms. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // Not logged in, or currentUser is not yet available
      setForms([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleDeleteForm = async (formId: string) => {
    try {
      await deleteDoc(doc(db, 'forms', formId));
      setForms(prevForms => prevForms.filter(form => form.id !== formId));
      toast({
        title: "Form Deleted",
        description: "The form has been successfully deleted.",
      });
    } catch (err) {
      console.error("Error deleting form: ", err);
      toast({
        title: "Error Deleting Form",
        description: "Could not delete the form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return timestamp.toDate().toLocaleDateString();
  };

  if (isLoading) {
    return (
      <>
        <PageHeader
          title="My Forms"
          description="Create, manage, and publish your data collection forms."
          actions={
            <Button asChild disabled>
              <Link href="/dashboard/my-forms/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Form
              </Link>
            </Button>
          }
        />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading your forms...</span>
        </div>
      </>
    );
  }

  if (error) {
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
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">{error}</h3>
          <p className="mb-4 mt-2 text-sm text-destructive/80">
            Please check your connection or try refreshing the page.
          </p>
        </div>
      </>
    )
  }

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
            <Card key={form.id} className="flex flex-col shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">{form.title}</CardTitle>
                <CardDescription>
                  Status:{" "}
                  <Badge
                    variant={
                      form.status === 'Published' ? 'default' :
                      form.status === 'Draft' ? 'secondary' :
                      form.status === 'Archived' ? 'outline' :
                      'outline'
                    }
                    className={
                      form.status === 'Published' ? 'bg-success text-success-foreground' :
                      form.status === 'Draft' ? 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50' :
                      form.status === 'Archived' ? 'border-dashed text-muted-foreground' :
                      ''
                    }
                  >
                    {form.status}
                  </Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground">Last Modified: {formatDate(form.lastModified)}</p>
                <p className="text-sm text-muted-foreground">Submissions: {form.submissionsCount}</p>
                {form.intendedUseCase && <p className="text-xs text-muted-foreground mt-1 truncate" title={form.intendedUseCase}>Use Case: {form.intendedUseCase}</p>}
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Delete">
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the form "{form.title}" and all its associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteForm(form.id)} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
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
