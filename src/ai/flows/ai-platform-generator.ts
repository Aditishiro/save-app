
'use server';
/**
 * @fileOverview An AI agent that generates a complete platform structure from a user's prompt.
 *
 * - generatePlatformFromPrompt - A function that handles the platform generation process.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { GlobalComponentDefinition, PlatformComponentInstance } from '@/platform-builder/data-models';
import { 
    GeneratePlatformFromPromptInputSchema,
    type GeneratePlatformFromPromptInput,
    GeneratePlatformFromPromptOutputSchema,
    type GeneratePlatformFromPromptOutput
} from './ai-platform-generator-types';


// Tool to fetch available global components from Firestore
const getAvailableGlobalComponentsTool = ai.defineTool(
  {
    name: 'getAvailableGlobalComponents',
    description: 'Retrieves the list of all available global UI components that can be used to build a platform. Use this to understand what building blocks are available.',
    inputSchema: z.object({}), // No input needed
    outputSchema: z.array(z.object({
      id: z.string(),
      displayName: z.string(),
      type: z.string(),
      description: z.string().optional(),
      tags: z.array(z.string()).optional(),
    })),
  },
  async () => {
    try {
      const componentsSnapshot = await getDocs(collection(db, 'components'));
      const componentsList = componentsSnapshot.docs.map(doc => {
        const data = doc.data() as GlobalComponentDefinition;
        return {
          id: data.id,
          displayName: data.displayName,
          type: data.type,
          description: data.description,
          tags: data.tags,
        };
      });
      return componentsList;
    } catch (error) {
      console.error("Error fetching global components:", error);
      // It's better to return an empty array than to throw, so the AI can still proceed, albeit with less information.
      return []; 
    }
  }
);


// The Genkit prompt for the platform generator
const platformGeneratorPrompt = ai.definePrompt({
  name: 'platformGeneratorPrompt',
  input: { schema: GeneratePlatformFromPromptInputSchema },
  output: { schema: GeneratePlatformFromPromptOutputSchema },
  tools: [getAvailableGlobalComponentsTool],
  prompt: `You are an expert AI Platform Architect specializing in financial technology. Your task is to design a complete software platform structure based on a user's prompt.

  **Process:**
  1.  **Analyze the User's Prompt:** Understand the core requirements, target users, and key features described in the user's prompt below.
      > User Prompt: "{{{prompt}}}"

  2.  **Discover Available Components:** Before designing, you MUST use the 'getAvailableGlobalComponents' tool to see the list of UI components you can use. This is your palette of building blocks. Do not invent components that are not in this list.

  3.  **Design the Platform Structure:** Create a logical structure for the platform. This includes:
      *   **Platform Details:** Devise a suitable name, description, and purpose for the platform.
      *   **Layouts:** Break the platform down into logical layouts (pages or views), such as a 'dashboard', 'settingsPage', 'productList', etc. Give each a unique ID and a friendly name.
      *   **Component Instances:** For each layout, select the most appropriate components from the available list.
          *   For each component instance, provide a unique ID.
          *   Set the 'definitionId' to the ID of the global component you are using.
          *   Set the 'type' to match the component's type.
          *   Populate 'configuredValues' with sensible text, labels, and settings that match the user's prompt. For example, for a button, set its 'label' and 'variant'. For a card, set its 'title' and 'description'. For a chart, configure its 'title', 'chartType', and 'dataKeys'.
          *   Assign an 'order' number for each component within a layout, starting from 0.

  4.  **Inspiration and Examples:** Use the following examples to guide your design for financial platforms.
      *   **Category: SME Finance Tools**
          *   *Prompt:* "Build a dashboard to monitor SME financial health including revenue, expenses, and net profit trends."
          *   *Ideal Components:* summary_cards, line_chart, file_upload
          *   *Key Features:* Monthly Revenue Tracking, Expense Categorization, Net Profit Visualization, Upload CSV of financial records.
      *   **Category: Investment & Wealth Dashboards**
          *   *Prompt:* "Create an investment portfolio dashboard that shows asset allocation and performance over time."
          *   *Ideal Components:* pie_chart, time_series_chart, filters
          *   *Key Features:* Asset Allocation by Type, Historical ROI Trends, Filter by Date and Asset Class.
      *   **Category: Risk Assessment / Credit Scoring**
          *   *Prompt:* "Design a credit risk scoring tool for underwriters to assess small business loan applications."
          *   *Ideal Components:* form, scorecard, api_integration
          *   *Key Features:* Credit Bureau Integration, Risk Score Calculation, Financial Document Upload.
      *   **Category: Regulatory Compliance Platforms**
          *   *Prompt:* "Generate an AML transaction monitoring dashboard with real-time alerts for suspicious activity."
          *   *Ideal Components:* real_time_feed, rule_engine, alert_generator
          *   *Key Features:* Transaction Rule Matching, Suspicious Activity Detection, Alert Workflow Management.
      *   **Category: Corporate Finance Analytics**
          *   *Prompt:* "Build a treasury management dashboard that visualizes cash positions and FX exposures across regions."
          *   *Ideal Components:* multi_currency_chart, forecast_table, risk_indicator
          *   *Key Features:* Real-Time Cash Visibility, FX Rate Integration, Cash Flow Forecasting.
      *   **Category: Retail Banking**
          *   *Prompt:* "Create a personal finance manager that helps users set budgets, track expenses, and save more."
          *   *Ideal Components:* budget_tracker, category_spending_graph, goal_progress_bar
          *   *Key Features:* Monthly Budget Setup, Spending Trend Analysis, Savings Goal Tracker.

  5.  **Generate the Output:** Format your entire response as a single JSON object that strictly adheres to the output schema. Ensure all fields are populated correctly. The entire platform structure, including layouts and all component instances, must be inside this single JSON object.
  `,
});

// The main flow function
const generatePlatformFlow = ai.defineFlow(
  {
    name: 'generatePlatformFlow',
    inputSchema: GeneratePlatformFromPromptInputSchema,
    outputSchema: GeneratePlatformFromPromptOutputSchema,
  },
  async (input) => {
    const { output } = await platformGeneratorPrompt(input);
    if (!output) {
      throw new Error("The AI failed to generate a platform structure.");
    }
    return output;
  }
);

// Exported wrapper function for client-side use
export async function generatePlatformFromPrompt(input: GeneratePlatformFromPromptInput): Promise<GeneratePlatformFromPromptOutput> {
  return generatePlatformFlow(input);
}
