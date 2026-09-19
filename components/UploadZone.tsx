'use client';

import { useState, useRef } from 'react';
import { MAX_PDF_BYTES } from '@/lib/limits';

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
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }

    if (file.size > MAX_PDF_BYTES) {
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
      setDragActive(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={[
          'rounded-xl border-2 border-dashed px-6 py-10 text-center cursor-pointer',
          'transition-all duration-300 ease-out',
          dragActive
            ? 'border-primary bg-primary-muted scale-[1.01] shadow-glow'
            : 'border-border bg-surface-muted hover:border-primary/40 hover:bg-surface-subtle hover:shadow-card',
          uploading ? 'pointer-events-none opacity-70' : '',
        ].join(' ')}
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

        <div
          className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border transition-transform duration-300 ${dragActive ? 'scale-110 border-primary/30' : ''}`}
        >
          {uploading ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-primary" />
          ) : (
            <svg
              className="h-5 w-5 text-ink-muted"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              />
            </svg>
          )}
        </div>

        <p className="text-sm font-medium text-ink mb-1">
          {uploading
            ? 'Uploading…'
            : dragActive
              ? 'Drop your PDF here'
              : 'Upload PDF'}
        </p>
        <p className="text-xs text-ink-muted">or drag and drop · max 10MB</p>
      </div>

      {error && (
        <p className="rounded-lg border border-risk-high-border bg-risk-high-bg px-3 py-2 text-sm text-risk-high animate-fade-in">
          {error}
        </p>
      )}

      {currentText && (
        <p className="rounded-lg border border-risk-low-border bg-risk-low-bg px-3 py-2 text-sm text-risk-low animate-fade-in">
          Contract text loaded ({currentText.length.toLocaleString()} characters)
        </p>
      )}
    </div>
  );
}
