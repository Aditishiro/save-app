import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge'; // Using Badge component

const mockSubmissions = [
  { id: 'sub001', formName: 'New Client Onboarding', submitter: 'Alice Johnson', date: '2023-11-15', status: 'Complete' },
  { id: 'sub002', formName: 'Loan Application Form - V2', submitter: 'Bob Williams', date: '2023-11-14', status: 'Needs Review' },
  { id: 'sub003', formName: 'Customer Feedback Survey', submitter: 'Carol Davis', date: '2023-11-13', status: 'Incomplete' },
  { id: 'sub004', formName: 'New Client Onboarding', submitter: 'David Brown', date: '2023-11-12', status: 'Complete' },
];

export default function SubmissionsPage() {
  return (
    <>
      <PageHeader
        title="Form Submissions"
        description="View and manage data collected through your forms."
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export All (CSV)
          </Button>
        }
      />
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search submissions..." className="pl-8 rounded-md" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px] rounded-md">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="needs-review">Needs Review</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full sm:w-auto rounded-md">
            <Filter className="mr-2 h-4 w-4" /> Apply Filters
        </Button>
      </div>

      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Form Name</TableHead>
              <TableHead>Submitter</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.id}</TableCell>
                <TableCell>{submission.formName}</TableCell>
                <TableCell>{submission.submitter}</TableCell>
                <TableCell>{submission.date}</TableCell>
                <TableCell>
                  <Badge 
                    variant={
                      submission.status === 'Complete' ? 'default' :
                      submission.status === 'Needs Review' ? 'secondary' :
                      'destructive'
                    }
                    className={
                      submission.status === 'Complete' ? 'bg-success text-success-foreground' :
                      submission.status === 'Needs Review' ? 'bg-yellow-500 text-white dark:bg-yellow-600 dark:text-yellow-50' : // Or use a theme color if available
                      'bg-destructive text-destructive-foreground' // 'Incomplete' mapped to destructive for now
                    }
                  >
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
             {mockSubmissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
