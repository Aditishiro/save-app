import { PageHeader } from '@/components/common/page-header';
import AnalyticsClient from './components/analytics-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain } from 'lucide-react';

export default function FormAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Form Analytics & Insights"
        description="Analyze existing forms, identify pain points, and generate AI-powered reports for improvements and future state planning."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Form Analysis Dashboard
          </CardTitle>
          <CardDescription>
            Select a form to view its analysis, generate reports, and explore AI-driven insights for optimization and strategic enhancements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnalyticsClient />
        </CardContent>
      </Card>
    </>
  );
}
