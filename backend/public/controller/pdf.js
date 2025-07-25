const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const { findTopChunks, getEmbedding, chunkText, genAI, memoryStore } = require('../util/pdf')

async function processPDF(req, res) {
    try {
        const filePath = req.file.path;
        const dataBuffer = fs.readFileSync(filePath);

        // Get total pages first
        const parsed = await pdf(dataBuffer);
        const totalPages = parsed.numpages;

        // Process each page individually to maintain accurate page references
        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
            const pageData = await pdf(dataBuffer, {
                max: pageNum,
                min: pageNum
            });

            if (pageData.text.trim()) {
                const chunks = chunkText(pageData.text, 300);

                for (const chunk of chunks) {
                    const embedding = await getEmbedding(chunk);
                    memoryStore.push({
                        text: chunk,
                        embedding,
                        pageNumber: pageNum // Exact page number
                    });
                }
            }
        }

        fs.unlinkSync(filePath); // Clean up uploaded file
        console.log(`PDF processed: ${totalPages} pages, ${memoryStore.length} chunks stored`);
        res.json({
            message: 'PDF uploaded and processed successfully. You can now send queries to extract information.',
            totalPages: totalPages,
            chunksStored: memoryStore.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process PDF.' });
    }
}

async function userQuerry(req, res) {
    try {
        const { query } = req.body;
        const queryEmbedding = await getEmbedding(query);
        const topChunks = findTopChunks(queryEmbedding);

        // Create context with page citations
        const contextWithCitations = topChunks.map((chunk, index) =>
            `[Page ${chunk.pageNumber}] ${chunk.text}`
        ).join('\n\n');

        const prompt = `Answer the following question using only the information from the context below. When referencing information, include the page number citation like (Page X).

Context:
${contextWithCitations}

Question: ${query}

Instructions: After each piece of information, include the page reference in parentheses like (Page 5). If multiple pages were refered it should be lile (page 1)(page 2)`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

        // Get unique pages used
        const pagesUsed = [...new Set(topChunks.map(chunk => chunk.pageNumber))].sort((a, b) => a - b);

        res.json({
            answer: text || 'No response from Gemini.',
            pagesUsed: pagesUsed,
            totalRelevantChunks: topChunks.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get response from Gemini.' });
    }
}

async function simpleQuerry(req, res) {
    try {
        const { query } = req.body;
        const queryEmbedding = await getEmbedding(query);
        const topChunks = findTopChunks(queryEmbedding);

        const context = topChunks.map(chunk => chunk.text).join('\n\n');
        const prompt = `Answer the following question using only the information from the context below:\n\n${context}\n\nQuestion: ${query}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

        // Just return the pages where info was found
        const pagesUsed = [...new Set(topChunks.map(chunk => chunk.pageNumber))].sort((a, b) => a - b);

        res.json({
            answer: text || 'No response from Gemini.',
            foundOnPages: pagesUsed,
            totalRelevantChunks: topChunks.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get response from Gemini.' });
    }
}

module.exports = { processPDF, userQuerry, simpleQuerry };
