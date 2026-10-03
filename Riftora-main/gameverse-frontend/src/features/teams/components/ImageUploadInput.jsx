import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

export const ImageUploadInput = ({ label, helperText, maxSizeMB, accept, value, onChange, error }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState('');

  const validateFile = (file) => {
    setLocalError('');
    if (!file) return false;

    // Check size
    const sizeMB = file.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      setLocalError(`Image is too large. Maximum file size is ${maxSizeMB} MB.`);
      return false;
    }

    // Check type
    const validTypes = accept.split(',').map(t => t.trim());
    if (!validTypes.includes(file.type)) {
      setLocalError(`Unsupported image format. Use JPG, PNG, or WebP.`);
      return false;
    }

    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      const url = URL.createObjectURL(file);
      onChange({ file, url });
    } else if (!file) {
      onChange(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      const url = URL.createObjectURL(file);
      onChange({ file, url });
    }
  };

  const clearFile = (e) => {
    e.stopPropagation();
    if (fileInputRef.current) fileInputRef.current.value = '';
    onChange(null);
    setLocalError('');
  };

  const displayError = error || localError;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      
      {!value ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer
            transition-colors duration-200
            ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-900/50 hover:border-slate-600 hover:bg-slate-800'}
            ${displayError ? 'border-red-500/50 bg-red-500/5' : ''}
          `}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3">
            <Upload className="w-5 h-5 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-white mb-1">Upload {label.toLowerCase()}</p>
          <p className="text-xs text-slate-500">{helperText}</p>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-700 bg-slate-900/50">
          <div className="w-16 h-16 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center">
            {value.url ? (
              <img src={value.url} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-500" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {value.file?.name || 'Uploaded File'}
            </p>
            <p className="text-xs text-slate-500">
              {value.file?.size ? (value.file.size / 1024).toFixed(1) + ' KB' : 'Preview'}
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 px-3 py-1.5 rounded bg-blue-500/10 hover:bg-blue-500/20 transition-colors"
            >
              Change
            </button>
            <button
              type="button"
              onClick={clearFile}
              className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              aria-label="Remove"
            >
              <X className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {displayError && (
        <p className="text-red-400 text-sm mt-1">{displayError}</p>
      )}
    </div>
  );
};
