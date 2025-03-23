import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, File, Image, FileText, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileSelect: (files: File[]) => void;
  onFileRemove?: (file: File) => void;
  accept?: string[];
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  preview?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

const FileUploader = ({
  onFileSelect,
  onFileRemove,
  accept = [],
  multiple = false,
  maxSize,
  maxFiles = 5,
  preview = true,
  disabled = false,
  className,
  error
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateFile = (file: File): string | null => {
    if (accept.length > 0 && !accept.some(type => file.type.match(type))) {
      return `Le type de fichier ${file.type} n'est pas accepté`;
    }
    if (maxSize && file.size > maxSize) {
      return `La taille du fichier dépasse la limite de ${formatBytes(maxSize)}`;
    }
    return null;
  };

  const handleFiles = useCallback((fileList: FileList) => {
    if (disabled) return;

    const newFiles: File[] = Array.from(fileList);
    const errors: string[] = [];
    const validFiles: File[] = [];

    newFiles.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(error);
      } else if (files.length + validFiles.length < maxFiles) {
        validFiles.push(file);
      } else {
        errors.push(`Nombre maximum de fichiers (${maxFiles}) atteint`);
      }
    });

    if (validFiles.length > 0) {
      const updatedFiles = multiple ? [...files, ...validFiles] : [validFiles[0]];
      setFiles(updatedFiles);
      onFileSelect(updatedFiles);
    }

    setFileErrors(errors);
  }, [files, maxFiles, multiple, disabled, accept, maxSize, onFileSelect]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter(file => file !== fileToRemove);
    setFiles(updatedFiles);
    onFileRemove?.(fileToRemove);
    onFileSelect(updatedFiles);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image;
    if (file.type.includes('pdf')) return FileText;
    return File;
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  return (
    <div className={className}>
      <div
        className={cn(
          'relative',
          'border-2 border-dashed rounded-lg',
          'p-8',
          'transition-colors duration-200',
          isDragging
            ? 'border-[#1E3A8A] bg-[#1E3A8A]/5'
            : 'border-gray-300 dark:border-gray-600',
          disabled && 'opacity-50 cursor-not-allowed',
          error && 'border-red-500'
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileInput}
          accept={accept.join(',')}
          multiple={multiple}
          disabled={disabled}
        />

        <div className="flex flex-col items-center text-center">
          <Upload
            className={cn(
              'w-12 h-12 mb-4',
              isDragging ? 'text-[#1E3A8A]' : 'text-gray-400'
            )}
          />
          <p className="mb-2 text-sm text-gray-700 dark:text-gray-300">
            <button
              type="button"
              onClick={() => !disabled && fileInputRef.current?.click()}
              className="text-[#1E3A8A] hover:underline focus:outline-none"
            >
              Cliquez pour télécharger
            </button>
            {' ou glissez-déposez'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {accept.length > 0 && `Types acceptés : ${accept.join(', ')} • `}
            {maxSize && `Taille max : ${formatBytes(maxSize)} • `}
            {multiple && `Max ${maxFiles} fichiers`}
          </p>
        </div>
      </div>

      {/* File Errors */}
      <AnimatePresence>
        {(fileErrors.length > 0 || error) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2"
          >
            {error && (
              <div className="flex items-center text-red-500 text-sm mb-2">
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            )}
            {fileErrors.map((error, index) => (
              <div
                key={index}
                className="flex items-center text-red-500 text-sm"
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                {error}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* File List */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 space-y-2"
          >
            {files.map((file, index) => {
              const FileIcon = getFileIcon(file);
              const previewUrl = preview ? getFilePreview(file) : null;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={cn(
                    'flex items-center p-3',
                    'bg-gray-50 dark:bg-gray-800',
                    'rounded-lg'
                  )}
                >
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <FileIcon className="w-6 h-6 text-gray-400" />
                  )}
                  <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formatBytes(file.size)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFile(file)}
                    className="p-1 ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploader;
