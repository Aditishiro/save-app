import { PageHeader } from '@/components/common/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Filter, Search } from 'lucide-react';

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
          <Input type="search" placeholder="Search submissions..." className="pl-8" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="needs-review">Needs Review</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="w-full sm:w-auto">
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
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    submission.status === 'Complete' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                    submission.status === 'Needs Review' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  }`}>
                    {submission.status}
                  </span>
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
