'use client';

import { useState, useRef } from 'react';

interface UploadZoneProps {
  onTextExtracted: (text: string) => void;
  currentText: string;
}

export default function UploadZone({
  onTextExtracted,
  currentText,
}: UploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload file');
      }

      const data = await response.json();
      onTextExtracted(data.text);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to extract text from PDF'
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="rounded-lg border border-dashed border-border bg-surface-muted px-6 py-8 text-center cursor-pointer hover:border-border-strong hover:bg-surface-subtle transition-colors duration-200"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFileSelect(e.target.files[0]);
            }
          }}
          disabled={uploading}
          className="hidden"
        />

        <p className="text-sm font-medium text-ink mb-1">
          {uploading ? 'Uploading…' : 'Upload PDF'}
        </p>
        <p className="text-xs text-ink-muted">or drag and drop</p>
      </div>

      {error && (
        <p className="rounded-lg border border-risk-high-border bg-risk-high-bg px-3 py-2 text-sm text-risk-high">
          {error}
        </p>
      )}

      {currentText && (
        <p className="rounded-lg border border-risk-low-border bg-risk-low-bg px-3 py-2 text-sm text-risk-low">
          Contract text loaded ({currentText.length.toLocaleString()} characters)
        </p>
      )}
    </div>
  );
}
