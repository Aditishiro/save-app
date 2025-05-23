
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter, Search, Eye, Loader2, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SubmissionData {
  id: string;
  formId: string;
  formTitle: string;
  submitterId: string; // 'anonymous' or UID
  submissionDate: Timestamp;
  data: Record<string, any>; // The actual form field values
  // Potentially add a status field here too if submissions can be reviewed/actioned
  status?: 'New' | 'Reviewed' | 'Actioned'; 
}


export default function SubmissionsPage() {
  const { currentUser } = useAuth();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionData | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // Example filter, not fully implemented with Firestore yet

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      // Fetch submissions for forms owned by the current user.
      // This requires a more complex query if forms are not directly linked to submitter.
      // For now, let's fetch all submissions and filter client-side or assume a 'submitterId' field.
      // A better approach for scalability: query forms owned by user, then for each form, query submissions.
      // Or, if submissions have ownerId of the form, query by that.

      // Simplified: Fetching all submissions for demo purposes.
      // In a real app, you'd want to only fetch submissions for forms the current user OWNS.
      // This might involve:
      // 1. Fetching all form IDs owned by the user.
      // 2. Then making multiple queries for submissions for each formId, or using an 'in' query if formIds < 30.
      // Or, denormalize formOwnerId onto each submission document.

      const submissionsCollectionRef = collection(db, 'submissions');
      // For now, just fetch recent submissions for any user, as an example.
      // TODO: Implement robust fetching based on user's forms
      const q = query(submissionsCollectionRef, orderBy('submissionDate', 'desc'), limit(50));


      getDocs(q)
        .then((querySnapshot) => {
          const fetchedSubmissions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as SubmissionData));
          // If you need to filter by forms currentUser owns, do it here after fetching,
          // or ideally, structure data/queries to allow this server-side.
          setSubmissions(fetchedSubmissions);
        })
        .catch((err) => {
          console.error("Error fetching submissions: ", err);
          setError("Failed to fetch submissions. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setSubmissions([]);
      setIsLoading(false);
    }
  }, [currentUser]);

  const handleViewSubmission = (submission: SubmissionData) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  const formatDate = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000).toLocaleString();
  };
  
  // Basic client-side filtering for demo
  const filteredSubmissions = submissions.filter(sub => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearch = 
        sub.formTitle?.toLowerCase().includes(lowerSearchTerm) ||
        sub.id.toLowerCase().includes(lowerSearchTerm) ||
        (typeof sub.submitterId === 'string' && sub.submitterId.toLowerCase().includes(lowerSearchTerm)) ||
        Object.values(sub.data).some(val => String(val).toLowerCase().includes(lowerSearchTerm));

    const matchesStatus = filterStatus === 'all' || (sub.status && sub.status.toLowerCase() === filterStatus);
    
    return matchesSearch ; // && matchesStatus (add status filter later)
  });


  if (isLoading) {
    return (
      <>
        <PageHeader title="Form Submissions" description="View and manage data collected through your forms." />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading submissions...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
       <>
        <PageHeader title="Form Submissions" description="View and manage data collected through your forms." />
        <div className="flex flex-col items-center justify-center rounded-lg border border-destructive bg-destructive/10 p-12 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h3 className="mt-4 text-xl font-semibold text-destructive">{error}</h3>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Form Submissions"
        description="View and manage data collected through your forms."
        actions={
          <Button variant="outline" disabled> {/* Implement export later */}
            <Download className="mr-2 h-4 w-4" /> Export All (CSV)
          </Button>
        }
      />
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search submissions by ID, form title, submitter, or content..." 
            className="pl-8 rounded-md w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {/* Example status filter - not fully implemented against Firestore
        <Select defaultValue="all" onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-[180px] rounded-md">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="New">New</SelectItem>
            <SelectItem value="Reviewed">Reviewed</SelectItem>
            <SelectItem value="Actioned">Actioned</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full sm:w-auto rounded-md" disabled>
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
        */}
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Form Title</TableHead>
              <TableHead>Submitter ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length > 0 ? filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium truncate max-w-[150px]" title={submission.id}>{submission.id}</TableCell>
                <TableCell className="truncate max-w-[200px]" title={submission.formTitle}>{submission.formTitle}</TableCell>
                <TableCell className="truncate max-w-[150px]" title={submission.submitterId}>{submission.submitterId === currentUser?.uid ? "You" : submission.submitterId}</TableCell>
                <TableCell>{formatDate(submission.submissionDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)}>
                    <Eye className="mr-2 h-4 w-4"/> View
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No submissions found matching your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedSubmission && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Submission Details: {selectedSubmission.id}</DialogTitle>
              <DialogDescription>
                Form: {selectedSubmission.formTitle} | Submitted: {formatDate(selectedSubmission.submissionDate)}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-2">
              {Object.entries(selectedSubmission.data).map(([key, value]) => {
                const fieldLabel = formConfigForSubmission(selectedSubmission.formId)?.fields.find(f => f.id === key)?.label || key;
                return (
                  <div key={key} className="grid grid-cols-3 gap-2 items-start">
                    <span className="font-medium text-sm text-muted-foreground col-span-1 capitalize">{fieldLabel}:</span>
                    <span className="text-sm col-span-2 break-words">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value) || <span className="italic text-muted-foreground/70">Not provided</span>}
                    </span>
                  </div>
                );
              })}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Helper function to potentially get form config for labels - this is inefficient.
// Ideally, field labels would be stored with submission or fetched once.
// This is a placeholder and should be optimized in a real app.
let formConfigsCache: Record<string, { fields: FormFieldData[] } | null> = {};
const formConfigForSubmission = (formId: string): { fields: FormFieldData[] } | null => {
  // This is a very basic cache. In a real app, use a more robust caching strategy
  // or fetch this information differently.
  // For this demo, it will try to use a mock or previously fetched config.
  // This part is NOT robust for production.
  if (formConfigsCache[formId]) return formConfigsCache[formId];

  // Try to find in mock-form-data if we used it (illustrative, not a good pattern for prod)
  // This is a hacky example:
  // const mockForm = (MOCK_FORM_STORE_ANALYTICS as any)[formId];
  // if (mockForm && mockForm.formConfiguration) {
  //   try {
  //     const parsed = JSON.parse(mockForm.formConfiguration);
  //     formConfigsCache[formId] = parsed;
  //     return parsed;
  //   } catch { /* ignore */ }
  // }
  return null; // Should ideally fetch form config if not available
};

