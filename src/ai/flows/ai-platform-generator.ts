
'use server';
/**
 * @fileOverview An AI agent that generates a complete platform structure from a user's prompt.
 *
 * - generatePlatformFromPrompt - A function that handles the platform generation process.
 * - GeneratePlatformFromPromptInput - The input type for the function.
 * - GeneratePlatformFromPromptOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import type { GlobalComponentDefinition, PlatformComponentInstance } from '@/platform-builder/data-models';

// Schemas for the AI Flow
export const GeneratePlatformFromPromptInputSchema = z.object({
  prompt: z.string().describe("The user's request describing the platform they want to build."),
});
export type GeneratePlatformFromPromptInput = z.infer<typeof GeneratePlatformFromPromptInputSchema>;

export const GeneratePlatformFromPromptOutputSchema = z.object({
  platformName: z.string().describe("A suitable name for the generated platform."),
  platformDescription: z.string().describe("A brief description of the platform's purpose."),
  platformPurpose: z.string().describe("The primary purpose or category of the platform (e.g., 'Online Banking Portal', 'Loan Origination System')."),
  layouts: z.array(z.object({
      id: z.string().describe("A unique, descriptive ID for the layout (e.g., 'dashboard', 'profileSettings')."),
      name: z.string().describe("A user-friendly name for the layout (e.g., 'Main Dashboard', 'Profile Settings')."),
      componentInstances: z.array(z.object({
        id: z.string().describe("A unique ID for this component instance."),
        definitionId: z.string().describe("The ID of the global component definition to use."),
        type: z.string().describe("The type of the component, denormalized from the definition."),
        configuredValues: z.record(z.any()).describe("An object of key-value pairs for the component's configurable properties."),
        order: z.number().describe("The display order of the component within the layout, starting from 0.")
      })).describe("The list of component instances for this layout.")
  })).describe("An array of layouts for the platform.")
});
export type GeneratePlatformFromPromptOutput = z.infer<typeof GeneratePlatformFromPromptOutputSchema>;


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
  prompt: `You are an expert AI Platform Architect. Your task is to design a complete software platform structure based on a user's prompt.

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
          *   Populate 'configuredValues' with sensible text, labels, and settings that match the user's prompt. For example, for a button, set its 'label' and 'variant'. For a card, set its 'title' and 'description'.
          *   Assign an 'order' number for each component within a layout, starting from 0.

  4.  **Generate the Output:** Format your entire response as a single JSON object that strictly adheres to the output schema. Ensure all fields are populated correctly. The entire platform structure, including layouts and all component instances, must be inside this single JSON object.
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
