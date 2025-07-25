# MessageInput Component Documentation

This document provides a comprehensive overview of the `MessageInput` React component, which serves as the input field for sending messages in a chat interface. The component is designed to work seamlessly with the previously provided `Chat`, `MessageBubble`, PDF service (`pdf-api.ts`), and banner configurations (`banner-section-desktop.json`, `banner-section-mobile.json`, and `banner-script.js`). It includes enhanced UX features such as input validation, keyboard shortcuts, character limits, and visual feedback for loading and disabled states.

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
The `MessageInput` component is a React functional component that provides a text input field for composing and sending chat messages. It supports features like placeholder text, maximum character limits, keyboard shortcuts (Enter to send, Shift+Enter for new line), and visual feedback for loading and disabled states. The component is used within the `Chat` component to capture user input and trigger API calls via the `queryPDF` service, and it can be integrated with the banner configurations to create a cohesive user experience.

## Component Details

### Props
The `MessageInput` component accepts the following props, defined in the `MessageInputProps` type:

- **`onSendMessage`** (`(message: string) => void`): A callback function triggered when a valid message is submitted.
- **`placeholder`** (`string`, optional): The placeholder text for the input field. Defaults to `"Type a message..."`.
- **`disabled`** (`boolean`, optional): Disables the input field and send button. Defaults to `false`.
- **`maxLength`** (`number`, optional): The maximum number of characters allowed in the input field.
- **`isLoading`** (`boolean`, optional): Indicates if the component is in a loading state (e.g., awaiting a response). Defaults to `false`.

### State
- **`message`** (`string`): Manages the current value of the input field, initialized as an empty string.
  - Updated via `handleChange` when the user types.
  - Cleared after a successful message submission via `handleSubmit`.

### Functionality
- **Input Handling**:
  - The `handleChange` function updates the `message` state with the input value.
  - Supports `maxLength` validation to prevent exceeding the character limit.
- **Form Submission**:
  - The `handleSubmit` function triggers when the form is submitted (via the send button or Enter key).
  - Validates that the message is non-empty (after trimming) and that the component is not loading or disabled.
  - Calls `onSendMessage` with the message and clears the input field.
- **Keyboard Shortcuts**:
  - The `handleKeyPress` function allows submission via the Enter key (without Shift).
  - Shift+Enter is reserved for adding new lines (though not applicable in a single-line input).
- **Send Button**:
  - Enabled only when `canSend` is `true` (message is non-empty, not disabled, not loading).
  - Displays a loading spinner when `isLoading` is `true`, otherwise shows a send arrow icon.
- **Character Count**:
  - Displays a character count (`{message.length} / {maxLength}`) when `maxLength` is defined.
  - Shows a floating indicator when the input length exceeds 80% of `maxLength`, with color changes (amber for nearing limit, red for at limit).

### Styling
- **Form Container**:
  - Uses `w-full` to span the full width of the parent.
- **Input Container**:
  - Styled with `flex items-center w-full`, `rounded-md`, `backdrop-blur-sm`, and `hover:bg-neutral-800/80` for a modern look.
  - Applies `transition-all duration-200` for smooth hover and focus effects.
- **Input Field**:
  - Uses `flex-1 px-4 py-4 pr-14` for padding, `rounded-lg`, `bg-neutral-800/80`, `text-white`, and `border border-neutral-700/50` for a dark theme.
  - Disables outline and ring on focus (`focus:outline-none focus:ring-0`).
  - Applies `disabled:opacity-50 disabled:cursor-not-allowed` for disabled state.
- **Character Count**:
  - Static count: `text-xs text-neutral-500 text-right` below the input.
  - Floating indicator: `text-xs font-medium px-2 py-1 rounded-full`, with `text-amber-400 bg-amber-900/30` or `text-red-400 bg-red-900/30` based on proximity to `maxLength`.
- **Send Button**:
  - Positioned absolutely (`right-2 top-1/2 transform -translate-y-1/2`) with `p-3.5 rounded-sm`.
  - Enabled: `bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95`.
  - Disabled: `bg-neutral-700 text-neutral-500 cursor-not-allowed`.
  - Loading spinner: `w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin`.
  - Send icon: SVG arrow with `w-4 h-4`, `strokeWidth={2}`.

## Dependencies
- **React**: For building the component and managing state with `useState`.
- **Tailwind CSS**: For styling with utility classes.
- **TypeScript Types**:
  - `MessageInputProps`: Defines the shape of the component’s props, imported from `../../types/global-types`.

## Integration with Chat Component
The `MessageInput` component is a core part of the `Chat` component:
- **Role in Chat**:
  - Rendered at the bottom of the `Chat` component (`mt-auto`) to capture user input.
  - The `onSendMessage` prop is wired to the `Chat` component’s `onMessageSent` function, which calls `queryPDF` and updates the `chatHistory`.
- **Loading State**:
  - When `isLoading` is `true` (e.g., during a `queryPDF` call), the input is disabled, and the send button shows a spinner.
- **Example Flow**:
  - User types "Show latest gadgets" and presses Enter.
  - `handleSubmit` calls `onSendMessage`, which triggers `queryPDF` and adds a `MessageBubble` with `isLoading: true`.
  - After the response, a new bot `MessageBubble` is added, and `isLoading` is set to `false` in `MessageInput`.
- **Styling Consistency**:
  - Matches the `MessageBubble` component’s dark theme (`bg-neutral-800/80`, `text-white`) and blue accents (`bg-blue-600`).

## Integration with Banner Configurations
The `MessageInput` component can enhance the user experience when integrated with the banner configurations and `banner-script.js`:
- **CTA Interaction**:
  - The banner’s "Shop Now" button can trigger a predefined message in `MessageInput` (e.g., auto-filling "Show all products" and submitting it).
  - Example: Clicking "Shop Now" calls `onSendMessage("Show latest electronics")`, which triggers `queryPDF` and displays results in `MessageBubble`.
- **Dynamic Content**:
  - Use `queryPDF` to fetch product details and update the banner via `phaseIiPetsHomeBanner`, while `MessageInput` allows users to query related information.
  - Example: User types "List smartphones" → `queryPDF` returns product data → Banner images update, and results appear in a `MessageBubble`.
- **Responsive Design**:
  - Ensure `MessageInput`’s width and styling align with the banner’s layout (e.g., 1351px for desktop, 310px for mobile).
  - Use consistent colors (e.g., `--element-primary-color`) and fonts (e.g., `Fredoka` or `jost`) to match the banner.

## Usage Example
Below is an example of using `MessageInput` within the `Chat` component, integrated with the banner and PDF service:
```jsx