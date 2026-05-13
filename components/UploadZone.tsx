'use client';

import { useState, useRef } from 'react';

interface UploadZoneProps {
  onTextExtracted: (text: string) => void;
  currentText: string;
}

export default function UploadZone({ onTextExtracted, currentText }: UploadZoneProps) {
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
      setError(err instanceof Error ? err.message : 'Failed to extract text from PDF');
      console.error('PDF upload error:', err);
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
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-risk-red hover:bg-red-50 transition"
        onClick={() => fileInputRef.current?.click()}
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
        
        <div className="text-3xl mb-2">📤</div>
        <p className="font-semibold text-gray-900">
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </p>
        <p className="text-sm text-gray-600">or drag and drop</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {currentText && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-safe-green text-sm">
          ✓ Contract text loaded ({currentText.length} characters)
        </div>
      )}
    </div>
  );
}
