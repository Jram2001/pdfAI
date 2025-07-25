# Home Component Documentation

This document provides a comprehensive overview of the `Home` React component, which serves as the main entry point for a web application integrating a PDF upload feature, a chat interface, and a PDF viewer. The component orchestrates the interactions between the `UploadPrompt`, `Chat`, `ViewPDF`, and PDF service (`pdf-api.ts`) components, and it aligns with the provided banner configurations (`banner-section-desktop.json`, `banner-section-mobile.json`, and `banner-script.js`) to create a cohesive user experience for a product-focused application.

## Table of Contents
- [Overview](#overview)
- [Component Details](#component-details)
  - [Props](#props)
  - [State](#state)
  - [Functionality](#functionality)
  - [Styling](#styling)
- [Dependencies](#dependencies)
- [Integration with Chat Component](#integration-with-chat-component)
- [Integration with Banner Configurations](#integration-with-banner-configurations)
- [Usage Example](#usage-example)
- [Accessibility](#accessibility)
- [Potential Enhancements](#potential-enhancements)

## Overview
The `Home` component is a React functional component that manages the main application interface. It conditionally renders either an `UploadPrompt` for uploading PDF files or a split layout containing the `Chat` component and `ViewPDF` component once a file is uploaded. It integrates with the `uploadPDF` service from `pdf-api.ts` to handle file uploads and uses `react-pdf` for PDF rendering. The component can be extended to work with the banner configurations to create a dynamic, product-focused user experience.

## Component Details

### Props
The `Home` component does not accept any props, as it serves as the top-level container for the application.

### State
The component uses the `useState` hook to manage the following state variables:
- **`uploadedFile`** (`File[]`): An array of uploaded files, typically containing a single PDF file.
- **`isFileUploaded`** (`boolean`): Controls whether to show the `UploadPrompt` (`false`) or the `Chat` and `ViewPDF` layout (`true`).
- **`initialMessage`** (`string`): Stores the message returned from the `uploadPDF` response, passed to the `Chat` component as the initial bot message.

### Functionality
- **PDF Upload Handling**:
  - The `handleFileSelect` function processes file selections from the `UploadPrompt` component, converts the `FileList` to an array, and uploads the first file using `uploadPDF`.
  - On successful upload, it sets `initialMessage` to the response’s `message` field, sets `isFileUploaded` to `true`, and stores the file in `uploadedFile`.
  - Catches and logs errors (Axios-specific or generic) using `handleError`.
- **UI Reset**:
  - The `handleBackToUpload` function resets the UI to the upload prompt by clearing `uploadedFile` and setting `isFileUploaded` to `false`.
- **PDF Rendering Setup**:
  - Configures `react-pdf` by setting the `pdfjs.GlobalWorkerOptions.workerSrc` to a CDN-hosted worker script for PDF rendering.
- **Conditional Rendering**:
  - If `isFileUploaded` is `false`, renders the `UploadPrompt` component with a maximum file size of 5MB and accepted file types (`.pdf`, `.doc`, `.docx`).
  - If `isFileUploaded` is `true`, renders a split layout with `Chat` (using `initialMessage`) and `ViewPDF` (using `uploadedFile` and `handleBackToUpload`).

### Styling
- **UploadPrompt**:
  - Styled with `max-w-md mx-auto` to center it with a maximum width.
- **Split Layout**:
  - Uses `w-full box-border h-1/1 flex relative` to create a full-width, flexible container.
- **Chat Container**:
  - Styled with `h-1/1 w-1/2 overflow-hidden relative` to occupy half the width and full height, with overflow handling.
- **PDF Viewer Container**:
  - Styled with `h-full w-1/2 flex items-center justify-center bg-neutral-800/80 text-white border border-neutral-700/50 rounded-lg pdf-canvas-container` for a dark-themed, centered PDF viewer with a subtle border.
- **External CSS**:
  - Imports `home.css` for additional styling, though specific styles are not provided in the code.

## Dependencies
- **React**: For building the component and managing state with `useState`.
- **react-pdf**: For rendering PDF files in the `ViewPDF` component, with `pdfjs` configured for the worker script.
- **Axios**: For handling HTTP requests in the `uploadPDF` service.
- **Components**:
  - `UploadPrompt`: Handles file selection and validation.
  - `Chat`: Displays the chat interface with messages.
  - `ViewPDF`: Renders the uploaded PDF file.
- **Services**:
  - `uploadPDF` from `pdf-api.ts`: Uploads PDF files to the backend.
- **TypeScript Types**:
  - `UploadPDFResponse`: Defines the structure of the upload response (`message`, `totalPages`, `chunksStored`).
  - `FileUploadError`: Type for upload error details, used in `UploadPrompt`.
- **External CSS**:
  - `home.css`: Provides additional styling for the component.

## Integration with Chat Component
The `Home` component integrates directly with the `Chat` component:
- **Chat Initialization**:
  - The `Chat` component is rendered when `isFileUploaded` is `true`, receiving `initialMessage` from the `uploadPDF` response.
  - Example: After uploading a PDF, the backend might return `message: "PDF uploaded successfully! Ask about the content."`, which is displayed as the initial bot message in `Chat`.
- **Data Flow**:
  - User uploads a PDF via `UploadPrompt` → `handleFileSelect` calls `uploadPDF` → `initialMessage` is set → `Chat` renders with the initial message.
  - The `Chat` component uses `queryPDF` to handle user queries, which are displayed in `MessageSpace` using `MessageBubble` components.
- **Layout**:
  - The `Chat` component occupies half the screen width (`w-1/2`) alongside the `ViewPDF` component, creating a split-screen experience.

## Integration with Banner Configurations
The `Home` component can be enhanced by integrating with the banner configurations (`banner-section-desktop.json`, `banner-section-mobile.json`) and `banner-script.js`:
- **Banner Placement**:
  - Add the banner above the `UploadPrompt` or split layout, using the desktop (1351px) or mobile (310px) configuration based on screen size.
  - Example: Render the banner with "Elevate Your Tech Experience" and rotating product images.
- **CTA Interaction**:
  - Link the banner’s "Shop Now" button to trigger a `queryPDF` call (e.g., "Show latest products"), with results displayed in the `Chat` component’s `MessageSpace`.
  - Example: Clicking "Shop Now" auto-fills `MessageInput` with a query or directly triggers a bot response.
- **Dynamic Content**:
  - Use `queryPDF` to fetch product details from a PDF catalog and update the banner via `phaseIiPetsHomeBanner`.
  - Example: Query "List smartphones" → Update banner images with smartphone URLs and display details in `MessageBubble`.
- **Responsive Design**:
  - Ensure the banner and `Home` layout adapt to screen size, using media queries or `window.matchMedia` to switch between desktop and mobile configurations.
  - Align colors (e.g., `--element-primary-color`) and fonts (e.g., `Fredoka`, `jost`) for consistency.

## Usage Example
Below is an example of the `Home` component integrated with the banner and other components:
```jsx
import React, { useState } from 'react';
import UploadPrompt from './UploadPrompt';
import Chat from './Chat';
import ViewPDF from './ViewPDF';
import { uploadPDF } from './pdf-api';
import { pdfjs } from 'react-pdf';
import './home.css';

export interface UploadPDFResponse {
  message: string;
  totalPages: number;
  chunksStored: number;
}

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File[]>([]);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');

  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

  const handleFileSelect = async (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFile(fileArray);
    try {
      const response = await uploadPDF(fileArray[0]);
      setInitialMessage(response.data.message);
      setIsFileUploaded(true);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const handleError = (error: FileUploadError) => {
    console.error('Upload error:', error);
  };

  const handleBackToUpload = () => {
    setIsFileUploaded(false);
    setUploadedFile([]);
  };
}