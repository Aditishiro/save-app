
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lightbulb, AlertTriangle, FileText, BarChartBig, Sparkles, Microscope, History, Layers } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MOCK_PLATFORM_STORE_ANALYTICS, type MockPlatformAnalyticsData } from './mock-platform-data';
import { generatePlatformAnalysisReport } from '@/ai/flows/platform-analysis-report-flow'; // Placeholder
import type { PlatformAnalysisReportInput, PlatformAnalysisReportOutput } from '@/ai/flows/platform-analysis-report-types'; // Placeholder

export default function PlatformAnalyticsClient() {
  const [platforms, setPlatforms] = useState<MockPlatformAnalyticsData[]>([]);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [currentProblems, setCurrentProblems] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<PlatformAnalysisReportOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingPlatforms, setIsFetchingPlatforms] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching platforms
    setIsFetchingPlatforms(true);
    const timer = setTimeout(() => {
      setPlatforms(Object.values(MOCK_PLATFORM_STORE_ANALYTICS));
      setIsFetchingPlatforms(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const selectedPlatform = platforms.find(platform => platform.id === selectedPlatformId);

  const handleGenerateReport = async () => {
    if (!selectedPlatform) {
      setError("Please select a platform to analyze.");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    const input: PlatformAnalysisReportInput = {
      platformId: selectedPlatform.id,
      platformName: selectedPlatform.name,
      platformPurpose: selectedPlatform.platformPurpose,
      platformStructure: selectedPlatform.platformStructure,
      currentProblems: currentProblems.trim() || undefined,
    };

    try {
      // In a real scenario, this would be a call to an AI flow
      // For now, it calls a placeholder.
      const output = await generatePlatformAnalysisReport(input);
      setAnalysisResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the platform analysis report.');
      console.error('Platform Analysis Report Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingPlatforms) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading platforms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Platform for Analysis</CardTitle>
          <CardDescription>Choose an existing platform to generate an AI-powered structural analysis and improvement report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="platformSelect">Platform</Label>
            <Select
              value={selectedPlatformId || ''}
              onValueChange={(value) => {
                setSelectedPlatformId(value);
                setAnalysisResult(null); // Clear previous results
                setError(null);
                setCurrentProblems(''); // Clear problems for new platform
              }}
            >
              <SelectTrigger id="platformSelect">
                <SelectValue placeholder="Select a platform..." />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(platform => (
                  <SelectItem key={platform.id} value={platform.id}>
                    {platform.name} (Purpose: {platform.platformPurpose})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedPlatform && (
            <div>
              <Label htmlFor="currentProblems">Known Problems/Pain Points (Optional)</Label>
              <Textarea
                id="currentProblems"
                value={currentProblems}
                onChange={(e) => setCurrentProblems(e.target.value)}
                placeholder="Describe any specific architectural, performance, or usability issues you're aware of with this platform."
                rows={3}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} disabled={!selectedPlatformId || isLoading} className="w-full sm:w-auto">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <BarChartBig className="mr-2 h-4 w-4" />
            )}
            Generate Analysis Report
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {analysisResult && (
        <Card className="mt-6 bg-secondary/30 border border-border">
          <CardHeader>
            <CardTitle className="text-xl">Analysis Report for: {analysisResult.platformName}</CardTitle>
            <CardDescription>AI-generated insights for platform ID: {analysisResult.platformId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="multiple" defaultValue={['current-architecture', 'issues', 'improvements', 'market-research', 'future-vision']} className="w-full">
              
              <AccordionItem value="current-architecture">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-primary">
                    <Microscope className="h-5 w-5" /> Current Architecture Analysis
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow text-foreground leading-relaxed">{analysisResult.currentArchitectureAnalysis}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="issues">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-destructive">
                     <AlertTriangle className="h-5 w-5" /> Identified Issues & Bottlenecks ({analysisResult.identifiedIssues.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.identifiedIssues.length > 0 ? (
                    <ul className="space-y-3">
                      {analysisResult.identifiedIssues.map((item, index) => (
                        <li key={index} className="bg-background p-4 rounded-md shadow border border-destructive/20">
                          <p className="font-medium text-destructive">{item.issue}</p>
                          <p className="text-xs text-muted-foreground">Severity: {item.severity} | Impact Area: {item.impactArea}</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-muted-foreground p-4 text-center">No specific issues identified by the AI.</p>}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="improvements">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                    <Lightbulb className="h-5 w-5" /> Improvement Suggestions ({analysisResult.improvementSuggestions.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.improvementSuggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResult.improvementSuggestions.map((item, index) => (
                      <li key={index} className="bg-background p-4 rounded-md shadow border border-yellow-500/20">
                        <p className="font-medium">{item.suggestion}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.rationale}</p>
                        {item.effortLevel && <p className="text-xs text-blue-500 mt-1">Effort: {item.effortLevel}</p>}
                      </li>
                    ))}
                  </ul>
                  ) : <p className="text-muted-foreground p-4 text-center">No specific improvement suggestions provided.</p>}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="market-research">
                 <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                    <FileText className="h-5 w-5" /> Market Research Summary
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow text-foreground leading-relaxed">{analysisResult.marketResearchSummary || "No specific market research summary generated."}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="future-vision">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                   <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <History className="h-5 w-5" /> Future State Vision
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3 bg-background p-4 rounded-md shadow">
                  <div>
                    <h4 className="font-medium">Concept:</h4>
                    <p className="text-sm text-foreground leading-relaxed">{analysisResult.futureStateVision.concept}</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Key Changes Proposed:</h4>
                    <ul className="list-disc list-inside text-sm text-foreground space-y-1">
                      {analysisResult.futureStateVision.keyChanges.map((change, idx) => <li key={idx}>{change}</li>)}
                    </ul>
                  </div>
                   <div>
                    <h4 className="font-medium">Strategic Alignment:</h4>
                    <p className="text-sm text-foreground leading-relaxed">{analysisResult.futureStateVision.strategicAlignment}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>

            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
