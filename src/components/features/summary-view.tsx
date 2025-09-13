import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SummaryViewProps {
  summary: string;
}

export default function SummaryView({ summary }: SummaryViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-relaxed whitespace-pre-wrap">{summary}</p>
      </CardContent>
    </Card>
  );
}
