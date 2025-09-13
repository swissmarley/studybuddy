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
      const response = await youtube.search.list({
        key: process.env.GOOGLE_API_KEY,
        part: ['snippet'],
        q: input.query,
        type: ['video'],
        maxResults: 5,
        videoEmbeddable: "true",
      });

      const videos = response.data.items?.map((item) => ({
        id: item.id?.videoId || '',
        title: item.snippet?.title || '',
      })).filter(v => v.id) || [];

      return { videos };

    } catch (error) {
      console.error('YouTube search failed:', error);
      // Return an empty array in case of an API error
      return { videos: [] };
    }
  }
);
