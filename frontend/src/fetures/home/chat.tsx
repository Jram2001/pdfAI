import React from "react";
import MessageInput from "../../components/layouts/message-input";
import MessageSpace from "../../components/layouts/message-space";

const Chat: React.FC = () => {

    const onMessageSent = (message: string) => {
        // Handle message send here (e.g., log, send to API, update UI)
        console.log("Message sent:", message);
    };

    return (
        <div className="flex flex-col h-full p-4 pb-1">
            <MessageSpace />
            {/* Chat messages could be shown above this */}
            <div className="mt-auto">
                <MessageInput
                    onSendMessage={onMessageSent}
                    placeholder="Send message"
                    disabled={false}
                    maxLength={100}
                />
            </div>
        </div>
    );
};

export default Chat;
