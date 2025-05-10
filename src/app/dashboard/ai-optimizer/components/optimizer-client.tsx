'use client';

import { useState } from 'react';
import { optimizeFormWithAI, type OptimizeFormWithAIInput, type OptimizeFormWithAIOutput } from '@/ai/flows/ai-form-optimizer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function OptimizerClient() {
  const [formConfig, setFormConfig] = useState<string>('');
  const [useCase, setUseCase] = useState<string>('');
  const [result, setResult] = useState<OptimizeFormWithAIOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    const input: OptimizeFormWithAIInput = {
      formConfiguration: formConfig,
      intendedUseCase: useCase,
    };

    try {
      const output = await optimizeFormWithAI(input);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
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
          <Label htmlFor="intendedUseCase" className="text-base font-medium">Intended Use Case</Label>
          <Input
            id="intendedUseCase"
            value={useCase}
            onChange={(e) => setUseCase(e.target.value)}
            placeholder="e.g., New client onboarding for wealth management"
            className="mt-1"
            required
          />
           <p className="text-xs text-muted-foreground mt-1">Describe how this form will be used.</p>
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
        <Card className="mt-6 bg-secondary/50">
          <CardHeader>
            <CardTitle className="text-xl">Optimization Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-1">Suggestions:</h3>
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
