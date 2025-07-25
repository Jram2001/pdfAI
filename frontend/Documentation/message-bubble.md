# MessageBubble Component Documentation

This document provides a comprehensive overview of the `MessageBubble` React component, which is responsible for rendering individual chat messages in a chat interface. The component is designed to work with the previously provided `Chat` component, PDF service module (`pdf-api.ts`), and banner configurations (`banner-section-desktop.json`, `banner-section-mobile.json`, and `banner-script.js`). It displays messages with dynamic styling based on the sender (user or bot) and supports a loading state.

## Table of Contents
- [Overview](#overview)
- [Component Details](#component-details)
  - [Props](#props)
  - [Functionality](#functionality)
  - [Styling](#styling)
- [Dependencies](#dependencies)
- [Integration with Chat Component](#integration-with-chat-component)
- [Integration with Banner Configurations](#integration-with-banner-configurations)
- [Usage Example](#usage-example)
- [Accessibility](#accessibility)
- [Potential Enhancements](#potential-enhancements)

## Overview
The `MessageBubble` component is a React functional component that renders a single chat message in a styled bubble. It supports different appearances for user and bot messages, includes a loading animation, and displays sender information and timestamps. The component is used within the `MessageSpace` component of the `Chat` interface and can be integrated with the banner configurations to enhance a product-focused chat experience.

## Component Details

### Props
The `MessageBubble` component accepts the following props, defined in the `MessageProps` type:

- **`message`** (`string`): The text content of the message to display.
- **`sender`** (`string`): Indicates the sender of the message, either `'user'` or `'bot'`.
- **`timestamp`** (`string`): A string representing the time the message was sent (or `'nil'` for initial messages).
- **`isLoading`** (`boolean`, optional): Indicates if the message is in a loading state. Defaults to `false`.

### Functionality
- **Message Rendering**:
  - Displays the `message` prop inside a styled bubble using the `PageText` component for text rendering.
  - If `isLoading` is `true`, shows a loading animation with three bouncing dots instead of the message text.
- **Sender-Based Styling**:
  - User messages (`sender === 'user'`): Right-aligned, blue background (`bg-blue-600/90`), white text, and a shadow effect.
  - Bot messages (`sender === 'bot'`): Left-aligned, dark background (`bg-neutral-800/80`), white text, and a subtle border.
- **Sender Label and Timestamp**:
  - Displays "You" for user messages and "Assistant" for bot messages.
  - Shows the `timestamp` if provided, separated by a bullet (`•`).
  - The label and timestamp have a hover effect that increases opacity when the parent container is hovered.
- **Responsive Layout**:
  - Uses Tailwind CSS for responsive styling, with a maximum width of 70% on mobile and 60% on larger screens.

### Styling
- **Container**:
  - Uses `flex` and `w-full` for full-width layout, with `mb-4` for spacing between messages.
  - Aligns messages to the right (`justify-end`) for users and left (`justify-start`) for bots.
- **Bubble**:
  - Applies `px-4 py-3` for padding, `rounded-lg` for rounded corners, and `text-sm font-medium` for text styling.
  - User bubble: `bg-blue-600/90`, `text-white`, `shadow-lg shadow-blue-500/20`.
  - Bot bubble: `bg-neutral-800/80`, `text-white`, `border border-neutral-700/50`.
  - Loading state: Adds `animate-pulse` for a pulsing effect.
- **Loading Animation**:
  - Three dots (`w-2 h-2`, `bg-neutral-400`, `rounded-full`) with `animate-bounce` and staggered delays (`0ms`, `150ms`, `300ms`).
- **Sender Label and Timestamp**:
  - Uses `text-xs text-neutral-500` for small, muted text.
  - Applies `group-hover:opacity-100 opacity-60` for a hover effect that increases visibility.
  - Aligns to the right for user messages and left for bot messages.

## Dependencies
- **React**: For building the functional component.
- **Tailwind CSS**: For styling the component with utility classes.
- **PageText**: A utility component for rendering text, likely handling formatting or sanitization.
- **TypeScript Types**:
  - `MessageProps`: Defines the shape of the component’s props, imported from `../../types/global-types`.

## Integration with Chat Component
The `MessageBubble` component is designed to be used within the `MessageSpace` component of the `Chat` interface:
- **Role in Chat**:
  - Each message in the `chatHistory` array (managed by the `Chat` component) is rendered as a `MessageBubble`.
  - The `message`, `sender`, `timestamp`, and `isLoading` props are passed from the `chatHistory` entries.
- **Loading State**:
  - When a user sends a message, the `Chat` component sets `isLoading: true` for the user’s message until the `queryPDF` response is received.
  - The loading animation in `MessageBubble` provides visual feedback during this period.
- **Example Flow**:
  - User sends: "What are the latest gadgets?" → `Chat` adds a `MessageBubble` with `isLoading: true`.
  - `queryPDF` returns a response → `Chat` updates the user message to `isLoading: false` and adds a bot `MessageBubble` with the response.
- **Styling Consistency**:
  - The `Chat` component’s `flex flex-col h-full p-4 pb-0` layout ensures `MessageBubble` components stack vertically with proper spacing.

## Integration with Banner Configurations
The `MessageBubble` component can enhance the user experience when integrated with the banner configurations (`banner-section-desktop.json`, `banner-section-mobile.json`) and `banner-script.js`:
- **Dynamic Content Display**:
  - Use `queryPDF` from the PDF service to fetch product details and display them as bot messages in `MessageBubble`.
  - Example: A user query like "Show smartphones" triggers a bot `MessageBubble` with product details, complementing the banner’s rotating product images.
- **CTA Interaction**:
  - The banner’s "Shop Now" button can trigger a `queryPDF` call, with the response displayed in a `MessageBubble`.
  - Example: Clicking "Shop Now" sends "Show latest electronics" to `queryPDF`, and the result appears as a bot message.
- **Responsive Design**:
  - Ensure `MessageBubble` styling aligns with the banner’s aesthetic (e.g., using similar colors like `--element-primary-color` or fonts like `Fredoka`).
  - Adjust `max-w-[70%]` and `sm:max-w-[60%]` to fit alongside the banner on different screen sizes.
- **Dynamic Updates**:
  - Use `phaseIiPetsHomeBanner` to update banner content based on `queryPDF` results, while `MessageBubble` displays detailed product information in the chat.

## Usage Example
Below is an example of using `MessageBubble` within the `MessageSpace` component, integrated with the `Chat` component and banner:
```jsx
import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { queryPDF } from './pdf-api';

const MessageSpace: React.FC<{ messages: ChatMessage[] }> = ({ messages }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          message={msg.message}
          sender={msg.sender}
          timestamp={msg.timestamp}
          isLoading={msg.isLoading}
        />
      ))}
    </div>
  );
};

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState([
    { message: 'Welcome to our tech store!', sender: 'bot', timestamp: 'nil', isLoading: false },
  ]);