# `UploadPrompt` Component Documentation

The `UploadPrompt` component provides a flexible and accessible interface for users to upload files, supporting both drag-and-drop and traditional file input methods. It includes built-in validation for file size and type, and provides clear visual feedback for different states such as dragging, errors, and disabled states.

## Table of Contents

- [Props](#props)
- [Component Logic](#component-logic)
  - [State Management](#state-management)
  - [File Validation (`validateFile`)](#file-validation-validatefile)
  - [File Handling (`handleFiles`)](#file-handling-handlefiles)
  - [Event Handlers](#event-handlers)
    - [`handleFileUpload`](#handlefileupload)
    - [`handleDragOver`](#handledragover)
    - [`handleDragLeave`](#handledragleave)
    - [`handleDrop`](#handledrop)
    - [`handleKeyDown`](#handlekeydown)
  - [Error Handling (`clearError`)](#error-handling-clearerror)
  - [Styling (`containerClasses`, `iconClasses`)](#styling-containerclasses-iconclasses)
- [Usage](#usage)
- [Accessibility](#accessibility)
- [Types](#types)
  - [`UploadPromptProps`](#uploadpromptprops)
  - [`FileUploadError`](#fileuploaderror)

---

## Props

The `UploadPrompt` component accepts the following props:

| Prop Name     | Type                               | Default Value     | Description                                                                                                                                                                                                                                                                                                   |
| :------------ | :--------------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `onFileSelect` | `(files: FileList) => void`        | `undefined`       | **Optional.** A callback function that is invoked when a valid file (or files, though currently only the first file is processed) is successfully selected. It receives a `FileList` object as an argument.                                                                                                    |
| `onError`     | `(error: FileUploadError) => void` | `undefined`       | **Optional.** A callback function that is invoked when a file validation error occurs (e.g., file too large, incorrect file type). It receives a `FileUploadError` object containing details about the error.                                                                                               |
| `maxFileSize` | `number`                           | `10`              | **Optional.** The maximum allowed file size in megabytes (MB). Files exceeding this size will trigger a validation error.                                                                                                                                                                                            |
| `acceptedTypes` | `readonly string[]`                | `['.pdf'] as const` | **Optional.** An array of strings specifying the allowed file extensions (e.g., `['.pdf', '.docx']`). The component will only accept files with these extensions. Note: The `as const` ensures type safety and immutability for the default value.                                                          |
| `className`   | `string`                           | `''`              | **Optional.** Additional CSS class names to apply to the main container `div` of the component, allowing for custom styling.                                                                                                                                                                                       |
| `disabled`    | `boolean`                          | `false`           | **Optional.** If `true`, the upload prompt will be visually and functionally disabled. Users will not be able to select or drag-and-drop files, and the component will render with a reduced opacity and a `not-allowed` cursor. This prop also sets the `aria-disabled` attribute for accessibility. |

---

## Component Logic

### State Management

- `dragActive`: A boolean state (`React.useState<boolean>`) that tracks whether a file is currently being dragged over the dropzone. This state is used to apply visual feedback (e.g., changing border color).
- `error`: A state variable (`React.useState<FileUploadError | null>`) that stores any `FileUploadError` object if a validation error occurs, or `null` if there is no error. This state is used to display error messages and apply error-specific styling.

### File Validation (`validateFile`)

```typescript
const validateFile = (file: File): FileUploadError | null => {
    const fileSizeMB: number = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
        return {
            type: 'size',
            message: `File size must be less than ${maxFileSize}MB`,
            file
        };
    }

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