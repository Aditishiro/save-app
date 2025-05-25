
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Construction } from 'lucide-react';
import PlatformOptimizerClient from './components/optimizer-client';

export default function AiPlatformOptimizerPage() {
  return (
    <>
      <PageHeader
        title="AI Platform Optimizer"
        description="Leverage AI to analyze and get suggestions for improving your platform's structure, components, and user flows."
      />
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            Optimize Your Platform
          </CardTitle>
          <CardDescription>
            Provide your platform's configuration or link to its definition. Our AI will analyze it and suggest improvements. (Feature Under Development)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PlatformOptimizerClient />
        </CardContent>
      </Card>
    </>
  );
}
