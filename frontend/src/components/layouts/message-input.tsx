import React, { useState } from 'react';

interface MessageInputProps {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    isLoading?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    placeholder = "Type a message...",
    disabled = false,
    maxLength,
    isLoading = false
}) => {
    const [message, setMessage] = useState<string>('');
    const [isFocused, setIsFocused] = useState<boolean>(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (message.trim() && !isLoading) {
            onSendMessage(message);
            setMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    };

    const canSend = message.trim() && !disabled && !isLoading;

    return (
        <form onSubmit={handleSubmit} className="w-full">

            {/* Optional: Message length indicator at bottom */}
            {maxLength && (
                <div className="mt-2 text-xs text-neutral-500 text-right">
                    {message.length} / {maxLength} characters
                </div>
            )}
            <div className={`
                relative flex items-center w-full transition-all duration-200 
                bg-transparent
                border-neutral-700 focus:border-4 
                border rounded-md bg-neutral-800/60 backdrop-blur-sm
                hover:border-neutral-600 hover:bg-neutral-800/80
            `}>
                <input
                    type="text"
                    value={message}
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={placeholder}
                    className="
                        flex-1 px-4 py-4 pr-14 
                        bg-neutral-600/20 text-white placeholder-neutral-400
                        focus:outline-none focus:ring-0
                        disabled:opacity-50 disabled:cursor-not-allowed
                        text-sm font-medium
                    "
                    disabled={disabled || isLoading}
                    maxLength={maxLength}
                    autoComplete="off"
                />

                {/* Character count indicator */}
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
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
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
