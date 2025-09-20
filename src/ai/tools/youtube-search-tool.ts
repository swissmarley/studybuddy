'use server';

import {ai} from '@/ai/genkit';
import {google} from 'googleapis';
import {z} from 'zod';

const youtube = google.youtube('v3');

export const searchYoutube = ai.defineTool(
  {
    name: 'searchYoutube',
    description: 'Searches YouTube for videos based on a query.',
    inputSchema: z.object({
      query: z.string().describe('The search query.'),
    }),
    outputSchema: z.object({
      videos: z.array(
        z.object({
          id: z.string().describe('The YouTube video ID.'),
          title: z.string().describe('The title of the video.'),
        })
      ),
    }),
  },
  async (input) => {
    try {
      console.log(`[YouTube Tool] Searching for: "${input.query}"`);
      console.log(`[YouTube Tool] API Key available: ${process.env.GOOGLE_API_KEY ? 'YES' : 'NO'}`);
      
      const response = await youtube.search.list({
        key: process.env.GOOGLE_API_KEY,
        part: ['snippet'],
        q: input.query,
        type: ['video'],
        maxResults: 5,
        order: 'relevance',
        safeSearch: 'moderate',
      });

      console.log(`[YouTube Tool] API Response status: ${response.status}`);
      
      const videos = response.data.items?.map((item) => ({
        id: item.id?.videoId || '',
        title: item.snippet?.title || '',
      })).filter(v => v.id) || [];

      console.log(`[YouTube Tool] Search for "${input.query}" returned ${videos.length} videos`);
      if (videos.length > 0) {
        console.log(`[YouTube Tool] First video: ${videos[0].title} (${videos[0].id})`);
      }
      
      return { videos };

    } catch (error) {
      console.error('[YouTube Tool] Search failed:', error);
      if (error instanceof Error) {
        console.error('[YouTube Tool] Error message:', error.message);
      }
      if (error.response) {
        console.error('[YouTube Tool] Response status:', error.response.status);
        console.error('[YouTube Tool] Response data:', JSON.stringify(error.response.data, null, 2));
      }
      // Return an empty array in case of an API error
      return { videos: [] };
    }
  }
);
