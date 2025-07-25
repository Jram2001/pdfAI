import React, { useState } from 'react';
import type { MessageInputProps } from '../../types/global-types';

/**
 * MessageInput - Chat input component with enhanced UX features
 * Provides message composition with validation, keyboard shortcuts, and visual feedback
 */
const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    placeholder = "Type a message...",
    disabled = false,
    maxLength,
    isLoading = false
}) => {
    // Component state
    const [message, setMessage] = useState<string>('');

    /**
     * Handles form submission - validates and sends message
     */
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage(''); // Clear input after sending
        }
    };

    /**
     * Handles Enter key submission (Shift+Enter for new line)
     */
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handleSubmit(e as any);
        }
    };

    /**
     * Updates message state with input validation
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    // Computed send button state
    const canSend = message.trim() && !disabled && !isLoading;

    return (
        <form onSubmit={handleSubmit} className="w-full">

            {/* Character count display (optional) */}
            {maxLength && (
                <div className="mt-2 text-xs text-neutral-500 text-right">
                    {message.length} / {maxLength} characters
                </div>
            )}

            {/* Main input container with focus/hover effects */}
            <div className={`
                relative flex items-center w-full transition-all duration-200 
                focus:border-4 
                rounded-md  backdrop-blur-sm
                hover:bg-neutral-800/80
            `}>
                {/* Text input field */}
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="
                        flex-1 px-4 py-4 pr-14 
                        rounded-lg
                        bg-neutral-800/80 text-white border border-neutral-700/50
                        focus:outline-none focus:ring-0
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm font-medium
                    "
                    disabled={disabled || isLoading}
                    maxLength={maxLength}
                    autoComplete="off"
                />

                {/* Floating character count indicator (appears when nearing limit) */}
                {maxLength && message.length > maxLength * 0.8 && (
                    <div className="absolute right-16 top-1/2 transform -translate-y-1/2">
                        <span className={`
                            text-xs font-medium px-2 py-1 rounded-full
                            ${message.length >= maxLength
                                ? 'text-red-400 bg-red-900/30'
                                : 'text-amber-400 bg-amber-900/30'
                            }
                        `}>
                            {message.length}/{maxLength}
                        </span>
                    </div>
                )}

                {/* Send button with loading and disabled states */}
                <button
                    type="submit"
                    disabled={!canSend}
                    className={`
                        absolute right-2 top-1/2 transform -translate-y-1/2
                        !p-3    .5 rounded-sm font-medium text-sm
                        transition-all duration-200 ease-in-out
                        focus:outline-none focus:ring-2 focus:ring-blue-500/50
                        ${canSend
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/25 active:scale-95'
                            : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
                        }
                    `}
                    aria-label="Send message"
                >
                    {isLoading ? (
                        // Loading spinner
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        // Send arrow icon
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    )}
                </button>
            </div>
        </form>
    );
};

export default MessageInput;