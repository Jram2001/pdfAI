import React from 'react';
import MessageBubble from './message-bubble';
import type { ChatHistoryProps } from '../../types/global-types';

const MessageSpace: React.FC<ChatHistoryProps> = ({ messages }) => {

    return (
        <>
            {messages.map((msg, index) => (
                <MessageBubble
                    key={index}
                    message={messages[index].message}
                    sender={msg.sender}
                    timestamp={msg.timestamp}
                    isLoading={msg.isLoading}
                />
            ))}
        </>
    );
};

export default MessageSpace;