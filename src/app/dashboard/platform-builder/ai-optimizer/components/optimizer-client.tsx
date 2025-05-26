
'use client';

import { useState } from 'react';
import { optimizePlatformWithAI, type OptimizePlatformWithAIInput, type OptimizePlatformWithAIOutput } from '@/ai/flows/ai-platform-optimizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Construction, Wand2, Loader2, PackageSearch, Recycle, TrendingUp, Architecture, LightbulbBolt, Brain } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const platformUseCaseOptions = [
  { value: "ecommerce_platform", label: "E-commerce Platform (B2C, B2B)" },
  { value: "saas_application", label: "SaaS Application (e.g., CRM, Project Management)" },
  { value: "social_community_platform", label: "Social Network / Community Platform" },
  { value: "cms_blogging_platform", label: "Content Management System (CMS) / Blogging" },
  { value: "online_learning_platform", label: "Online Learning / Education Platform" },
  { value: "booking_reservation_system", label: "Booking / Reservation System" },
  { value: "internal_business_tool", label: "Internal Business Tool / Operations Dashboard" },
  { value: "data_analytics_platform", label: "Data Analytics / Visualization Platform" },
  { value: "fintech_application", label: "Fintech Application (e.g., PFM, Investment)" },
  { value: "iot_platform", label: "IoT Platform / Device Management" },
  { value: "other", label: "Other (Please specify below)" },
];

export default function PlatformOptimizerClient() {
  const [platformConfig, setPlatformConfig] = useState<string>('');
  const [selectedUseCaseValue, setSelectedUseCaseValue] = useState<string>('');
  const [customUseCaseText, setCustomUseCaseText] = useState<string>('');
  
  const [result, setResult] = useState<OptimizePlatformWithAIOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);
    
    let finalUseCaseDescription = '';
    if (selectedUseCaseValue === 'other') {
      finalUseCaseDescription = customUseCaseText.trim();
    } else {
      const selectedOption = platformUseCaseOptions.find(opt => opt.value === selectedUseCaseValue);
      finalUseCaseDescription = selectedOption ? selectedOption.label : '';
    }

    if (!platformConfig.trim() || !finalUseCaseDescription) {
      setError("Please provide platform configuration/description and specify the intended use case.");
      setIsLoading(false);
      return;
    }
    
    const input: OptimizePlatformWithAIInput = {
      platformConfiguration: platformConfig,
      intendedUseCase: finalUseCaseDescription,
    };

    try {
      const output = await optimizePlatformWithAI(input);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while optimizing the platform.');
      console.error('AI Platform Optimizer Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Construction className="h-5 w-5" />
        <AlertTitle>AI Platform Optimizer</AlertTitle>
        <AlertDescription>
          Input your platform's structural description or JSON configuration, specify its intended use case, and our AI will provide optimization suggestions.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="platformConfiguration" className="text-base font-medium">
            Platform Configuration / Description
          </Label>
          <Textarea
            id="platformConfiguration"
            value={platformConfig}
            onChange={(e) => setPlatformConfig(e.target.value)}
            placeholder='Describe your platform structure: e.g., "A customer portal with a dashboard (summary widgets, recent activity), user profile page, and a settings section. Key integrations are X and Y." OR provide JSON: { "layouts": [...], "components": [...] }'
            rows={8}
            className="mt-1 font-mono text-sm"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Provide a textual description or a JSON representation of your platform's key layouts, components, and features.
          </p>
        </div>

        <div>
          <Label htmlFor="intendedUseCaseSelect" className="text-base font-medium">Intended Use Case / Platform Type</Label>
          <Select
            value={selectedUseCaseValue}
            onValueChange={setSelectedUseCaseValue}
            required
            disabled={isLoading}
          >
            <SelectTrigger id="intendedUseCaseSelect" className="mt-1">
              <SelectValue placeholder="Select a use case..." />
            </SelectTrigger>
            <SelectContent>
              {platformUseCaseOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">Select the primary purpose of the platform to help the AI provide targeted suggestions.</p>
        </div>

        {selectedUseCaseValue === 'other' && (
          <div>
            <Label htmlFor="customUseCaseText" className="text-base font-medium">Specify Other Use Case</Label>
            <Textarea
              id="customUseCaseText"
              value={customUseCaseText}
              onChange={(e) => setCustomUseCaseText(e.target.value)}
              placeholder="Describe the specific use case or type of platform..."
              rows={3}
              className="mt-1"
              required={selectedUseCaseValue === 'other'}
              disabled={isLoading}
            />
          </div>
        )}

        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Optimize Platform
        </Button>
      </form>

       {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-6 bg-secondary/30 border-border">
          <CardHeader>
            <CardTitle className="text-xl">Platform Optimization Results</CardTitle>
            <CardDescription>AI-generated suggestions for your platform.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" defaultValue={['arch-suggestions', 'comp-suggestions', 'perf-opt', 'scale-enhance', 'reasoning']} className="w-full">
              <AccordionItem value="arch-suggestions">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <Architecture className="h-5 w-5" /> Architectural Suggestions
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow leading-relaxed">{result.architecturalSuggestions}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="comp-suggestions">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <PackageSearch className="h-5 w-5" /> Component Suggestions
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow leading-relaxed">{result.componentSuggestions}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="perf-opt">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <TrendingUp className="h-5 w-5" /> Performance Optimizations
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow leading-relaxed">{result.performanceOptimizations}</pre>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="scale-enhance">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-orange-500 dark:text-orange-400">
                    <Recycle className="h-5 w-5" /> Scalability Enhancements
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow leading-relaxed">{result.scalabilityEnhancements}</pre>
                </AccordionContent>
              </AccordionItem>
              
              {result.redesignIdeas && (
                <AccordionItem value="redesign-ideas">
                  <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                    <div className="flex items-center gap-2 text-red-500 dark:text-red-400">
                       <LightbulbBolt className="h-5 w-5"/> Redesign Ideas
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow leading-relaxed">{result.redesignIdeas}</pre>
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="reasoning">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <Brain className="h-5 w-5" /> Reasoning
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow leading-relaxed">{result.reasoning}</pre>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
