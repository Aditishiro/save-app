
import { PageHeader } from '@/components/common/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle } from 'lucide-react';
import ChatbotClient from './components/chatbot-client';

export default function AiPlatformGeneratorPage() {
  return (
    <>
      <PageHeader
        title="AI Platform Generator"
        description="Describe the platform you want to build, and let the AI architect do the heavy lifting."
      />
      <Card className="shadow-lg flex-1 flex flex-col min-h-[calc(100vh-12rem)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" />
            AI Platform Architect
          </CardTitle>
          <CardDescription>
            Start a conversation to design your platform. For example: "Build me a simple customer dashboard with a welcome message and a list of recent transactions."
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ChatbotClient />
        </CardContent>
      </Card>
    </>
  );
}
