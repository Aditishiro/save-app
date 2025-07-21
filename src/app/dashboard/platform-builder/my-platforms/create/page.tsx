
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/common/page-header';
import { Loader2, Save } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { useAuth } from '@/contexts/auth-context';
import { db } from '@/lib/firebase/firebase';
import { collection, addDoc, serverTimestamp, type Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const platformPurposeOptions = [
  { value: 'core_banking_system', label: 'Core Banking System' },
  { value: 'loan_origination_system', label: 'Loan Origination System' },
  { value: 'online_banking_portal', label: 'Online Banking Portal' },
  { value: 'mobile_banking_app', label: 'Mobile Banking App' },
  { value: 'payment_gateway', label: 'Payment Gateway' },
  { value: 'fraud_detection_system', label: 'Fraud Detection System' },
  { value: 'crm_financial_services', label: 'CRM for Financial Services' },
  { value: 'wealth_management_platform', label: 'Wealth Management Platform' },
  { value: 'trading_platform', label: 'Trading Platform' },
  { value: 'regulatory_reporting_system', label: 'Regulatory Reporting System' },
  { value: 'treasury_management_system', label: 'Treasury Management System' },
  { value: 'kyc_aml_platform', label: 'KYC/AML Platform' },
  { value: 'customer_onboarding_portal', label: 'Customer Onboarding Portal' },
  { value: 'other', label: 'Other (Please specify below)' },
];

export default function CreatePlatformPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [platformName, setPlatformName] = useState<string>("");
  const [platformDescription, setPlatformDescription] = useState<string>("");
  const [selectedPurpose, setSelectedPurpose] = useState<string>("");
  const [customPurposeDescription, setCustomPurposeDescription] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSavePlatform = async () => {
    const tenantId = currentUser?.uid || 'public-user'; // Use 'public-user' if not logged in

    if (!platformName.trim()) {
      toast({ title: "Validation Error", description: "Platform name cannot be empty.", variant: "destructive" });
      return;
    }
    if (!selectedPurpose) {
      toast({ title: "Validation Error", description: "Please select a platform purpose.", variant = "destructive" });
      return;
    }
    if (selectedPurpose === "other" && !customPurposeDescription.trim()) {
      toast({ title: "Validation Error", description: "Please specify the platform purpose if 'Other' is selected.", variant = "destructive" });
      return;
    }


    setIsSaving(true);

    const finalPlatformPurpose = selectedPurpose === "other" ? customPurposeDescription.trim() : platformPurposeOptions.find(opt => opt.value === selectedPurpose)?.label || selectedPurpose;

    try {
      const docRef = await addDoc(collection(db, "platforms"), {
        tenantId: tenantId, 
        name: platformName.trim(),
        description: platformDescription.trim(),
        platformPurpose: finalPlatformPurpose,
        status: 'draft',
        createdAt: serverTimestamp() as Timestamp,
        lastModified: serverTimestamp() as Timestamp,
        platformAdmins: currentUser ? [currentUser.uid] : [], // Assign admin only if logged in
      });
      toast({
        title: "Platform Created",
        description: `Platform "${platformName}" has been successfully created as a draft.`,
      });
      router.push(`/dashboard/platform-builder/my-platforms/${docRef.id}/edit`); 
    } catch (error) {
      console.error("Error saving platform: ", error);
      toast({
        title: "Error Creating Platform",
        description: "Could not create the platform. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Create New Platform"
        description="Define the basic details for your new platform."
        actions={
          <Button onClick={handleSavePlatform} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Platform
          </Button>
        }
      />
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle>Platform Details</CardTitle>
            <CardDescription>Enter the name, purpose, and description for your new platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                id="platformName"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                placeholder="e.g., Client Portal Q1"
                className="mt-1"
                disabled={isSaving}
                required
                />
            </div>

            <div>
              <Label htmlFor="platformPurposeSelect">Platform Purpose/Type</Label>
              <Select
                value={selectedPurpose}
                onValueChange={setSelectedPurpose}
                disabled={isSaving}
                required
              >
                <SelectTrigger id="platformPurposeSelect" className="mt-1">
                  <SelectValue placeholder="Select platform purpose..." />
                </SelectTrigger>
                <SelectContent>
                  {platformPurposeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPurpose === 'other' && (
              <div>
                <Label htmlFor="customPurposeDescription">Specify Platform Purpose</Label>
                <Textarea
                  id="customPurposeDescription"
                  value={customPurposeDescription}
                  onChange={(e) => setCustomPurposeDescription(e.target.value)}
                  placeholder="Describe the specific purpose or type of this platform..."
                  rows={3}
                  className="mt-1"
                  disabled={isSaving}
                  required
                />
              </div>
            )}

            <div>
                <Label htmlFor="platformDescription">Description (Optional)</Label>
                <Textarea
                id="platformDescription"
                value={platformDescription}
                onChange={(e) => setPlatformDescription(e.target.value)}
                placeholder="A brief description of this platform's purpose."
                rows={3}
                className="mt-1"
                disabled={isSaving}
                />
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
