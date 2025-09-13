'use server';

/**
 * @fileOverview A content transcription AI agent.
 *
 * - transcribeContent - A function that handles the content transcription process.
 * - TranscribeContentInput - The input type for the transcribeContent function.
 * - TranscribeContentOutput - The return type for the transcribeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranscribeContentInputSchema = z.object({
  mediaDataUri: z
    .string()
    .describe(
      'The audio or video content to transcribe, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' 
    ),
});
export type TranscribeContentInput = z.infer<typeof TranscribeContentInputSchema>;

const TranscribeContentOutputSchema = z.object({
  transcription: z
    .string()
    .describe('The transcription of the audio or video content.'),
});
export type TranscribeContentOutput = z.infer<typeof TranscribeContentOutputSchema>;

export async function transcribeContent(input: TranscribeContentInput): Promise<TranscribeContentOutput> {
  return transcribeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'transcribeContentPrompt',
  input: {schema: TranscribeContentInputSchema},
  output: {schema: TranscribeContentOutputSchema},
  prompt: `You are an expert transcriptionist. You will transcribe the provided audio or video content to text.

Content: {{media url=mediaDataUri}}`,
});

const transcribeContentFlow = ai.defineFlow(
  {
    name: 'transcribeContentFlow',
    inputSchema: TranscribeContentInputSchema,
    outputSchema: TranscribeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
