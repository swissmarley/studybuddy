'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, LoaderCircle, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onProcess: (file: File) => void;
  isProcessing: boolean;
}

export default function FileUpload({ onProcess, isProcessing }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
        'text/plain': ['.txt'],
        'text/markdown': ['.md'],
        'application/pdf': ['.pdf'],
        'application/msword': ['.doc'],
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
        'audio/*': ['.mp3', '.wav', '.m4a'],
        'video/*': ['.mp4', '.mov', '.avi'],
      },
  });

  const handleProcessClick = () => {
    if (file) {
      onProcess(file);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div
        {...getRootProps()}
        className={cn(
          'w-full max-w-lg border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors',
          isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <UploadCloud className="h-12 w-12 text-primary" />
          {isDragActive ? (
            <p>Drop the file here ...</p>
          ) : (
            <p>Drag & drop a file here, or click to select a file</p>
          )}
          <p className="text-xs">Supported: Documents, Images, Audio, Video</p>
        </div>
      </div>

      {file && !isProcessing && (
        <div className="mt-4 p-4 border rounded-md w-full max-w-lg flex items-center justify-between bg-secondary/50">
            <div className='flex items-center gap-2'>
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">{file.name}</span>
            </div>
          <Button onClick={handleProcessClick} disabled={isProcessing}>
            Analyze File
          </Button>
        </div>
      )}

      {isProcessing && (
         <div className="mt-4 p-4 w-full max-w-lg flex items-center justify-center gap-2 text-primary">
            <LoaderCircle className="h-6 w-6 animate-spin" />
            <span className="text-lg font-semibold">Analyzing your content...</span>
        </div>
      )}
    </div>
  );
}
