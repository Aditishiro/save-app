import type { FormFieldData } from '@/components/form-builder/form-field-display';

export interface MockFormAnalyticsData {
  id: string;
  title: string;
  description?: string;
  fields: FormFieldData[]; // Actual field objects
  formConfiguration: string; // JSON string of fields
  intendedUseCase: string;
  lastModified: string;
  submissions: number;
  status: 'Published' | 'Draft' | 'Archived';
}

const clientOnboardingFields: FormFieldData[] = [
  { id: 'field_1', type: 'text', label: 'Full Name', placeholder: 'Enter full name', required: true, validationState: 'default' },
  { id: 'field_2', type: 'email', label: 'Email Address', placeholder: 'you@example.com', required: true, validationState: 'default' },
  { id: 'field_3', type: 'phone', label: 'Phone Number', placeholder: '(555) 123-4567', required: true, validationState: 'default' },
  { id: 'field_4', type: 'date', label: 'Date of Birth', required: true, validationState: 'default' },
  { id: 'field_5', type: 'header', label: 'Address Information', validationState: 'default' },
  { id: 'field_6', type: 'text', label: 'Street Address', placeholder: '123 Main St', required: true, validationState: 'default' },
  { id: 'field_7', type: 'text', label: 'City', placeholder: 'Anytown', required: true, validationState: 'default' },
  { id: 'field_8', type: 'dropdown', label: 'Country', options: ['USA', 'Canada', 'UK', 'Australia'], required: true, validationState: 'default' },
  { id: 'field_9', type: 'file', label: 'Upload ID Document', required: true, validationState: 'default' },
  { id: 'field_10', type: 'checkbox', label: 'I agree to the terms and conditions.', required: true, validationState: 'default' },
];

const loanApplicationFields: FormFieldData[] = [
  { id: 'loan_field_1', type: 'header', label: 'Personal Information' },
  { id: 'loan_field_2', type: 'text', label: 'Applicant Full Name', required: true },
  { id: 'loan_field_3', type: 'text', label: 'Social Security Number', placeholder: 'XXX-XX-XXXX', required: true },
  { id: 'loan_field_4', type: 'date', label: 'Date of Birth', required: true },
  { id: 'loan_field_5', type: 'header', label: 'Employment Information' },
  { id: 'loan_field_6', type: 'text', label: 'Employer Name', required: true },
  { id: 'loan_field_7', type: 'number', label: 'Annual Income', placeholder: '$', required: true },
  { id: 'loan_field_8', type: 'header', label: 'Loan Details' },
  { id: 'loan_field_9', type: 'number', label: 'Loan Amount Requested', placeholder: '$', required: true },
  { id: 'loan_field_10', type: 'dropdown', label: 'Loan Purpose', options: ['Debt Consolidation', 'Home Improvement', 'Major Purchase', 'Business', 'Other'], required: true },
  { id: 'loan_field_11', type: 'textarea', label: 'Detailed Purpose (if Other)', required: false },
];

const feedbackSurveyFields: FormFieldData[] = [
   { id: 'fb_field_1', type: 'header', label: 'Your Experience with Product X' },
   { id: 'fb_field_2', type: 'dropdown', label: 'Overall Satisfaction', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true },
   { id: 'fb_field_3', type: 'number', label: 'Likelihood to Recommend (0-10)', placeholder: '7', required: true },
   { id: 'fb_field_4', type: 'checkbox', label: 'Which features did you use?', options: ['Feature A', 'Feature B', 'Feature C'], required: false }, // Checkbox can have options array for multi-select style display
   { id: 'fb_field_5', type: 'textarea', label: 'What can we improve?', placeholder: 'Tell us your thoughts...' },
];

export const MOCK_FORM_STORE_ANALYTICS: Record<string, MockFormAnalyticsData> = {
  '1': {
    id: '1',
    title: 'Comprehensive Client Onboarding',
    description: 'Form for new client registration and KYC.',
    fields: clientOnboardingFields,
    formConfiguration: JSON.stringify({ fields: clientOnboardingFields }),
    intendedUseCase: 'Client Onboarding (Validation, multi-step, KYC compliance)',
    lastModified: '2024-08-01',
    submissions: 257,
    status: 'Published',
  },
  '2': {
    id: '2',
    title: 'Detailed Loan Application Form - V3.1',
    description: 'Application form for personal and business loans.',
    fields: loanApplicationFields,
    formConfiguration: JSON.stringify({ fields: loanApplicationFields }),
    intendedUseCase: 'Financial Application (Security, compliance, credit assessment)',
    lastModified: '2024-07-15',
    submissions: 98,
    status: 'Published',
  },
  '3': {
    id: '3',
    title: 'Q3 Product Feedback Survey',
    description: 'Gather customer feedback on recent product updates.',
    fields: feedbackSurveyFields,
    formConfiguration: JSON.stringify({ fields: feedbackSurveyFields }),
    intendedUseCase: 'User Feedback Collection (Surveys, product improvement insights)',
    lastModified: '2024-06-20',
    submissions: 530,
    status: 'Archived',
  },
   '4': {
    id: '4',
    title: 'Internal IT Support Request',
    description: 'Form for employees to request IT assistance.',
    fields: [
        { id: 'it_1', type: 'text', label: 'Employee Name', required: true},
        { id: 'it_2', type: 'text', label: 'Employee ID', required: true},
        { id: 'it_3', type: 'dropdown', label: 'Issue Category', options: ['Hardware', 'Software', 'Network', 'Access'], required: true},
        { id: 'it_4', type: 'textarea', label: 'Describe your issue', required: true},
    ],
    formConfiguration: JSON.stringify({ fields: [
        { id: 'it_1', type: 'text', label: 'Employee Name', required: true},
        { id: 'it_2', type: 'text', label: 'Employee ID', required: true},
        { id: 'it_3', type: 'dropdown', label: 'Issue Category', options: ['Hardware', 'Software', 'Network', 'Access'], required: true},
        { id: 'it_4', type: 'textarea', label: 'Describe your issue', required: true},
    ]}),
    intendedUseCase: 'Internal Process Automation (Workflows, IT support)',
    lastModified: '2024-05-10',
    submissions: 1203,
    status: 'Draft',
  }
};
