'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Lightbulb, AlertTriangle, FileText, BarChartBig, Sparkles, Microscope, History } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { generateFormAnalysisReport, type FormAnalysisReportInput, type FormAnalysisReportOutput } from '@/ai/flows/form-analysis-report-flow';
import { MOCK_FORM_STORE_ANALYTICS, type MockFormAnalyticsData } from './mock-form-data'; // Using a dedicated mock store
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AnalyticsClient() {
  const [forms, setForms] = useState<MockFormAnalyticsData[]>([]);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [currentProblems, setCurrentProblems] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<FormAnalysisReportOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetchingForms, setIsFetchingForms] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching forms
    setIsFetchingForms(true);
    const timer = setTimeout(() => {
      setForms(Object.values(MOCK_FORM_STORE_ANALYTICS));
      setIsFetchingForms(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const selectedForm = forms.find(form => form.id === selectedFormId);

  const handleGenerateReport = async () => {
    if (!selectedForm) {
      setError("Please select a form to analyze.");
      return;
    }
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    const input: FormAnalysisReportInput = {
      formId: selectedForm.id,
      formTitle: selectedForm.title,
      formConfiguration: selectedForm.formConfiguration,
      intendedUseCase: selectedForm.intendedUseCase,
      currentProblems: currentProblems.trim() || undefined,
    };

    try {
      const output = await generateFormAnalysisReport(input);
      setAnalysisResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the report.');
      console.error('Form Analysis Report Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingForms) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <span className="text-muted-foreground">Loading forms...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Form for Analysis</CardTitle>
          <CardDescription>Choose an existing form to generate an AI-powered analysis and improvement report.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="formSelect">Form</Label>
            <Select
              value={selectedFormId || ''}
              onValueChange={(value) => {
                setSelectedFormId(value);
                setAnalysisResult(null); // Clear previous results
                setError(null);
                setCurrentProblems(''); // Clear problems for new form
              }}
            >
              <SelectTrigger id="formSelect">
                <SelectValue placeholder="Select a form..." />
              </SelectTrigger>
              <SelectContent>
                {forms.map(form => (
                  <SelectItem key={form.id} value={form.id}>
                    {form.title} (ID: {form.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedForm && (
            <div>
              <Label htmlFor="currentProblems">Known Problems/Pain Points (Optional)</Label>
              <Textarea
                id="currentProblems"
                value={currentProblems}
                onChange={(e) => setCurrentProblems(e.target.value)}
                placeholder="Describe any specific issues or challenges you're aware of with this form (e.g., low completion rate, user complaints about field X)."
                rows={3}
                className="mt-1"
              />
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleGenerateReport} disabled={!selectedFormId || isLoading} className="w-full sm:w-auto">
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
            <CardTitle className="text-xl">Analysis Report for: {analysisResult.formTitle}</CardTitle>
            <CardDescription>AI-generated insights and recommendations for form ID: {analysisResult.formId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="multiple" defaultValue={['current-logic', 'problems', 'fixes', 'uplifts', 'market-research', 'future-vision']} className="w-full">
              
              <AccordionItem value="current-logic">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-primary">
                    <Microscope className="h-5 w-5" /> Current Logic Analysis
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow text-foreground leading-relaxed">{analysisResult.currentLogicAnalysis}</pre>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="problems">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-destructive">
                     <AlertTriangle className="h-5 w-5" /> Identified Problems & Pain Points ({analysisResult.identifiedProblemsAndPainPoints.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.identifiedProblemsAndPainPoints.length > 0 ? (
                    <ul className="space-y-3">
                      {analysisResult.identifiedProblemsAndPainPoints.map((item, index) => (
                        <li key={index} className="bg-background p-4 rounded-md shadow border border-destructive/20">
                          <p className="font-medium text-destructive">{item.problem}</p>
                          <p className="text-xs text-muted-foreground">Severity: {item.severity} | Impact Area: {item.impactArea}</p>
                        </li>
                      ))}
                    </ul>
                  ) : <p className="text-muted-foreground p-4 text-center">No specific problems identified by the AI.</p>}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="fixes">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                  <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400"> {/* Consider a warning color */}
                    <Lightbulb className="h-5 w-5" /> Error Fix Suggestions ({analysisResult.errorFixSuggestions.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {analysisResult.errorFixSuggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResult.errorFixSuggestions.map((item, index) => (
                      <li key={index} className="bg-background p-4 rounded-md shadow border border-yellow-500/20">
                        <p className="font-medium">{item.suggestion}</p>
                        <p className="text-sm text-muted-foreground mt-1">{item.rationale}</p>
                        {item.problemId && <p className="text-xs text-blue-500 mt-1">Addresses problem ID: {item.problemId}</p>}
                      </li>
                    ))}
                  </ul>
                  ) : <p className="text-muted-foreground p-4 text-center">No specific error fix suggestions provided.</p>}
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="uplifts">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                 <div className="flex items-center gap-2 text-green-600 dark:text-green-400"> {/* Success color */}
                    <Sparkles className="h-5 w-5" /> Uplift & Enhancement Suggestions ({analysisResult.upliftAndEnhancementSuggestions.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                {analysisResult.upliftAndEnhancementSuggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResult.upliftAndEnhancementSuggestions.map((item, index) => (
                      <li key={index} className="bg-background p-4 rounded-md shadow border border-green-500/20">
                        <p className="font-medium">{item.suggestion}</p>
                        <p className="text-sm text-muted-foreground mt-1">Benefit: {item.benefit}</p>
                        {item.effortLevel && <p className="text-xs text-muted-foreground mt-1">Effort: {item.effortLevel}</p>}
                      </li>
                    ))}
                  </ul>
                 ) : <p className="text-muted-foreground p-4 text-center">No general uplift suggestions provided.</p>}
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
