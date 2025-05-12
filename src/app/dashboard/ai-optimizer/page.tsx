import { PageHeader } from '@/components/common/page-header';
import OptimizerClient from './components/optimizer-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot } from 'lucide-react';

export default function AiOptimizerPage() {
  return (
    <>
      <PageHeader
        title="AI Form Optimizer"
        description="Leverage AI to get suggestions for improving your form configurations, including potential redesigns."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" />
            Optimize Your Form
          </CardTitle>
          <CardDescription>
            Provide your form's JSON, intended use case (including any complex problems or future needs), and optionally a research document. Our AI will analyze it, suggest improvements, and even propose redesigns to address future challenges.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OptimizerClient />
        </CardContent>
      </Card>
    </>
  );
}
