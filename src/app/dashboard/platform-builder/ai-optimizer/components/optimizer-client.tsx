
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Construction, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [isLoading, setIsLoading] = useState(false); // Added for potential future use

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // In a real implementation, this would gather platformConfig and use case data
    // and call an AI flow.
    
    let finalUseCaseDescription = '';
    if (selectedUseCaseValue === 'other') {
      finalUseCaseDescription = customUseCaseText.trim();
    } else {
      const selectedOption = platformUseCaseOptions.find(opt => opt.value === selectedUseCaseValue);
      finalUseCaseDescription = selectedOption ? selectedOption.label : '';
    }

    console.log("Platform Config:", platformConfig);
    console.log("Intended Use Case:", finalUseCaseDescription);
    
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    alert("Conceptual Platform Optimization Submitted!\nConfig: " + platformConfig.substring(0,50) + "...\nUseCase: " + finalUseCaseDescription);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Construction className="h-5 w-5" />
        <AlertTitle>AI analysis Feature Under Development</AlertTitle>
        <AlertDescription>
          The AI Platform Optimizer is currently being built. Soon, you'll be able to input your platform's structure here for analysis and optimization suggestions. For now, this form is for UI demonstration.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="platformConfiguration" className="text-base font-medium">
            Platform Configuration (JSON or Link - Placeholder)
          </Label>
          <Textarea
            id="platformConfiguration"
            value={platformConfig}
            onChange={(e) => setPlatformConfig(e.target.value)}
            placeholder='{ "layouts": [...], "components": [...] } or https://example.com/platform-def.json'
            rows={8}
            className="mt-1 font-mono text-sm"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Enter the JSON representation or a link to your platform's definition.
          </p>
        </div>

        <div>
          <Label htmlFor="intendedUseCaseSelect" className="text-base font-medium">Intended Use Case / Platform Type</Label>
          <Select
            value={selectedUseCaseValue}
            onValueChange={setSelectedUseCaseValue}
            required
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
            />
          </div>
        )}

        <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
          {isLoading ? (
            <Wand2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="mr-2 h-4 w-4" />
          )}
          Optimize Platform
        </Button>
      </form>
    </div>
  );
}
