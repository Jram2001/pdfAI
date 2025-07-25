import React from 'react';
import UploadPrompt, { type FileUploadError } from '../../../fetures/home/upload-prompt';
import { pdfjs } from 'react-pdf';
import ViewPDF from '../../../fetures/home/view-pdf';
import './home.css'
import Chat from '../../../fetures/home/chat';
export default function Home() {
    const [uploadedFile, setUploadedFile] = React.useState<File[]>([]);
    const [isFileUploaded, setIsFileUploaded] = React.useState(false);

    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const handleFileSelect = (files: FileList): void => {
        setIsFileUploaded(true);
        setUploadedFile(Array.from(files));
        console.log('Selected files:', Array.from(files));
    };

    const handleError = (error: FileUploadError): void => {
        console.error('Upload error:', error);
    };

    const handleBackToUpload = (): void => {
        setIsFileUploaded(false);
        setUploadedFile([]);
    };

    return (
        <>
            {!isFileUploaded ? (
                <UploadPrompt
                    onFileSelect={handleFileSelect}
                    onError={handleError}
                    maxFileSize={5}
                    acceptedTypes={['.pdf', '.doc', '.docx']}
                    className="max-w-md mx-auto"
                />
            ) : (
                <div className='w-full box-border h-1/1 flex relative'>
                    <div className='h-1/1 w-1/2 overflow-hidden relative'>
                        <Chat />
                    </div>

                    <div className="h-full w-1/2 flex items-center justify-center border-2 border-neutral-800 bg-neutral-800/40 rounded-2xl pdf-canvas-container">
                        <ViewPDF
                            pdfFiles={uploadedFile}
                            onBackToUpload={handleBackToUpload}
                        />
                    </div>
                </div>
            )}
        </>
    );
}
