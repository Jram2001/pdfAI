/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import type { ChangeEvent, DragEvent, KeyboardEvent } from 'react';
import type { UploadPromptProps, FileUploadError } from '../../types/global-types';

const UploadPrompt: React.FC<UploadPromptProps> = ({
    onFileSelect,
    onError,
    isLoading,
    maxFileSize = 10,
    acceptedTypes = ['.pdf'] as const,
    className = '',
    disabled = false
}) => {
    const [dragActive, setDragActive] = React.useState<boolean>(false);
    const [error, setError] = React.useState<FileUploadError | null>(null);

    // Validates size and extension of the uploaded file
    const validateFile = (file: File): FileUploadError | null => {
        const fileSizeMB: number = file.size / (1024 * 1024);
        if (fileSizeMB > maxFileSize) {
            return {
                type: 'size',
                message: `File size must be less than ${maxFileSize}MB`,
                file
            };
        }

        // Extract file extension and check against acceptedTypes
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

    // Handles all file selection logic (input, drop, etc.)
    const handleFiles = React.useCallback((files: FileList | null): void => {
        if (!files || files.length === 0 || disabled || isLoading) return;

        const file: File = files[0];
        const validationError: FileUploadError | null = validateFile(file);

        if (validationError) {
            setError(validationError);
            onError?.(validationError);
            return;
        }

        setError(null);
        onFileSelect?.(files);
    }, [disabled, isLoading, maxFileSize, acceptedTypes, onFileSelect, onError]);

    // Handles input change (file selection via dialog)
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>): void => {
        handleFiles(event.target.files);
        event.target.value = ''; // Allows selecting same file again
    };

    // Set dragActive state when file is dragged over the dropzone
    const handleDragOver = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        if (!disabled && !isLoading) {
            setDragActive(true);
        }
    };

    // Remove dragActive state when drag leaves the dropzone
    const handleDragLeave = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        // Only remove drag state if truly leaving the container
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDragActive(false);
        }
    };

    // Process dropped files
    const handleDrop = (event: DragEvent<HTMLDivElement>): void => {
        event.preventDefault();
        setDragActive(false);
        if (!disabled && !isLoading) {
            handleFiles(event.dataTransfer.files);
        }
    };

    // Supports keyboard-triggering the upload input (accessibility)
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>): void => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled && !isLoading) {
            event.preventDefault();
            // Programmatically trigger the file input
            const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null;
            fileInput?.click();
        }
    };

    const clearError = (): void => {
        setError(null);
    };

    // Styling based on state (disabled, error, active, loading) - Dark mode only
    const containerClasses = React.useMemo((): string => {
        const baseClasses = `
      group relative cursor-pointer 
      bg-[#090909]
      flex flex-col items-center justify-center 
      rounded-2xl border transition-all duration-300 ease-in-out
      p-12
    `;

        if (disabled || isLoading) {
            return `${baseClasses} opacity-50 cursor-not-allowed border-gray-700`;
        }

        if (error) {
            return `${baseClasses} border-red-400 bg-red-900/20`;
        }

        if (dragActive) {
            return `${baseClasses} border-indigo-400 bg-indigo-900/20`;
        }

        return `${baseClasses} border-gray-600 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-400`;
    }, [disabled, isLoading, error, dragActive]);

    const iconClasses = React.useMemo((): string => {
        const baseClasses = 'mb-6 p-4 border-2 rounded-full transition-all duration-300';

        if (error) {
            return `${baseClasses} border-red-400 text-red-400`;
        }

        if (isLoading) {
            return `${baseClasses} border-indigo-400 text-indigo-400`;
        }

        if (dragActive) {
            return `${baseClasses} border-indigo-400 text-indigo-400`;
        }

        return `${baseClasses} border-gray-600 group-hover:border-indigo-400 group-hover:text-indigo-400`;
    }, [error, isLoading, dragActive]);

    // Loading spinner component
    const LoadingSpinner = () => (
        <svg
            className="w-8 h-8 animate-spin text-indigo-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
        </svg>
    );

    // Upload icon component
    const UploadIcon = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`
                w-8 h-8 transition-colors duration-300
                ${error
                    ? 'text-red-400'
                    : 'text-gray-400 group-hover:text-indigo-400'
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
    );

    return (
        <div
            className={`${containerClasses} ${className}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={disabled || isLoading ? -1 : 0}
            aria-label={
                isLoading
                    ? "Processing upload..."
                    : disabled
                        ? "Upload disabled"
                        : "Upload PDF file"
            }
            aria-describedby={error ? "upload-error" : "upload-description"}
            aria-disabled={disabled || isLoading}
        >
            {/* Hidden file input overlays the drop area */}
            <input
                type="file"
                accept={acceptedTypes.join(',')}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Choose PDF file"
                disabled={disabled || isLoading}
                multiple={false}
            />

            {/* Icon - Upload or Loading spinner */}
            <div className={iconClasses}>
                {isLoading ? <LoadingSpinner /> : <UploadIcon />}
            </div>

            {/* Title - changes based on loading state */}
            <h2 className="mb-2 text-xl font-semibold text-gray-200 text-center">
                {isLoading ? (
                    <>Processing your <span className="text-indigo-500">PDF</span>...</>
                ) : (
                    <>Upload <span className="text-indigo-500">PDF</span> to start chatting</>
                )}
            </h2>

            {/* Description - changes based on state */}
            <p
                id="upload-description"
                className="text-sm text-gray-400 text-center"
            >
                {isLoading
                    ? 'Please wait while we process your file'
                    : disabled
                        ? 'Upload is currently disabled'
                        : 'Click or drag and drop your file here'
                }
            </p>

            {/* File type and size info (only shows when not loading and no error) */}
            {!error && !isLoading && (
                <p className="mt-2 text-xs text-gray-500">
                    Supports {acceptedTypes.join(', ')} files up to {maxFileSize}MB
                </p>
            )}

            {/* Loading progress indicator */}
            {isLoading && (
                <div className="mt-4 w-full max-w-xs">
                    <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full animate-pulse"></div>
                    </div>
                </div>
            )}

            {/* Shows validation error if any */}
            {error && !isLoading && (
                <div id="upload-error" className="mt-4 p-3 bg-red-900/30 rounded-lg">
                    <p className="text-sm text-red-400 text-center">
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

// Types available for module consumers
export type { UploadPromptProps, FileUploadError };
