'use server';
/**
 * @fileOverview An AI agent that analyzes existing forms, identifies issues, suggests improvements,
 * incorporates market research, and proposes a future state for the form.
 *
 * - generateFormAnalysisReport - A function that handles the form analysis and reporting process.
 * - FormAnalysisReportInput - The input type for the function (imported from types file).
 * - FormAnalysisReportOutput - The return type for the function (imported from types file).
 */

import {ai} from '@/ai/genkit';
import {z}  from 'genkit';
import {
  FormAnalysisReportInputSchema,
  type FormAnalysisReportInput,
  FormAnalysisReportOutputSchema,
  type FormAnalysisReportOutput
} from './form-analysis-report-types';

// Re-using the best practices tool from ai-form-optimizer
const GetFormDesignBestPracticesInputSchema = z.object({
  useCase: z.string().describe('The intended use case of the form, e.g., "client_onboarding", "financial_application".'),
});

const GetFormDesignBestPracticesOutputSchema = z.object({
  bestPractices: z.string().describe('A summary of best practices and common design patterns for the given use case.'),
});

const getFormDesignBestPracticesTool = ai.defineTool(
  {
    name: 'getFormDesignBestPractices',
    description: 'Retrieves established best practices and common design patterns for a specific type of form or use case.',
    inputSchema: GetFormDesignBestPracticesInputSchema,
    outputSchema: GetFormDesignBestPracticesOutputSchema,
  },
  async (input) => {
    // This is a mock implementation. In a real scenario, this could query a database or a knowledge base.
    let practices = "General best practices: Ensure clarity by using simple language. Minimize the number of fields to reduce user effort. Provide clear and immediate error messages. Ensure the form is accessible (WCAG compliant). Use logical grouping for related fields. Ensure responsive design for all devices.";
    
    const lowerCaseUseCase = input.useCase.toLowerCase();

    if (lowerCaseUseCase.includes("client_onboarding")) {
      practices += " For client onboarding: Consider breaking down long forms into multiple steps with progress indicators. Clearly state document requirements upfront. Provide examples for complex fields. Allow saving progress. Integrate with identity verification services.";
    } else if (lowerCaseUseCase.includes("financial_application")) {
      practices += " For financial applications: Prioritize security and explicitly mention data encryption and secure handling. Clearly state compliance requirements (e.g., KYC/AML, Reg CC). Provide detailed explanations for requests of sensitive personal or financial information. Offer help text or tooltips for financial jargon. Include robust fraud detection measures.";
    } else if (lowerCaseUseCase.includes("ecommerce_checkout")) {
      practices += " For e-commerce checkout: Offer a guest checkout option. Display a clear summary of the cart items and total cost. Support multiple payment methods. Minimize steps to complete the purchase. Ensure trust signals like security badges are visible. Optimize for mobile payment experiences.";
    } else if (lowerCaseUseCase.includes("user_registration")) {
      practices += " For user registration: Only ask for essential information. Offer social login options. Provide clear password strength indicators. Explain why certain information is needed. Implement two-factor authentication options.";
    } else if (lowerCaseUseCase.includes("internal_process_automation")) {
        practices += " For internal process automation: Design forms for efficiency and speed. Pre-fill known information where possible. Use clear and consistent labeling that matches internal terminology. Ensure workflows are clearly mapped to form sections. Integrate with existing internal systems for data lookup and population."
    } else if (lowerCaseUseCase.includes("cross_product_integration")) {
        practices += " For cross-product integration: Ensure data fields map correctly to API endpoints. Consider versioning for form fields if APIs change. Clearly indicate which data is being shared between products. Provide robust error handling for API communication failures. Implement OAuth or secure token-based authentication for integrations."
    } else if (lowerCaseUseCase.includes("scalability") || lowerCaseUseCase.includes("future_proofing")) {
        practices += " For high scalability / future-proofing: Design with modular components. Use a flexible data schema. Plan for internationalization and localization if applicable. Ensure the form infrastructure can handle peak loads using serverless or auto-scaling architectures. Implement feature flags for rolling out new form elements."
    } else if (lowerCaseUseCase.includes("regulatory_compliance")) {
        practices += " For regulatory compliance heavy forms (e.g., GDPR, HIPAA, CCPA): Include explicit consent checkboxes with links to policies. Provide links to privacy policies and terms of service. Ensure data retention policies are clear and configurable. Design for audit trails and secure data storage with encryption at rest and in transit."
    } else {
        practices += " For general use cases: Ensure a good balance between collecting necessary data and user convenience. Test forms thoroughly across different devices and browsers."
    }
    return { bestPractices: practices };
  }
);

