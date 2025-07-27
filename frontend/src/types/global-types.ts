// --- Types for API responses (adjust as needed for your real API) ---
export interface UploadPDFResponse {
    message: string;
    totalPages: number;
    chunksStored: number;
}

export interface QueryPDFResponse {
    answer: string;
    pagesUsed: number[];
    totalRelevantChunks: number;
}

export interface SimpleQueryPDFResponse {
    answer: string;
    foundOnPages: number[];
    totalRelevantChunks: number;
}

export interface ActiveNumberContextType {
    activeNumber: number;
    increment: () => void;
    decrement: () => void;
    setNumber: (num: number) => void;
}


export interface ChatMessage {
    message: string;
    sender: 'bot' | 'user';
    timestamp?: string;
    isLoading?: boolean;
}

export interface QueryPDFResponse {
    answer: string;
    pagesUsed: number[];
    totalRelevantChunks: number;
}


export interface UploadPromptProps {
    onFileSelect?: (files: FileList) => void;
    onError?: (error: FileUploadError) => void;
    maxFileSize?: number;
    acceptedTypes?: readonly string[];
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
}

export interface FileUploadError {
    readonly type: 'size' | 'type' | 'general';
    readonly message: string;
    readonly file?: File;
}


export interface MessageProps {
    message: string;
    sender: 'user' | 'bot';
    timestamp?: string;
    isLoading?: boolean;
}

export interface MessageInputProps {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    disabled?: boolean;
    maxLength?: number;
    isLoading?: boolean;
}


export interface ChatMessage {
    message: string;
    sender: 'bot' | 'user';
    timestamp?: string;
    isLoading?: boolean;
}

export interface ChatHistoryProps {
    messages: ChatMessage[];
}
