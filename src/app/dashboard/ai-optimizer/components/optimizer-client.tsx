'use client';

import { useState } from 'react';
import { optimizeFormWithAI, type OptimizeFormWithAIInput, type OptimizeFormWithAIOutput } from '@/ai/flows/ai-form-optimizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2, FileText, Recycle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OptimizerClient() {
  const [formConfig, setFormConfig] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [researchDocument, setResearchDocument] = useState<File | null>(null);
  const [result, setResult] = useState<OptimizeFormWithAIOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Basic file size validation (e.g., 10MB)
      if (e.target.files[0].size > 10 * 1024 * 1024) {
          setError("Research document size should not exceed 10MB.");
          e.target.value = ''; // Clear the input
          setResearchDocument(null);
          return;
      }
      setResearchDocument(e.target.files[0]);
       setError(null); // Clear previous file errors
    } else {
      setResearchDocument(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setError(null);

    if (!formConfig.trim() || !useCase.trim()) {
      setError("Please provide both form configuration and intended use case.");
      setIsLoading(false);
      return;
    }

    try {
      JSON.parse(formConfig); // Validate JSON
    } catch (jsonError) {
      setError("Invalid JSON format for form configuration.");
      setIsLoading(false);
      return;
    }

    let researchDocumentDataUri: string | undefined = undefined;
    if (researchDocument) {
      try {
        researchDocumentDataUri = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (err) => reject(new Error("Failed to read the research document."));
          reader.readAsDataURL(researchDocument);
        });
      } catch (fileError) {
        setError(fileError instanceof Error ? fileError.message : "Error processing the research document.");
        setIsLoading(false);
        return;
      }
    }


    const input: OptimizeFormWithAIInput = {
      formConfiguration: formConfig,
      intendedUseCase: useCase,
      researchDocumentDataUri: researchDocumentDataUri,
    };

    try {
      const output = await optimizeFormWithAI(input);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred while optimizing the form.');
      console.error('AI Optimizer Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="formConfiguration" className="text-base font-medium">Form Configuration (JSON)</Label>
          <Textarea
            id="formConfiguration"
            value={formConfig}
            onChange={(e) => setFormConfig(e.target.value)}
            placeholder='{ "fields": [ { "name": "fullName", "type": "text", "label": "Full Name" } ] }'
            rows={10}
            className="mt-1 font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Enter the JSON representation of your form.</p>
        </div>
        <div>
          <Label htmlFor="intendedUseCase" className="text-base font-medium">Intended Use Case & Future Needs</Label>
          <Input
            id="intendedUseCase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="e.g., New client onboarding, needs to scale internationally, must comply with GDPR."
            className="mt-1"
            required
          />
           <p className="text-xs text-muted-foreground mt-1">Describe how this form will be used and any complex problems or future requirements.</p>
        </div>
         <div>
          <Label htmlFor="researchDocument" className="text-base font-medium flex items-center gap-1">
            <FileText className="h-4 w-4" />
            Research Document (Optional)
          </Label>
          <Input
            id="researchDocument"
            type="file"
            accept=".pdf,.txt,.md,.docx" // Added docx
            onChange={handleFileChange}
            className="mt-1"
          />
          <p className="text-xs text-muted-foreground mt-1">Upload a relevant document (PDF, TXT, MD, DOCX) to inform suggestions. Max 10MB.</p>
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Optimize Form
        </Button>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && (
        <Card className="mt-6 bg-secondary/50 border border-border">
          <CardHeader>
            <CardTitle className="text-xl">Optimization Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.redesignSuggestions && (
              <div className="border border-primary/30 p-4 rounded-md bg-primary/5">
                <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-primary">
                  <Recycle className="h-5 w-5"/>
                  Redesign Suggestions:
                </h3>
                <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow">{result.redesignSuggestions}</pre>
              </div>
            )}
             <div>
              <h3 className="font-semibold text-lg mb-1">Improvement Suggestions:</h3>
              <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow">{result.suggestions}</pre>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1">Reasoning:</h3>
              <pre className="whitespace-pre-wrap bg-background p-4 rounded-md text-sm shadow">{result.reasoning}</pre>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