// New tool for fetching market research
const FetchMarketResearchInputSchema = z.object({
  topic: z.string().describe("The topic for market research, typically related to the form's use case or industry (e.g., 'trends in digital client onboarding for financial services', 'UX innovations in loan applications 2024')."),
  industry: z.string().optional().describe("Specific industry context, e.g., 'banking', 'insurance', 'fintech'.")
});

const FetchMarketResearchOutputSchema = z.object({
  researchSummary: z.string().describe("A concise summary of relevant market research, trends, and competitor insights for the given topic and industry."),
});

const fetchMarketResearchTool = ai.defineTool(
  {
    name: 'fetchMarketResearch',
    description: 'Fetches and summarizes market research, competitive landscape, and emerging trends relevant to a specific topic, use case, or industry.',
    inputSchema: FetchMarketResearchInputSchema,
    outputSchema: FetchMarketResearchOutputSchema,
  },
  async (input) => {
    // Mock implementation for market research
    let summary = `Market research for '${input.topic}':\n`;
    const lcTopic = input.topic.toLowerCase();

    if (lcTopic.includes("onboarding")) {
      summary += "- Trend: Increased demand for fully digital, AI-driven onboarding experiences with minimal data entry.\n- Competitors: Leading fintechs offer sub-5-minute onboarding. Traditional banks are catching up with mobile-first solutions.\n- Innovation: Biometric verification, automated document analysis, and personalized onboarding flows are key differentiators.\n- Customer Expectation: Seamless, fast, and transparent processes. Clear communication about data usage and security is paramount.";
    } else if (lcTopic.includes("loan application")) {
      summary += "- Trend: Shift towards embedded finance and point-of-sale lending. AI-powered credit scoring and instant decisioning are becoming standard.\n- Competitors: Online lenders and neobanks offer rapid loan approvals. Some provide pre-qualified offers based on existing customer data.\n- Innovation: Use of alternative data for credit assessment, blockchain for secure loan processing, and personalized loan terms.\n- Customer Expectation: Quick approvals, transparent terms, flexible repayment options, and self-service capabilities.";
    } else if (lcTopic.includes("customer feedback") || lcTopic.includes("survey")) {
      summary += "- Trend: Focus on collecting contextual feedback at multiple touchpoints. AI for sentiment analysis and identifying key themes from open-text responses.\n- Competitors: Utilizing advanced survey platforms with built-in analytics and integration capabilities.\n- Innovation: Gamified surveys, video feedback, and proactive feedback collection based on user behavior.\n- Customer Expectation: Short, relevant surveys. Assurance that feedback is valued and acted upon. Omnichannel feedback options.";
    } else {
      summary += "- General Trend: Hyper-personalization, enhanced security (Zero Trust models), and ethical AI use are major themes across digital product development.\n- Innovation: Focus on creating intuitive user interfaces, leveraging data analytics for proactive improvements, and ensuring accessibility for all users.\n- Customer Expectation: Users expect digital services to be reliable, secure, easy to use, and tailored to their individual needs.";
    }
     if (input.industry) {
        summary += `\n- Industry Specific (${input.industry}): Regulatory changes in ${input.industry} are pushing for more transparent data handling. Customer trust is a key competitive advantage.`;
    }
    return { researchSummary: summary };
  }
);

// Schemas and types are now imported from ./form-analysis-report-types

export async function generateFormAnalysisReport(input: FormAnalysisReportInput): Promise<FormAnalysisReportOutput> {
  return formAnalysisReportFlow(input);
}

