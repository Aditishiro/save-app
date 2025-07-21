
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send, Bot, User, Brain, AlertTriangle, Building, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { generatePlatformFromPrompt } from '@/ai/flows/ai-platform-generator';
import type { GeneratePlatformFromPromptInput, GeneratePlatformFromPromptOutput } from '@/ai/flows/ai-platform-generator-types';
import type { PlatformData, PlatformLayout, PlatformComponentInstance } from '@/platform-builder/data-models';
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, doc, writeBatch, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';


interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  platformData?: GeneratePlatformFromPromptOutput; // Optional structured data
}

export default function ChatbotClient() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const promptInput: GeneratePlatformFromPromptInput = { prompt: input };
      const result = await generatePlatformFromPrompt(promptInput);

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: `I have designed a platform named "${result.platformName}". Here is the proposed structure. You can ask for modifications or create the platform.`,
        platformData: result,
      };
      setMessages((prev) => [...prev, assistantMessage]);

    } catch (error) {
      console.error('AI Platform Generator Error:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: `I encountered an error trying to generate the platform: ${error instanceof Error ? error.message : 'Unknown error'}. Please try rephrasing your request.`,
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        title: 'Error Generating Platform',
        description: error instanceof Error ? error.message : 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlatform = async (platformStructure: GeneratePlatformFromPromptOutput) => {
    if (!currentUser) {
      toast({ title: "Authentication Error", description: "You must be logged in to create a platform.", variant: "destructive" });
      return;
    }
    setIsCreating(true);

    try {
      const batch = writeBatch(db);

      // 1. Create Platform document
      const platformDocRef = doc(collection(db, 'platforms'));
      const newPlatform: Omit<PlatformData, 'id'> = {
        tenantId: currentUser.uid,
        name: platformStructure.platformName,
        description: platformStructure.platformDescription,
        platformPurpose: platformStructure.platformPurpose,
        status: 'draft',
        createdAt: serverTimestamp() as Timestamp,
        lastModified: serverTimestamp() as Timestamp,
        platformAdmins: [currentUser.uid],
      };
      
      let defaultLayoutId: string | null = null;

      // 2. Create Layout and Component Instance documents
      for (const layoutData of platformStructure.layouts) {
        const layoutDocRef = doc(collection(db, 'platforms', platformDocRef.id, 'layouts'));
        if (!defaultLayoutId) {
            defaultLayoutId = layoutDocRef.id;
        }

        const newLayout: Omit<PlatformLayout, 'id'> = {
          platformId: platformDocRef.id,
          tenantId: currentUser.uid,
          name: layoutData.name,
          createdAt: serverTimestamp() as Timestamp,
          lastModified: serverTimestamp() as Timestamp,
        };
        batch.set(layoutDocRef, newLayout);
        
        for (const instanceData of layoutData.componentInstances) {
            const instanceDocRef = doc(collection(db, 'platforms', platformDocRef.id, 'components'));
            const newInstance: Omit<PlatformComponentInstance, 'id'> = {
                definitionId: instanceData.definitionId,
                type: instanceData.type,
                tenantId: currentUser.uid,
                platformId: platformDocRef.id,
                layoutId: layoutDocRef.id,
                configuredValues: instanceData.configuredValues,
                order: instanceData.order,
                createdAt: serverTimestamp() as Timestamp,
                lastModified: serverTimestamp() as Timestamp,
            };
            batch.set(instanceDocRef, newInstance);
        }
      }
      
      // 3. Update platform with defaultLayoutId
      batch.set(platformDocRef, { ...newPlatform, defaultLayoutId: defaultLayoutId || undefined });

      // Commit all writes at once
      await batch.commit();

      toast({
        title: "Platform Created Successfully!",
        description: `Platform "${platformStructure.platformName}" has been created. Redirecting to the editor...`,
      });

      router.push(`/dashboard/platform-builder/my-platforms/${platformDocRef.id}/edit`);

    } catch (error) {
        console.error("Error creating platform from chatbot:", error);
        toast({
            title: "Error Creating Platform",
            description: "Could not save the platform structure. Please check the console for details.",
            variant: 'destructive'
        });
    } finally {
        setIsCreating(false);
    }

  }

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 pr-4 -mr-4">
        <div className="space-y-6">
          {messages.length === 0 && (
              <div className="text-center text-muted-foreground p-8">
                <Brain className="mx-auto h-12 w-12 mb-4"/>
                <p>The AI architect is ready to design your platform.</p>
                <p className="text-sm">Just describe what you need!</p>
              </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
              {message.role === 'assistant' && <Bot className="h-8 w-8 text-primary flex-shrink-0" />}
              <div className={`p-3 rounded-lg max-w-xl ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.platformData && (
                    <div className="mt-4 p-4 bg-background/50 rounded-lg border border-border">
                        <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <Building className="h-5 w-5"/>
                            Platform Proposal: {message.platformData.platformName}
                        </h4>
                        <pre className="text-xs whitespace-pre-wrap max-h-60 overflow-y-auto bg-black/30 p-2 rounded">
                            {JSON.stringify(message.platformData, null, 2)}
                        </pre>
                        <Alert className="mt-3">
                            <Sparkles className="h-4 w-4"/>
                            <AlertTitle>Next Steps</AlertTitle>
                            <AlertDescription>
                                You can ask for changes or, if you're satisfied, create this platform.
                            </AlertDescription>
                        </Alert>
                        <Button 
                            className="w-full mt-3" 
                            onClick={() => handleCreatePlatform(message.platformData!)}
                            disabled={isCreating}
                        >
                           {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Building className="mr-2 h-4 w-4"/>}
                           Create this Platform
                        </Button>
                    </div>
                )}
              </div>
              {message.role === 'user' && <User className="h-8 w-8 text-muted-foreground flex-shrink-0" />}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Bot className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="p-3 rounded-lg bg-secondary flex items-center">
                <Loader2 className="h-5 w-5 animate-spin"/>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="mt-4 pt-4 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe the platform you want to build..."
            className="flex-1"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
