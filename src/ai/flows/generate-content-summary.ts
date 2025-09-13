'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a summary of uploaded content.
 *
 * The flow takes content as input and returns a concise summary.
 * - generateContentSummary - A function that calls the flow.
 * - GenerateContentSummaryInput - The input type for the generateContentSummary function.
 * - GenerateContentSummaryOutput - The return type for the generateContentSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentSummaryInputSchema = z.object({
  content: z
    .string()
    .describe('The content to summarize, can be text, or transcription of audio/video.'),
});
export type GenerateContentSummaryInput = z.infer<typeof GenerateContentSummaryInputSchema>;

const GenerateContentSummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the content.'),
});
export type GenerateContentSummaryOutput = z.infer<typeof GenerateContentSummaryOutputSchema>;

export async function generateContentSummary(
  input: GenerateContentSummaryInput
): Promise<GenerateContentSummaryOutput> {
  return generateContentSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentSummaryPrompt',
  input: {schema: GenerateContentSummaryInputSchema},
  output: {schema: GenerateContentSummaryOutputSchema},
  prompt: `Summarize the following content in a concise manner. The summary must be in the same language as the original content.\n\n{{content}}`,
});

const generateContentSummaryFlow = ai.defineFlow(
  {
    name: 'generateContentSummaryFlow',
    inputSchema: GenerateContentSummaryInputSchema,
    outputSchema: GenerateContentSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
