'use server';
/**
 * @fileOverview Finds and links relevant YouTube videos related to the topic of the uploaded content.
 *
 * - linkRelevantYouTubeVideos - A function that handles the process of finding and linking relevant YouTube videos.
 * - LinkRelevantYouTubeVideosInput - The input type for the linkRelevantYouTubeVideos function.
 * - LinkRelevantYouTubeVideosOutput - The return type for the linkRelevantYouTubeVideos function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import {searchYoutube} from '../tools/youtube-search-tool';

const LinkRelevantYouTubeVideosInputSchema = z.object({
  topic: z.string().describe('The topic of the uploaded content.'),
  language: z.string().optional().describe('The language of the content, for providing relevant video results.'),
});
export type LinkRelevantYouTubeVideosInput = z.infer<typeof LinkRelevantYouTubeVideosInputSchema>;

const LinkRelevantYouTubeVideosOutputSchema = z.object({
  videoLinks: z.array(z.string().url()).describe('An array of relevant YouTube video links.'),
});
export type LinkRelevantYouTubeVideosOutput = z.infer<typeof LinkRelevantYouTubeVideosOutputSchema>;

export async function linkRelevantYouTubeVideos(input: LinkRelevantYouTubeVideosInput): Promise<LinkRelevantYouTubeVideosOutput> {
  return linkRelevantYouTubeVideosFlow(input);
}

const prompt = ai.definePrompt({
  name: 'linkRelevantYouTubeVideosPrompt',
  input: {schema: LinkRelevantYouTubeVideosInputSchema},
  output: {schema: LinkRelevantYouTubeVideosOutputSchema},
  tools: [searchYoutube],
  prompt: `You are an AI assistant designed to find relevant YouTube videos for a given topic.

  1. First, use the searchYoutube tool with a query based on the topic: '{{{topic}}}'.
  {{#if language}}The search query should be in '{{language}}'.{{/if}}
  
  2. The tool will return a list of videos with IDs and titles.
  
  3. From that list, select up to 3 of the most relevant videos.
  
  4. For each selected video, construct a full YouTube URL in the format "https://www.youtube.com/watch?v=VIDEO_ID", replacing VIDEO_ID with the id from the tool's output.

  5. Return the results as an array of these valid YouTube video URLs in the 'videoLinks' field.
  
  - The URLs must be in the standard "https://www.youtube.com/watch?v=VIDEO_ID" format.
  - Do not return shortened (youtu.be) or embed URLs.
  - Ensure the videos are public, not private, unlisted, or deleted, and can be played by anyone.
  `,
});

const linkRelevantYouTubeVideosFlow = ai.defineFlow({
    name: 'linkRelevantYouTubeVideosFlow',
    inputSchema: LinkRelevantYouTubeVideosInputSchema,
    outputSchema: LinkRelevantYouTubeVideosOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output?.videoLinks) {
        return { videoLinks: [] };
    }

    const youtubeWatchUrlRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/;
    const validLinks = output.videoLinks.filter(link => youtubeWatchUrlRegex.test(link));

    return { videoLinks: validLinks };
  }
);
