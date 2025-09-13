'use server';

/**
 * @fileOverview This file defines a Genkit flow for creating a mind map from uploaded content.
 *
 * It includes:
 * - createMindMap - A function that handles the mind map creation process.
 * - CreateMindMapInput - The input type for the createMindMap function.
 * - CreateMindMapOutput - The return type for the createMindMap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateMindMapInputSchema = z.object({
  content: z
    .string()
    .describe("The user's uploaded content (document, text, audio transcription, etc.)"),
});
export type CreateMindMapInput = z.infer<typeof CreateMindMapInputSchema>;

const CreateMindMapOutputSchema = z.object({
  mindMap: z
    .string()
    .describe("A textual representation of the mind map, outlining the main topics and their relationships."),
});
export type CreateMindMapOutput = z.infer<typeof CreateMindMapOutputSchema>;

export async function createMindMap(input: CreateMindMapInput): Promise<CreateMindMapOutput> {
  return createMindMapFlow(input);
}

const createMindMapPrompt = ai.definePrompt({
  name: 'createMindMapPrompt',
  input: {schema: CreateMindMapInputSchema},
  output: {schema: CreateMindMapOutputSchema},
  prompt: `You are an expert in creating mind maps from various content types.

  Analyze the following content and generate a mind map that visually represents the relationships between different topics. Return a textual representation of the mind map. The mind map must be in the same language as the provided content. Make sure to return a mindmap, not a request for more information.

  Content: {{{content}}}
  `,
});

const createMindMapFlow = ai.defineFlow(
  {
    name: 'createMindMapFlow',
    inputSchema: CreateMindMapInputSchema,
    outputSchema: CreateMindMapOutputSchema,
  },
  async input => {
    const {output} = await createMindMapPrompt(input);
    return output!;
  }
);
