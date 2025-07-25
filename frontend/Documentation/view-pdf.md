# `ViewPDF` Component Documentation

The `ViewPDF` component provides a robust and professional PDF viewer for React applications, leveraging the `@react-pdf-viewer/core` and `@react-pdf-viewer/highlight` libraries. It focuses on single-page viewing, dynamically loading PDF files, and integrating with an external state management service for active page navigation.

---

### Props

The `ViewPDF` component accepts the following props:

| Prop Name    | Type      | Default Value | Description                                  |
| :----------- | :-------- | :------------ | :------------------------------------------- |
| `pdfFiles`   | `File[]`  | `undefined`   | An **array of PDF File objects** to display. The viewer currently displays only the first file in the array. |
| `onBackToUpload` | `() => void` | `undefined`   | **Optional** callback function triggered when the user navigates back to the upload view. (Note: This prop is defined in the interface but not currently used within the component's logic.) |

---

### Component Logic

The `ViewPDF` component manages several internal states and uses various React hooks to handle PDF loading, display, and interaction.

#### State Management

* `currentFileIndex`: A `useState` hook that tracks the index of the PDF file currently being displayed from the `pdfFiles` array. It's initialized to `0`, meaning it always displays the **first PDF file** in the `pdfFiles` array.
* `fileUrl`: A `useState` hook that stores the `Object URL` created for the currently displayed PDF file. This URL is used by the `@react-pdf-viewer/core` to render the PDF. It's `null` initially.
* `currentPage`: A `useState` hook that holds the **zero-based index** of the page currently being viewed. It's initialized with the `activeNumber` from the `useActiveNumber` service.
* `isDocumentLoaded`: A `useState` hook that becomes `true` once the PDF document has been fully loaded by the viewer.

#### Refs

* `viewerContainerRef`: A `useRef` hook attached to the main `div` element wrapping the `Viewer` component. This ref is used to observe mutations in the DOM, specifically to detect when PDF pages are rendered so that only the active page can be shown.

#### External Hooks

* `useActiveNumber`: This custom hook (imported from `../../service/activePage`) is used to get the `activeNumber`, which represents the currently active page number, presumably managed externally.

#### PDF.js Worker and Plugins

* `Worker`: The `<Worker>` component from `@react-pdf-viewer/core` is used to load the PDF.js worker script, which handles the heavy lifting of parsing and rendering PDFs in a separate thread. The `workerUrl` points to a CDN-hosted version of the worker.
* `highlightPluginInstance`: An instance of the `highlightPlugin` from `@react-pdf-viewer/highlight`. By default, its `trigger` is set to `Trigger.None`, meaning the highlighting functionality is **disabled**. To enable highlighting (e.g., on text selection), this `trigger` property would need to be configured.

#### Core Functions

* `showPage(pageIndex: number)`:
    * This `useCallback` function is responsible for **displaying only the specified page** while hiding all other pages in the PDF viewer.
    * It queries all elements with the class `.rpv-core__inner-page-container` (which are the individual PDF page containers) and sets their `display` style to `'block'` for the target `pageIndex` and `'none'` for all others.

* `goToPage(pageIndex: number)`:
    * This `useCallback` function updates the `currentPage` state and, if the document is already loaded (`isDocumentLoaded` is `true`), it calls `showPage` to immediately navigate to the desired page.

* `hideAllPages()`:
    * This `useCallback` function iterates through all PDF page containers.
    * For the `currentPage`, it sets `display: 'block'` and resets `position`, `top`, `left`, and `transform` styles to ensure it's visible and correctly positioned.
    * For all other pages, it sets `display: 'none'`, and sets `position: 'absolute'`, `top: '0px'`, `left: '0px'`, and `transform: 'translateY(0px)'` to effectively hide them and prevent them from affecting layout when not active.

* `handleDocumentLoad()`:
    * This `useCallback` function is triggered by the `onDocumentLoad` event of the `Viewer` component.
    * It sets `isDocumentLoaded` to `true`, indicating that the PDF document is ready for interaction.

#### `useEffect` Hooks

* **Active Page Synchronization (`useEffect` for `activeNumber`):**
    ```typescript
    useEffect(() => {
        if (isDocumentLoaded && typeof activeNumber === 'number' && activeNumber !== currentPage) {
            goToPage(activeNumber);
        }
    }, [activeNumber, isDocumentLoaded, goToPage, currentPage]);
    ```
    This effect listens for changes in `activeNumber` (from the external service) and `isDocumentLoaded`. If the document is loaded, `activeNumber` is a valid number, and it differs from the `currentPage`, it triggers `goToPage` to navigate to the new `activeNumber`.

* **PDF File URL Management (`useEffect` for `currentFile`):**
    ```typescript
    useEffect(() => {
        if (currentFile && currentFile.type === 'application/pdf') {
            const url = URL.createObjectURL(currentFile);
            setFileUrl(url);
            setIsDocumentLoaded(false); // Reset document loaded state for new file
            return () => {
                URL.revokeObjectURL(url); // Clean up the object URL when component unmounts or file changes
            };
        } else {
            setFileUrl(null);
        }
    }, [currentFile]);
    ```
    This effect runs whenever `currentFile` changes.
    * It checks if `currentFile` exists and is a PDF.
    * If so, it creates an `Object URL` for the file using `URL.createObjectURL()`, sets `fileUrl` to this new URL, and resets `isDocumentLoaded` to `false` (as a new document is about to load).
    * The `return` statement provides a cleanup function that revokes the `Object URL` using `URL.revokeObjectURL()`. This is crucial for preventing memory leaks, especially when the component unmounts or a new PDF is loaded.
    * If `currentFile` is not a PDF or is `null`, `fileUrl` is set to `null`.

* **Page Container Mutation Observer (`useEffect` for `viewerContainerRef`):**
    ```typescript
    useEffect(() => {
        if (!isDocumentLoaded) return;

        const observer = new MutationObserver((mutations, obs) => {
            const pages = document.querySelectorAll('.rpv-core__inner-page-container');
            if (pages.length > 0) {
                hideAllPages();
                obs.disconnect(); // Disconnect once pages are found and hidden
            }
        });

        const container = viewerContainerRef.current;
        if (container) {
            observer.observe(container, { childList: true, subtree: true });
        }

        return () => observer.disconnect(); // Clean up observer on unmount
    }, [isDocumentLoaded, hideAllPages]);
    ```
    This effect sets up a `MutationObserver` to watch for changes within the `viewerContainerRef`.
    * It only runs if `isDocumentLoaded` is `true`.
    * The observer watches for `childList` and `subtree` changes, meaning it detects when elements are added or removed within the viewer container.
    * Once the observer finds at least one `.rpv-core__inner-page-container` element (indicating that PDF pages have been rendered), it calls `hideAllPages()` to enforce single-page viewing and then disconnects the observer, as its purpose has been served for the current document load.
    * A cleanup function is returned to ensure the observer is disconnected when the component unmounts.

---

### Rendering

The component renders a main `div` with styling to control its layout.

* **Conditional Rendering:** The PDF viewer (`Worker` and `Viewer`) is only rendered if `fileUrl` is not `null`, ensuring that the viewer attempts to load a PDF only when a valid file URL is available.
* **`Worker` Component:** Provides the necessary PDF.js worker.
* **`Viewer` Component:**
    * `fileUrl`: Binds the `Object URL` of the PDF.
    * `plugins`: Integrates the `highlightPluginInstance` (though disabled by default).
    * `initialPage`: Sets the initial page to display, based on `activeNumber`.
    * `defaultScale`: Sets the default zoom level for the PDF.
    * `onDocumentLoad`: Triggers the `handleDocumentLoad` callback when the PDF is fully loaded.
    * `onPageChange`: Updates the internal `currentPage` state when the user navigates pages within the viewer.
    * `renderLoader`: Provides a custom loading indicator that shows the loading percentage.
    * `theme`: Sets the viewer's theme to `'light'`.

---

### Usage

To use the `ViewPDF` component, pass an array containing the PDF `File` object(s) you want to display. The component will automatically handle URL creation, loading, and cleanup.

```tsx
import React, { useState } from 'react';
import ViewPDF from './ViewPDF'; // Adjust the import path as needed

const App: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            // Take the first file for simplicity, as ViewPDF currently shows only one
            setSelectedFiles([event.target.files[0]]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
            <h1>PDF Viewer Example</h1>
            <input type="file" accept=".pdf" onChange={handleFileChange} />

            {selectedFiles.length > 0 ? (
                <ViewPDF pdfFiles={selectedFiles} />
            ) : (
                <p>Please select a PDF file to view.</p>
            )}
        </div>
    );
};

export default App;