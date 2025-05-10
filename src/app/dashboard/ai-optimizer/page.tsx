import { PageHeader } from '@/components/common/page-header';
import OptimizerClient from './components/optimizer-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function AiOptimizerPage() {
  return (
    <>
      <PageHeader
        title="AI Form Optimizer"
        description="Leverage AI to get suggestions for improving your form configurations."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Optimize Your Form
          </CardTitle>
          <CardDescription>
            Provide your form's JSON configuration and its intended use case. Our AI will analyze it and suggest improvements for better performance and user experience.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OptimizerClient />
        </CardContent>
      </Card>
    </>
  );
}
