
// src/app/dashboard/platform-builder/analytics/components/mock-platform-data.ts

export interface MockPlatformAnalyticsData {
  id: string;
  name: string;
  description?: string;
  platformPurpose: string;
  platformStructure: string; // JSON string representing a simplified platform structure
  lastModified: string;
  status: 'draft' | 'published' | 'archived';
}

export const MOCK_PLATFORM_STORE_ANALYTICS: Record<string, MockPlatformAnalyticsData> = {
  'platform_001': {
    id: 'platform_001',
    name: 'Alpha Core Banking Portal',
    description: 'Next-generation core banking system for retail customers.',
    platformPurpose: 'Core Banking System',
    platformStructure: JSON.stringify({
      layouts: [
        { id: 'l1', name: 'Dashboard', componentIds: ['c1', 'c2', 'c3'] },
        { id: 'l2', name: 'Account Details', componentIds: ['c4', 'c5'] },
      ],
      components: [
        { id: 'c1', type: 'Header', config: { title: 'Main Dashboard' } },
        { id: 'c2', type: 'SummaryWidget', config: { accounts: 3 } },
        { id: 'c3', type: 'TransactionList', config: { limit: 10 } },
        { id: 'c4', type: 'AccountInfo', config: { showHistory: true } },
        { id: 'c5', type: 'QuickActions', config: { actions: ['transfer', 'pay_bill'] } },
      ],
      userFlows: ["Login -> Dashboard -> View Account Details -> Transfer Funds"],
    }),
    lastModified: '2024-07-28',
    status: 'published',
  },
  'platform_002': {
    id: 'platform_002',
    name: 'SME Loan Origination Hub',
    description: 'Streamlined loan origination for small and medium enterprises.',
    platformPurpose: 'Loan Origination System',
    platformStructure: JSON.stringify({
      layouts: [
        { id: 'los_l1', name: 'Application Entry', componentIds: ['los_c1', 'los_c2'] },
        { id: 'los_l2', name: 'Document Upload', componentIds: ['los_c3'] },
        { id: 'los_l3', name: 'Review & Submit', componentIds: ['los_c4', 'los_c5'] },
      ],
      components: [
        { id: 'los_c1', type: 'BusinessInfoForm' },
        { id: 'los_c2', type: 'LoanDetailsForm' },
        { id: 'los_c3', type: 'MultiDocumentUploader' },
        { id: 'los_c4', type: 'ApplicationSummaryView' },
        { id: 'los_c5', type: 'ESignaturePad' },
      ],
      targetUsers: "Loan officers, SME applicants",
      keyIntegrations: ["Credit Scoring API", "Core Banking Ledger"]
    }),
    lastModified: '2024-08-15',
    status: 'draft',
  },
  'platform_003': {
    id: 'platform_003',
    name: 'WealthAdvisor Pro Suite',
    description: 'Comprehensive wealth management tools for financial advisors.',
    platformPurpose: 'Wealth Management Platform',
    platformStructure: JSON.stringify({
        layouts: [
            { id: 'wm_l1', name: 'Client Portfolio Overview' },
            { id: 'wm_l2', name: 'Market Analysis Dashboard' },
            { id: 'wm_l3', name: 'Financial Planning Modeler' }
        ],
        mainUserSegments: ["Financial Advisors", "High Net Worth Individuals"],
        criticalSuccessFactors: ["Data Accuracy", "Real-time Market Feeds", "Robust Reporting"]
    }),
    lastModified: '2024-06-10',
    status: 'archived',
  },
};
