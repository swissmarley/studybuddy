import { BookOpenCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  className?: string;
}

export default function AppLogo({ className }: AppLogoProps) {
  return (
    <div className={cn("flex items-center gap-2 text-primary", className)}>
      <BookOpenCheck className="h-8 w-8" />
      <span className="text-2xl font-bold text-foreground group-data-[collapsible=icon]:hidden">
        StudyBuddy AI
      </span>
    </div>
  );
}
