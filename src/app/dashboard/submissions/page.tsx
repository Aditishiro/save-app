
'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Status filter removed for now
import { Download, Search, Eye, Loader2, AlertTriangle } from 'lucide-react';
// import { Badge } from '@/components/ui/badge'; // Not used currently
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  // DialogTrigger, // Not used directly here
} from "@/components/ui/dialog";

interface SubmissionData {
  id: string;
  formId: string;
  formTitle: string;
  submitterId: string; // 'anonymous' or UID
  submissionDate: Timestamp;
  data: Record<string, any>; // The actual form field values
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
  // const [filterStatus, setFilterStatus] = useState('all'); // Status filter removed for now

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      setError(null);
      // Fetch submissions.
      // TODO: Implement robust fetching based on user's forms.
      // This currently fetches all recent submissions for demo purposes.
      // A scalable solution would involve querying forms owned by the user, then submissions for those forms,
      // or denormalizing formOwnerId onto submission documents.
      const submissionsCollectionRef = collection(db, 'submissions');
      const q = query(submissionsCollectionRef, orderBy('submissionDate', 'desc'), limit(50));

      getDocs(q)
        .then((querySnapshot) => {
          const fetchedSubmissions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as SubmissionData));
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

  const formatDate = (timestamp: Timestamp | undefined | null) => {
    if (!timestamp || typeof timestamp.toDate !== 'function') return 'N/A';
    try {
      return new Date(timestamp.toDate()).toLocaleString();
    } catch (e) {
      // Fallback for older Timestamp-like objects that might not have toDate()
      if (timestamp.seconds) {
         return new Date(timestamp.seconds * 1000 + (timestamp.nanoseconds || 0) / 1000000).toLocaleString();
      }
      return 'Invalid Date';
    }
  };
  
  // Client-side filtering
  const filteredSubmissions = submissions.filter(sub => {
    if (!sub) return false;
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    // Check basic fields
    const matchesBasicFields = 
        sub.formTitle?.toLowerCase().includes(lowerSearchTerm) ||
        sub.id?.toLowerCase().includes(lowerSearchTerm) ||
        (typeof sub.submitterId === 'string' && sub.submitterId.toLowerCase().includes(lowerSearchTerm));

    if (matchesBasicFields) return true;

    // Check data object values
    if (sub.data && typeof sub.data === 'object') {
      return Object.values(sub.data).some(val => 
        String(val).toLowerCase().includes(lowerSearchTerm)
      );
    }
    return false;
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
            placeholder="Search by ID, form title, submitter, or content..." 
            className="pl-8 rounded-md w-full" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Form Title</TableHead>
              <TableHead>Submitter ID</TableHead>
              <TableHead>Date</TableHead>
              {/* <TableHead>Status</TableHead> */} {/* Status column removed for now */}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSubmissions.length > 0 ? filteredSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium truncate max-w-[150px]" title={submission.id}>{submission.id}</TableCell>
                <TableCell className="truncate max-w-[200px]" title={submission.formTitle}>{submission.formTitle || 'N/A'}</TableCell>
                <TableCell className="truncate max-w-[150px]" title={submission.submitterId}>
                  {submission.submitterId === currentUser?.uid ? "You" : (submission.submitterId || 'anonymous')}
                </TableCell>
                <TableCell>{formatDate(submission.submissionDate)}</TableCell>
                {/* <TableCell>
                  <Badge variant={submission.status === 'Reviewed' ? 'secondary' : submission.status === 'Actioned' ? 'outline' : 'default'}>
                    {submission.status || 'New'}
                  </Badge>
                </TableCell> */}
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleViewSubmission(submission)}>
                    <Eye className="mr-2 h-4 w-4"/> View
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center"> {/* Adjusted colSpan */}
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
                Form: {selectedSubmission.formTitle || 'N/A'} | Submitted: {formatDate(selectedSubmission.submissionDate)}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-3 pr-2">
              {selectedSubmission.data && Object.entries(selectedSubmission.data).map(([key, value]) => (
                  <div key={key} className="grid grid-cols-3 gap-2 items-start py-1 border-b border-border last:border-b-0">
                    <span className="font-medium text-sm text-muted-foreground col-span-1 capitalize break-words">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                    <span className="text-sm col-span-2 break-words">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                         typeof value === 'object' && value !== null ? JSON.stringify(value) :
                         String(value) || <span className="italic text-muted-foreground/70">Not provided</span>}
                    </span>
                  </div>
                ))}
              {!selectedSubmission.data || Object.keys(selectedSubmission.data).length === 0 && (
                <p className="text-sm text-muted-foreground">No data submitted or data is empty.</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