const formAnalysisPrompt = ai.definePrompt({
  name: 'formAnalysisReportPrompt',
  input: {schema: FormAnalysisReportInputSchema},
  output: {schema: FormAnalysisReportOutputSchema},
  tools: [getFormDesignBestPracticesTool, fetchMarketResearchTool],
  prompt: `You are an expert AI Form Analyst and Strategist. Your task is to conduct a comprehensive analysis of the provided form and generate a detailed report.

Form Details:
ID: {{{formId}}}
Title: {{{formTitle}}}
Intended Use Case: {{{intendedUseCase}}}
{{#if currentProblems}}
User-Described Problems: {{{currentProblems}}}
{{/if}}

Form Configuration (JSON):
{{{formConfiguration}}}

Analysis & Reporting Instructions:

1.  **Current Logic Analysis**:
    *   Thoroughly analyze the form's JSON configuration and its intended use case.
    *   Describe the form's current logic, field structure, apparent workflow, and how it aims to achieve its purpose.

2.  **Identify Problems & Pain Points**:
    *   Based on the form configuration, intended use case, and any user-described problems, identify specific issues, pain points, or areas of inefficiency.
    *   For each problem, assess its severity (Low, Medium, High) and the primary area it impacts (e.g., User Experience, Data Quality, Completion Rate, Compliance, Operational Efficiency).
    *   Consider common pitfalls: confusing labels, too many fields, lack of clear guidance, poor validation, accessibility issues, inefficient flow.

3.  **Error Fix Suggestions**:
    *   For the identified problems (especially Medium to High severity), provide specific, actionable suggestions to fix them.
    *   For each suggestion, explain the rationale and how it resolves the identified issue. If a suggestion links to a specific problem from step 2, briefly describe that problem.

4.  **Uplift & Enhancement Suggestions**:
    *   Beyond fixing errors, suggest general improvements and enhancements to uplift the form.
    *   Think about improving user experience, data accuracy, completion speed, or adding valuable (but perhaps not critical) features.
    *   For each suggestion, state the expected benefit and optionally estimate the implementation effort (Low, Medium, High).
    *   Use the 'getFormDesignBestPracticesTool' with the '{{{intendedUseCase}}}' to gather standard best practices. Integrate these best practices into your suggestions where relevant.

5.  **Market Research Summary**:
    *   Based on the form's '{{{intendedUseCase}}}' and '{{{formTitle}}}', determine a relevant topic for market research (e.g., 'trends in digital client onboarding for financial services', 'UX innovations in loan applications 2024', 'best practices for customer feedback surveys in retail').
    *   Use the 'fetchMarketResearch' tool with this topic to get insights.
    *   Summarize the key findings from the market research, focusing on trends, competitor activities, and innovations relevant to this type of form.

6.  **Future State Vision**:
    *   Synthesize all the above information (current analysis, problems, best practices, market research).
    *   Propose a conceptual 'Future State Vision' for the form. This vision should aim to make the form significantly more effective, user-centric, and aligned with future needs or market trends.
    *   Detail the 'Key Changes' needed to achieve this vision (e.g., redesigning sections, introducing new technologies like AI for data pre-fill, integrating with other services, simplifying complex workflows).
    *   Explain the 'Strategic Alignment' of this future state: how it could help achieve broader business goals (e.g., improved customer satisfaction scores, reduced operational costs, faster processing times, compliance with upcoming regulations, expansion to new user segments).

Ensure your response strictly adheres to the output schema. Be detailed, specific, and provide actionable insights. Populate all fields of the output schema.
If no specific items are found for an array (e.g., no problems identified), return an empty array for that field.
The 'formId' and 'formTitle' in the output should match the input.
`,
});

const formAnalysisReportFlow = ai.defineFlow(
  {
    name: 'formAnalysisReportFlow',
    inputSchema: FormAnalysisReportInputSchema,
    outputSchema: FormAnalysisReportOutputSchema,
  },
  async (input: FormAnalysisReportInput): Promise<FormAnalysisReportOutput> => {
    const {output} = await formAnalysisPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate an analysis report.");
    }
    // Ensure the output formId and formTitle match the input, as per prompt instructions
    return {
      ...output,
      formId: input.formId,
      formTitle: input.formTitle,
    };
  }
);
