import React, { useState, useEffect } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { highlightPlugin, Trigger } from '@react-pdf-viewer/highlight';
import './view-pdf.css'
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/highlight/lib/styles/index.css';

interface PDFViewerProps {
    pdfFiles: File[];
    onBackToUpload?: () => void;
}

interface HighlightArea {
    pageIndex: number;
    height: number;
    width: number;
    left: number;
    top: number;
}

const ViewPDF: React.FC<PDFViewerProps> = ({ pdfFiles, onBackToUpload }) => {
    const [currentFileIndex, setCurrentFileIndex] = useState<number>(0);
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [highlightAreas, setHighlightAreas] = useState<HighlightArea[]>([]);

    const currentFile = pdfFiles[currentFileIndex];

    // Only use highlight plugin - NO defaultLayoutPlugin
    const highlightPluginInstance = highlightPlugin({
        trigger: Trigger.None,
    });

    useEffect(() => {
        if (currentFile && currentFile.type === 'application/pdf') {
            const url = URL.createObjectURL(currentFile);
            setFileUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        } else {
            setFileUrl(null);
        }
    }, [currentFile]);

    const renderHighlights = React.useCallback((props: any) => {
        return (
            <div>
                {highlightAreas
                    .filter((area) => area.pageIndex === props.pageIndex)
                    .map((area, idx) => (
                        <div
                            key={idx}
                            className="highlight-area"
                            style={{
                                ...props.getCssProperties(area, props.rotation),
                                background: 'yellow',
                                opacity: 0.4,
                                position: 'absolute',
                            }}
                        />
                    ))}
            </div>
        );
    }, [highlightAreas]);

    return (
        <div className='hello' style={{ display: 'flex', flexDirection: 'column', width: '80%' }}>
            {fileUrl && (
                <div style={{ flex: 1 }}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={fileUrl}
                            plugins={[highlightPluginInstance]}
                            renderHighlights={renderHighlights}
                        />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default ViewPDF;
