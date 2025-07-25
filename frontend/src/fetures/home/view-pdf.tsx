import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';

import './view-pdf.css';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';
import { useActiveNumber } from '../../service/activePage';

interface PDFViewerProps {
    /** Array of PDF files to display */
    pdfFiles: File[];
    /** Optional callback to trigger when user navigates back to upload view */
    onBackToUpload?: () => void;
    /** Page number to display initially (zero-based) */
}

/**
 * Professional PDF Viewer component with single-page viewing.
 * Supports PDF highlight plugin (disabled by default), dynamic PDF loading,
 * and optional back navigation.
 */
const ViewPDF: React.FC<PDFViewerProps> = ({
    pdfFiles,
}) => {
    const { activeNumber } = useActiveNumber();
    /** Index of currently displayed file */
    const [currentFileIndex] = useState<number>(0);
    /** Object URL for current file */
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    /** Currently viewed page */
    const [currentPage, setCurrentPage] = useState<number>(activeNumber);
    /** Indicates if PDF document is loaded */
    const [isDocumentLoaded, setIsDocumentLoaded] = useState<boolean>(false);

    /** Ref to the PDF Viewer container for DOM observation */
    const viewerContainerRef = useRef<HTMLDivElement>(null);

    /** Currently loaded PDF file */
    const currentFile = pdfFiles[currentFileIndex];

    /**
     * Highlight plugin instance.
     * Disabled by default (customize trigger as needed).
     */
    const highlightPluginInstance = highlightPlugin({
        trigger: Trigger.None,
    });

    /**
     * Shows only the specified page in the viewer.
     * @param pageIndex - Page number to show (zero-based)
     */
    const showPage = useCallback((pageIndex: number) => {
        const pages = document.querySelectorAll('.rpv-core__inner-page-container');
        pages.forEach((el, idx) => {
            (el as HTMLElement).style.display = idx === pageIndex ? 'block' : 'none';
        });
    }, []);

    /**
     * Navigates to a specific page if document is loaded.
     * @param pageIndex - Page number (zero-based)
     */
    const goToPage = useCallback(
        (pageIndex: number) => {
            setCurrentPage(pageIndex);
            if (isDocumentLoaded) {
                showPage(pageIndex);
            }
        },
        [isDocumentLoaded, showPage]
    );

    useEffect(() => {
        // Only call if document loaded, activeNumber valid, and different from currentPage
        if (isDocumentLoaded && typeof activeNumber === 'number' && activeNumber !== currentPage) {
            goToPage(activeNumber);
        }
    }, [activeNumber, isDocumentLoaded, goToPage, currentPage]);


    /**
     * Hides all inner PDF pages, except for the active one.
     */
    const hideAllPages = useCallback(() => {
        const pages = document.querySelectorAll('.rpv-core__inner-page-container');
        pages.forEach((el, idx) => {
            const pageEl = el as HTMLElement;
            if (idx === currentPage) {
                pageEl.style.display = 'block';
                pageEl.style.position = '';
                pageEl.style.top = '';
                pageEl.style.left = '';
                pageEl.style.transform = '';
            } else {
                pageEl.style.display = 'none';
                pageEl.style.position = 'absolute';
                pageEl.style.top = '0px';
                pageEl.style.left = '0px';
                pageEl.style.transform = 'translateY(0px)';
            }
        });
    }, [currentPage]);

    /**
     * Handler called on PDF document load.
     */
    const handleDocumentLoad = useCallback(() => {
        setIsDocumentLoaded(true);
    }, []);


    /**
     * Generates PDF file URL on file change and handles cleanup.
     */
    useEffect(() => {
        if (currentFile && currentFile.type === 'application/pdf') {
            const url = URL.createObjectURL(currentFile);
            setFileUrl(url);
            setIsDocumentLoaded(false);
            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setFileUrl(null);
        }
    }, [currentFile]);

    /**
     * Watches for PDF page container mutations and hides all pages except active.
     */
    useEffect(() => {
        if (!isDocumentLoaded) return;

        const observer = new MutationObserver((mutations, obs) => {
            const pages = document.querySelectorAll('.rpv-core__inner-page-container');
            if (pages.length > 0) {
                hideAllPages();
                obs.disconnect();
            }
        });

        const container = viewerContainerRef.current;
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        }

        return () => observer.disconnect();
    }, [isDocumentLoaded, hideAllPages]);

    return (
        <div
            className="pdf-viewer__container pt-15"
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '80%',
                height: '100%',
                overflow: 'hidden',
            }}
        >

            {/* Render the PDF viewer when file is available */}
            {fileUrl && (
                <div ref={viewerContainerRef}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[highlightPluginInstance]}
                            initialPage={activeNumber}
                            defaultScale={1.5}
                            onDocumentLoad={handleDocumentLoad}
                            onPageChange={e => setCurrentPage(e.currentPage)}
                            renderLoader={(percentages: number) => (
                                <div style={{ padding: '20px', textAlign: 'center' }}>
                                    Loading... {Math.round(percentages)}%
                                </div>
                            )}
                            theme={{ theme: 'light' }}
                        />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default ViewPDF;
