import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TranscriptionViewProps {
  transcription: string;
}

export default function TranscriptionView({ transcription }: TranscriptionViewProps) {
  if (!transcription) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No transcription available. This might be because you uploaded a text file.</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Full Transcription</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96 rounded-md border p-4">
          <p className="text-base leading-relaxed whitespace-pre-wrap">{transcription}</p>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
