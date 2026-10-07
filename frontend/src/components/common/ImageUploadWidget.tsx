'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, FileText, CheckCircle2, AlertCircle, Loader2, X, Link as LinkIcon } from 'lucide-react';
import { api } from '@/lib/api';

interface ImageUploadWidgetProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  acceptPdf?: boolean;
  required?: boolean;
  helpText?: string;
}

export const ImageUploadWidget: React.FC<ImageUploadWidgetProps> = ({
  value,
  onChange,
  label = 'Asset Image / File',
  placeholder = 'https://images.unsplash.com/... or upload local file',
  acceptPdf = false,
  required = false,
  helpText,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const res = await api.uploadFile(file);
      if (res.success && res.data?.url) {
        onChange(res.data.url);
        setUploadSuccess(true);
      } else {
        setUploadError(res.message || 'Upload failed');
      }
    } catch (err: any) {
      setUploadError(err.message || 'Network error while uploading');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const isPdf = value?.toLowerCase().endsWith('.pdf');

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
        <div className="flex items-center gap-2 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'upload'
                ? 'bg-brand-primary text-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`px-2 py-0.5 rounded-md transition-colors ${
              mode === 'url'
                ? 'bg-brand-primary text-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <div className="space-y-2">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-brand-primary/80 rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all bg-slate-50/50 hover:bg-rose-50/20 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept={acceptPdf ? 'image/*,application/pdf' : 'image/*'}
              className="hidden"
            />
            {uploading ? (
              <div className="flex flex-col items-center justify-center py-2">
                <Loader2 className="w-7 h-7 text-brand-primary animate-spin mb-2" />
                <span className="text-xs font-bold text-slate-700">Uploading file to server...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-1">
                <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-slate-500 group-hover:text-brand-primary mb-2 transition-colors">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-brand-primary">
                  Click or drag file here to upload
                </span>
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {acceptPdf ? 'Supported: JPG, PNG, WEBP, SVG or PDF (up to 15MB)' : 'Supported: JPG, PNG, WEBP, SVG (up to 15MB)'}
                </span>
              </div>
            )}
          </div>

          {/* Upload Status Alerts */}
          {uploadError && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}
          {uploadSuccess && (
            <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>File uploaded and attached successfully!</span>
            </div>
          )}
        </div>
      ) : (
        <div className="relative">
          <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-1 focus:ring-brand-primary font-mono"
          />
        </div>
      )}

      {/* Uploaded Preview Card */}
      {value && (
        <div className="flex items-center justify-between p-2.5 bg-slate-100 rounded-xl border border-slate-200 text-xs mt-2">
          <div className="flex items-center gap-2.5 overflow-hidden">
            {isPdf ? (
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            ) : (
              <img
                src={value}
                alt="Preview"
                className="w-10 h-8 object-cover rounded-lg bg-white border border-slate-200 flex-shrink-0"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <div className="overflow-hidden">
              <div className="font-semibold text-slate-800 truncate text-[11px]">{value}</div>
              <div className="text-[10px] text-slate-500">{isPdf ? 'PDF Document' : 'Image Asset'}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-rose-600 transition-colors flex-shrink-0 ml-2"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {helpText && <p className="text-[10px] text-slate-400">{helpText}</p>}
    </div>
  );
};
