import { config } from 'dotenv';
config();

import '@/ai/flows/transcribe-content.ts';
import '@/ai/flows/generate-content-summary.ts';
import '@/ai/flows/link-relevant-youtube-videos.ts';
import '@/ai/flows/create-mind-map.ts';
import '@/ai/flows/generate-flashcards.ts';
import '@/ai/flows/generate-quiz.ts';
import '@/ai/flows/detect-language.ts';
import '@/ai/tools/youtube-search-tool.ts';
