import React, { useState } from 'react';
import UploadPrompt, { type FileUploadError } from '../../../fetures/home/upload-prompt';
import { pdfjs } from 'react-pdf';
import ViewPDF from '../../../fetures/home/view-pdf';
import './home.css'
import Chat from '../../../fetures/home/chat';
import { uploadPDF } from '../../../service/pdf-api';
import axios from 'axios';

// Defines the expected structure for the PDF upload response.
export interface UploadPDFResponse {
    message: string;
    totalPages: number;
    chunksStored: number;
}

export default function Home() {
    // State to manage the file(s) uploaded by the user.
    const [uploadedFile, setUploadedFile] = React.useState<File[]>([]);
    // State to control the display of either the upload prompt or the PDF viewer/chat.
    const [isFileUploaded, setIsFileUploaded] = React.useState(false);
    // State to store the initial message received after a successful PDF upload.
    const [initialMessage, setInitialMessage] = useState('');
    // State to store the loading boolean.
    const [isPdfUploading, setIsPdfUploading] = useState<boolean>(false);

    // Configures pdfjs worker source globally for PDF rendering.
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    /**
     * Handles the file selection event, updates UI, and uploads the selected PDF.
     * @param files The FileList object containing the selected files.
     */
    const handleFileSelect = async (files: FileList) => {
        const fileArray = Array.from(files);
        setUploadedFile(fileArray);
        setIsPdfUploading(true);
        try {
            const response = await uploadPDF(fileArray[0]);
            setIsPdfUploading(false);
            setInitialMessage(response.data.message);
            setIsFileUploaded(true);
        } catch (error) {
            setIsPdfUploading(false);
            if (axios.isAxiosError(error)) {
                console.error('Upload failed:', error.response?.data || error.message);
            } else {
                console.error('Unexpected error:', error);
            }
        }
    };

    /**
     * Callback for handling errors during file upload.
     * @param error Details of the file upload error.
     */
    const handleError = (error: FileUploadError): void => {
        console.error('Upload error:', error);
    };

    /**
     * Resets the UI to show the file upload prompt.
     */
    const handleBackToUpload = (): void => {
        setIsFileUploaded(false);
        setUploadedFile([]);
    };

    return (
        <>
            {/* Conditionally renders the UploadPrompt or the PDF viewer/chat layout. */}
            {!isFileUploaded ? (
                <UploadPrompt
                    onFileSelect={handleFileSelect}
                    isLoading={isPdfUploading}
                    onError={handleError}
                    maxFileSize={5}
                    acceptedTypes={['.pdf', '.doc', '.docx']}
                    className="max-w-md mx-auto"
                />
            ) : (
                <div className='w-full box-border h-1/1 flex relative'>
                    {/* Container for the Chat component, occupying half the width. */}
                    <div className='h-1/1 w-1/2 overflow-hidden relative'>
                        <Chat initialMessage={initialMessage} />
                    </div>

                    {/* Container for the PDF viewer, also occupying half the width. */}
                    <div className="h-full w-1/2 flex items-center justify-center bg-neutral-800/80 text-white border border-neutral-700/50 rounded-lg pdf-canvas-container">
                        <ViewPDF
                            pdfFiles={uploadedFile}
                            onBackToUpload={handleBackToUpload} />
                    </div>
                </div>
            )}
        </>
    );
}
