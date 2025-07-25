import React from 'react';
import PageText from '../../util/util';
import type { MessageProps } from '../../types/global-types';

const MessageBubble: React.FC<MessageProps> = ({
    message,
    sender,
    timestamp,
    isLoading = false,
}) => {
    const isUser = sender === 'user';

    return (
        <div className={`
            flex w-full mb-4
            ${isUser ? 'justify-end' : 'justify-start'}
        `}>
            <div className={`
                relative flex flex-col justify-end max-w-[70%] sm:max-w-[60%] group
                ${isUser ? 'ml-auto' : 'mr-auto'}
            `}>
                {/* Message bubble */}
                <div className={`
                    px-4 py-3 w-full rounded-lg text-sm font-medium
                    transition-all duration-200 ease-in-out
                    backdrop-blur-sm
                    ${isUser
                        ? 'bg-blue-600/90 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-neutral-800/80 text-white border border-neutral-700/50'
                    }
                    ${isLoading ? 'animate-pulse' : ''}
                `}>
                    {isLoading ? (
                        <div className="flex items-center w-min ">
                            <div className="flex space-x-1 w-min">
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                                    style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap w-full  break-words leading-relaxed ">
                            <PageText text={message} />
                        </p>
                    )}
                </div>

                {/* Sender label and timestamp */}
                <div className={`
                    flex items-center mt-1 px-1 text-xs text-neutral-500
                    transition-opacity duration-200
                    group-hover:opacity-100 opacity-60
                    ${isUser ? 'justify-end' : 'justify-start'}
                `}>
                    <span className="font-medium">
                        {isUser ? 'You' : 'Assistant'}
                    </span>
                    {timestamp && (
                        <>
                            <span className="mx-1">•</span>
                            <span>{timestamp}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
