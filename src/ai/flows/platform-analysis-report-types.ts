
// src/ai/flows/platform-analysis-report-types.ts
'use server';
import { z } from 'genkit';

export const PlatformAnalysisReportInputSchema = z.object({
  platformId: z.string().describe("The unique identifier of the platform being analyzed."),
  platformName: z.string().describe("The name or title of the platform."),
  platformPurpose: z.string().describe("The stated purpose or type of the platform (e.g., Core Banking System, Loan Origination)."),
  platformStructure: z.string().describe('A JSON string representing the platform\'s structure, including layouts, component instances, configurations, and potentially user flows or data models.'),
  currentProblems: z.string().optional().describe("Optional: User-described current problems, pain points, or challenges with the platform's architecture, performance, or usability."),
});
export type PlatformAnalysisReportInput = z.infer<typeof PlatformAnalysisReportInputSchema>;

export const PlatformAnalysisReportOutputSchema = z.object({
  platformId: z.string().describe("The ID of the analyzed platform."),
  platformName: z.string().describe("The name of the analyzed platform."),
  currentArchitectureAnalysis: z.string().describe("In-depth analysis of the platform's current architecture, including its layouts, component choices, data flow, technology stack considerations, and how well it aligns with its stated purpose."),
  identifiedIssues: z.array(z.object({
    issue: z.string().describe("A specific issue, bottleneck, potential risk, or area of inefficiency identified in the platform's architecture or implementation."),
    severity: z.enum(["Low", "Medium", "High"]).describe("The estimated severity or potential impact of the identified issue."),
    impactArea: z.string().describe("The primary area impacted by this issue (e.g., Scalability, User Experience, Maintainability, Security, Integration Capabilities, Performance, Cost-efficiency).")
  })).describe("List of identified issues, bottlenecks, and architectural concerns with their severity and impact area."),
  improvementSuggestions: z.array(z.object({
    issueDescription: z.string().optional().describe("Brief description of the issue this suggestion addresses, if linked to one from 'identifiedIssues'."),
    suggestion: z.string().describe("A specific, actionable suggestion to address an identified issue or to enhance the platform's architecture, performance, or features."),
    rationale: z.string().describe("Reasoning behind why this improvement is recommended, its expected benefits, and how it addresses the issue or aligns with best practices."),
    effortLevel: z.enum(["Low", "Medium", "High"]).optional().describe("Estimated effort level (Low, Medium, High) to implement this suggestion."),
  })).describe("Suggestions for architectural improvements, feature enhancements, or addressing specific problems."),
  marketResearchSummary: z.string().describe("A summary of relevant market research, industry trends, competitor activities, and technological innovations pertinent to the platform's domain (e.g., trends in core banking systems, innovations in loan origination UX). This should be informed by using appropriate tools."),
  futureStateVision: z.object({
    concept: z.string().describe("A conceptual description of a potential future state for the platform, aiming to make it more robust, scalable, user-centric, and aligned with market trends or future business needs."),
    keyChanges: z.array(z.string()).describe("List of key architectural changes, new technologies to adopt, features to develop, or strategic shifts proposed for this future state."),
    strategicAlignment: z.string().describe("Explanation of how this proposed future state aligns with broader business objectives, such as improving market competitiveness, increasing operational efficiency, enabling new business models, or enhancing customer value."),
  }).describe("A strategic vision for the future state of the platform, including key proposed changes and their strategic alignment."),
});
export type PlatformAnalysisReportOutput = z.infer<typeof PlatformAnalysisReportOutputSchema>;
