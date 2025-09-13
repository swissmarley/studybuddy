# StudyBuddy AI

StudyBuddy AI turns your learning materials into a complete, AI‑powered study kit. Upload documents, images, audio, or video and get a transcript, concise summary, flashcards, a mind map, practice quizzes, and relevant YouTube videos — plus a Notes section to capture your own thoughts while studying.

## Features
- Content upload: `.pdf`, `.md`, `.txt`, `.png`, `.jpg`, `.mp3`, `.mp4` (and `.docx`).
- Transcription: Converts audio/video to text for downstream analysis.
- Summarization: Concise, language‑aware summaries of the content.
- Flashcards: Key terms and definitions auto‑generated from your content.
- Mind map: Topic relationships laid out as a quick concept map.
- Quiz: Multiple‑choice questions with correct answers and distractors.
- YouTube links: Curated videos related to the topic for deeper learning.
- Notes: Built‑in notes area to take and keep personal study notes.
- Local kits: Study kits are saved to your browser’s local storage.

## How It Works
- Upload a file and the app extracts or transcribes text as needed.
- The AI generates a summary, flashcards, a mind map, a quiz, and finds related YouTube videos.
- Everything is organized into a single “Study Kit” you can revisit later.

## Tech
- Next.js (App Router) + TypeScript + Tailwind CSS
- Genkit with Google AI (Gemini) for LLM tasks
- YouTube Data API v3 for relevant video search

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- API keys:
  - `GEMINI_API_KEY=` for Google AI (Gemini)
  - `GOOGLE_API_KEY` for YouTube Data API v3

### Setup
1. Clone the repository and install dependencies:
   - `npm install`
2. Create a `.env.local` file in the project root with:
   - `GEMINI_API_KEY=your_gemini_api_key`
   - `GOOGLE_API_KEY=your_youtube_data_api_key`
3. Start the dev server:
   - `npm run dev`
4. Open the app at:
   - http://localhost:9002

(Optional) Genkit Dev UI for inspecting flows:
- `npm run genkit:dev`

## Usage
- Click “New Study Kit”, then drag & drop or select a file.
- Wait for analysis to complete, then explore:
  - Summary, Flashcards, Mind Map, Quiz, Transcription, YouTube Videos, and Notes.
- Study kits persist in your browser (localStorage). Delete a kit from the dashboard when you’re done.

## Supported File Types
- Documents: `.pdf`, `.md`, `.txt`, `.docx`
- Images: `.png`, `.jpg`
- Audio: `.mp3`
- Video: `.mp4`

Note: Very large files may take longer to process and can be limited by browser memory and provider limits.

## Privacy
- Files are handled in‑browser; AI features send content to the configured providers for processing.
- Study kits are stored in your browser’s local storage — no accounts required.

## Roadmap
- Export study kits (PDF/JSON)
- Improved mind map visualization
- Richer note‑taking (tags, search, export)
- Multi‑document kits and cross‑kit linking

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.