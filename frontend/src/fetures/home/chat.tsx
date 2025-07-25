import React, { useState } from "react";
import MessageInput from "../../components/layouts/message-input";
import MessageSpace, { type ChatMessage } from "../../components/layouts/message-space";
import { queryPDF } from "../../service/pdf-api";
import type { AxiosResponse } from "axios";
import type { QueryPDFResponse } from "../../types/global-types";

const Chat: React.FC<{ initialMessage: string }> = ({ initialMessage }) => {
    // Use useState to control chatHistory
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
        {
            message: initialMessage,
            sender: 'bot',
            timestamp: 'nil',
            isLoading: false
        }
    ]);


    const onMessageSent = async (message: string) => {

        // Add user message as loading
        setChatHistory(history => [
            ...history,
            {
                message,
                sender: 'user',
                timestamp: Date.now().toString(),
                isLoading: true
            }
        ]);

        // Query PDF and update messages based on response
        const response: AxiosResponse<QueryPDFResponse> = await queryPDF(message);

        setChatHistory(history => {
            // Remove loading state from user's latest message
            const newHistory = [...history];
            // Find last user message with isLoading (just before this one)
            const lastUserIndex = newHistory.slice().reverse().findIndex(
                msg => msg.sender === 'user' && msg.isLoading
            );
            if (lastUserIndex !== -1) {
                // Remove isLoading from most recent user message
                const realIndex = newHistory.length - 1 - lastUserIndex;
                newHistory[realIndex] = {
                    ...newHistory[realIndex],
                    isLoading: false
                };
            }
            // Add bot response as loading (or replace isLoading as needed)
            newHistory.push({
                message: response.data.answer,
                sender: 'bot',
                timestamp: Date.now().toString(),
                isLoading: false // Most likely you want to immediately display, so set isLoading false
            });
            return newHistory;
        });
    };

    return (
        <div className="flex flex-col h-full p-4 pb-0">
            <MessageSpace messages={chatHistory} />
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
