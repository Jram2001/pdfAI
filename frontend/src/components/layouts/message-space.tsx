import React from 'react';
import MessageBubble from './message-bubble';

const MessageSpace: React.FC = () => {
    return (
        <div className="space-y-2 p-4">
            <MessageBubble
                message="Hello! How can I help you today?"
                sender="bot"
                timestamp="2:30 PM"
            />

            <MessageBubble
                message="I need help with my React component"
                sender="user"
                timestamp="2:31 PM"
            />

            <MessageBubble
                message="I'd be happy to help! What specific issue are you having with your React component?"
                sender="bot"
                timestamp="2:31 PM"
            />

            {/* Loading message */}
            <MessageBubble
                message=""
                sender="bot"
                isLoading={true}
            />
        </div>
    );
};

export default MessageSpace;
