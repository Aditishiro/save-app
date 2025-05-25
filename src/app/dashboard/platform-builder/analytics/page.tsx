
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Construction } from 'lucide-react';
import PlatformAnalyticsClient from './components/analytics-client';

export default function PlatformAnalyticsPage() {
  return (
    <>
      <PageHeader
        title="Platform Analytics & Insights"
        description="Analyze platform structures, identify potential issues, and generate AI-powered reports for improvements and future state planning."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-primary" />
            Platform Analysis Dashboard
          </CardTitle>
          <CardDescription>
            Select a platform to view its structural analysis, generate reports, and explore AI-driven insights for optimization. (Feature Under Development)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlatformAnalyticsClient />
        </CardContent>
      </Card>
    </>
  );
}
