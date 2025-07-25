import React from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react';

interface UploadPromptProps {
    onFileSelect?: (files: FileList) => void;
    onError?: (error: FileUploadError) => void;
    maxFileSize?: number;
    acceptedTypes?: readonly string[];
    className?: string;
    disabled?: boolean;
}

interface FileUploadError {
    readonly type: 'size' | 'type' | 'general';
    readonly message: string;
    readonly file?: File;
}

const UploadPrompt: React.FC<UploadPromptProps> = ({
    onFileSelect,
    onError,
    maxFileSize = 10,
    acceptedTypes = ['.pdf'] as const,
    className = '',
    disabled = false
}) => {
    const [dragActive, setDragActive] = React.useState<boolean>(false);
    const [error, setError] = React.useState<FileUploadError | null>(null);

    const validateFile = (file: File): FileUploadError | null => {
        // Check file size
        const fileSizeMB: number = file.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
            return {
                type: 'size',
                message: `File size must be less than ${maxFileSize}MB`,
                file
            };
        }

        // Check file type
        const fileExtension: string = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
        if (!acceptedTypes.includes(fileExtension)) {
            return {
                type: 'type',
                message: `Only ${acceptedTypes.join(', ')} files are allowed`,
                file
            };
        }

        return null;
    };

    const handleFiles = React.useCallback((files: FileList | null): void => {
        if (!files || files.length === 0 || disabled) return;

        const file: File = files[0];
        const validationError: FileUploadError | null = validateFile(file);

        if (validationError) {
            setError(validationError);
            onError?.(validationError);
            return;
        }

        setError(null);
        onFileSelect?.(files);
    }, [disabled, maxFileSize, acceptedTypes, onFileSelect, onError]);

    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        handleFiles(event.target.files);
        event.target.value = '';
    };

    const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        if (!disabled) {
            setDragActive(true);
        }
    };

    const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragActive(false);
        }
    };

    const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setDragActive(false);
        if (!disabled) {
            handleFiles(event.dataTransfer.files);
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
            event.preventDefault();
            const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null;
            fileInput?.click();
        }
    };

    const clearError = (): void => {
        setError(null);
    };

    const containerClasses = React.useMemo((): string => {
        const baseClasses = `
      group relative cursor-pointer 
      dark:bg-[#090909] bg-white
      flex flex-col items-center justify-center 
      rounded-2xl border transition-all duration-300 ease-in-out
      p-12
    `;

        if (disabled) {
            return `${baseClasses} opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700`;
        }

        if (error) {
            return `${baseClasses} border-red-400 bg-red-50 dark:bg-red-900/20`;
        }

        if (dragActive) {
            return `${baseClasses} border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20`;
        }

        return `${baseClasses} border-gray-300 dark:border-gray-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-400 dark:hover:border-indigo-400`;
    }, [disabled, error, dragActive]);

    const iconClasses = React.useMemo((): string => {
        const baseClasses = 'mb-6 p-4 border-2 rounded-full transition-all duration-300';

        if (error) {
            return `${baseClasses} border-red-400 text-red-400`;
        }

        if (dragActive) {
            return `${baseClasses} border-indigo-400 text-indigo-400`;
        }

        return `${baseClasses} border-gray-300 dark:border-gray-600 group-hover:border-indigo-400 group-hover:text-indigo-400`;
    }, [error, dragActive]);

    return (
        <div
            className={`${containerClasses} ${className}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled ? -1 : 0}
            aria-label={disabled ? "Upload disabled" : "Upload PDF file"}
            aria-describedby={error ? "upload-error" : "upload-description"}
            aria-disabled={disabled}
        >
            {/* Hidden file input */}
            <input
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Choose PDF file"
                disabled={disabled}
                multiple={false}
            />

            {/* Upload icon */}
            <div className={iconClasses}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`
            w-8 h-8 transition-colors duration-300
            ${error
                            ? 'text-red-400'
                            : 'text-gray-600 dark:text-gray-400 group-hover:text-indigo-400'
                        }
          `}
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M11.47 2.47a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06l-3.22-3.22V16.5a.75.75 0 0 1-1.5 0V4.81L8.03 8.03a.75.75 0 0 1-1.06-1.06l4.5-4.5ZM3 15.75a.75.75 0 0 1 .75.75v2.25a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V16.5a.75.75 0 0 1 1.5 0v2.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V16.5a.75.75 0 0 1 .75-.75Z"
                        clipRule="evenodd"
                    />
                </svg>
            </div>

            {/* Main text */}
            <h2 className="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-200 text-center">
                Upload <span className="text-indigo-500">PDF</span> to start chatting
            </h2>

            {/* Subtitle */}
            <p
                id="upload-description"
                className="text-sm text-gray-600 dark:text-gray-400 text-center"
            >
                {disabled ? 'Upload is currently disabled' : 'Click or drag and drop your file here'}
            </p>

            {/* File type hint */}
            {!error && (
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    Supports {acceptedTypes.join(', ')} files up to {maxFileSize}MB
                </p>
            )}

            {/* Error message */}
            {error && (
                <div id="upload-error" className="mt-4 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 text-center">
                        {error.message}
                    </p>
                    <button
                        onClick={clearError}
                        className="mt-2 text-xs text-red-500 hover:text-red-700 underline"
                        type="button"
                    >
                        Dismiss
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPrompt;

// Export types for external use
export type { UploadPromptProps, FileUploadError };
