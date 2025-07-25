# Chat Component Documentation

This document provides a detailed overview of the `Chat` React component, which implements a chat interface with message handling and PDF querying functionality. It also integrates with the provided JSON configurations for desktop and mobile banner sections, as well as the associated JavaScript logic for dynamic updates.

## Table of Contents
- [Overview](#overview)
- [Component Details](#component-details)
  - [Props](#props)
  - [State](#state)
  - [Functionality](#functionality)
- [Dependencies](#dependencies)
- [Integration with Banner JSON](#integration-with-banner-json)
  - [Desktop Banner Configuration](#desktop-banner-configuration)
  - [Mobile Banner Configuration](#mobile-banner-configuration)
  - [Dynamic Updates with `banner-script.js`](#dynamic-updates-with-banner-scriptjs)
- [Usage Example](#usage-example)
- [Styling and Layout](#styling-and-layout)
- [Potential Enhancements](#potential-enhancements)

## Overview
The `Chat` component is a React functional component designed to create an interactive chat interface. It displays a message space for conversation history and an input field for sending messages. The component communicates with a PDF querying service to process user messages and display bot responses. It is styled for a responsive layout and can be integrated with the banner configurations provided in the JSON files for desktop and mobile views.

## Component Details

### Props
The component accepts the following prop:
- **`initialMessage`** (`string`): The initial message displayed in the chat, attributed to the bot.
  - **Example**: `"Welcome to the chat! How can I assist you today?"`

### State
The component uses the `useState` hook to manage the chat history:
- **`chatHistory`** (`ChatMessage[]`): An array of chat messages, each containing:
  - `message`: The text content of the message.
  - `sender`: Either `'user'` or `'bot'`, indicating who sent the message.
  - `timestamp`: A string representing the time the message was sent (or `'nil'` for the initial message).
  - `isLoading`: A boolean indicating if the message is in a loading state (e.g., while awaiting a response).

### Functionality
- **Initialization**: The component initializes with a single bot message provided via the `initialMessage` prop.
- **Message Sending**:
  - When a user sends a message via the `MessageInput` component, it is added to `chatHistory` with `isLoading: true`.
  - The `onMessageSent` function calls the `queryPDF` service with the user's message.
  - Upon receiving a response, the loading state is removed from the user's message, and the bot's response is appended to the history.
- **Rendering**:
  - The `MessageSpace` component displays the `chatHistory`.
  - The `MessageInput` component allows users to input and send messages, with a placeholder and a maximum length of 100 characters.

## Dependencies
The component relies on the following dependencies:
- **React**: For building the component and managing state with `useState`.
- **Axios**: For making HTTP requests to the `queryPDF` service.
- **Custom Components**:
  - `MessageInput`: A component for capturing and sending user messages.
  - `MessageSpace`: A component for displaying the chat history.
- **Type Definitions**:
  - `ChatMessage`: Type for chat messages, including `message`, `sender`, `timestamp`, and `isLoading`.
  - `QueryPDFResponse`: Type for the response from the `queryPDF` service, containing the bot's answer.

## Integration with Banner JSON
The `Chat` component can be integrated with the provided banner configurations for desktop (`banner-section-desktop.json`) and mobile (`banner-section-mobile.json`) views, as well as the dynamic update logic in `banner-script.js`.

### Desktop Banner Configuration
The desktop banner configuration (`banner-section-desktop.json`) defines a banner section with the following features:
- **Structure**:
  - A root `div` with a black background and gradient overlay, sized at 1351px width and 600px height.
  - Contains a heading (`h1`), tagline (`p`), call-to-action (CTA) button, and a rotating image container.
- **Key Elements**:
  - **Heading**: Displays "Elevate Your Tech Experience" with a large font size (93px) and bold weight.
  - **Tagline**: Shows "Introducing our latest electronics curated just for you" with a smaller font size (19px).
  - **CTA Button**: A "Shop Now" button with a hover effect that rotates a blurred highlight.
  - **Rotating Images**: Six circular images arranged in three rows, rotating continuously with CSS animations (`gadgetSpin`, `gadgetRotateCounter1`, etc.).
- **Styles**:
  - Uses CSS custom properties (e.g., `--element-primary-color`) for theming.
  - Includes keyframes for smooth rotation animations and hover effects.
  - Positions elements absolutely for precise layout control.

### Mobile Banner Configuration
The mobile banner configuration (`banner-section-mobile.json`) is similar but optimized for smaller screens:
- **Structure**:
  - A root `div` with a variable background color and 310px canvas width.
  - Contains a background div, heading, tagline, CTA button, and a smaller rotating image container.
- **Key Elements**:
  - **Heading**: Same text as desktop but with a smaller font size (48px) and a different font family (`jost, sans-serif`).
  - **Tagline**: Same text but with a 20.5px font size and adjusted positioning.
  - **CTA Button**: Identical to desktop but positioned differently (top: 305px, left: 30px).
  - **Rotating Images**: Six circular images, smaller in size (192px x 192px), with the same rotation animations.
- **Styles**:
  - Similar CSS animations and hover effects as the desktop version.
  - Adjusted dimensions and positions for mobile responsiveness.

### Dynamic Updates with `banner-script.js`
The `banner-script.js` file provides a function (`phaseIiPetsHomeBanner`) to dynamically update the banner configurations based on an `oldJson` object. Key functionality includes:
- **Desktop Updates**:
  - Modifies the heading text, color, font size, family, weight, style, and decoration based on `oldJson.details`.
  - Updates the tagline similarly.
  - Updates the source URLs for the six rotating images.
- **Mobile Updates**:
  - Similar modifications to the heading, tagline, and CTA button text and styles.
  - Updates image URLs for the mobile banner.
- **Position Mapping**:
  - Includes a `positionMap` object to translate positional keywords (e.g., `start start`, `center end`) into CSS properties (`left`, `top`, `right`, `bottom`).
- **Usage**: The function takes `oldJson` (containing updated content) and `newJson` (containing desktop and mobile JSON configurations) and returns the modified `newJson`.

### Integration Notes
To integrate the banner with the `Chat` component:
1. **Banner Display**: Render the banner above or beside the chat interface, using the desktop or mobile JSON based on the device's screen size.
2. **Dynamic Updates**: Use the `phaseIiPetsHomeBanner` function to update banner content dynamically, e.g., when fetching new product data or user preferences.
3. **Responsive Design**: Detect the device type (e.g., via `window.matchMedia`) and apply the appropriate JSON configuration.
4. **Event Handling**: Link the CTA button's `href` to a relevant page or trigger a chat interaction (e.g., sending a predefined message like "Show me the latest electronics").

## Usage Example
```jsx
import React from 'react';
import Chat from './Chat';

const App: React.FC = () => {
  return (
    <div>
      {/* Banner Section (Desktop or Mobile) */}
      <div className="banner-section">
        <h1 className="banner-heading">Elevate Your Tech Experience</h1>
        <p className="banner-tagline">Introducing our latest electronics curated just for you</p>
        <div className="banner-cta-container">
          <a href="#" className="banner-cta-button">Shop Now</a>
          <div className="hover-highlight"></div>
        </div>
        {/* Rotating image container */}
        <div className="circle-animation-container">
          {/* Add rotating images as per JSON */}
        </div>
      </div>
      <Chat initialMessage="Welcome to our tech store! Ask about our latest products." />
    </div>
  );
};