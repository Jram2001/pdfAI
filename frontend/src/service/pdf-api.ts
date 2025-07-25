import axios, { type AxiosResponse } from 'axios';
import type { UploadPDFResponse, QueryPDFResponse, SimpleQueryPDFResponse } from '../types/global-types';

// Replace with your actual backend URL
const BASE_URL = `https://pdfai-1-30gd.onrender.com/pdf`;

// --- Services ---

export const uploadPDF = async (pdfFile: File): Promise<AxiosResponse<UploadPDFResponse>> => {
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    return axios.post<UploadPDFResponse>(`${BASE_URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const queryPDF = async (queryText: string): Promise<AxiosResponse<QueryPDFResponse>> => {
    return axios.post<QueryPDFResponse>(`${BASE_URL}/query`, { query: queryText });
};

export const simpleQueryPDF = async (queryText: string): Promise<AxiosResponse<SimpleQueryPDFResponse>> => {
    return axios.post<SimpleQueryPDFResponse>(`${BASE_URL}/query-simple`, { query: queryText });
};
