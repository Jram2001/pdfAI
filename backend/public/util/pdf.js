const cosine = require('cosine-similarity');

const memoryStore = [];
const { GoogleGenerativeAI } = require('@google/generative-ai');
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ───── Helper: Chunk long text into smaller pieces ─────
function chunkText(text, maxWords = 300) {
    const sentences = text.split('. ');
    const chunks = [];
    let chunk = [];

    for (const sentence of sentences) {
        chunk.push(sentence);
        if (chunk.join(' ').split(' ').length > maxWords) {
            chunks.push(chunk.join('. ') + '.');
            chunk = [];
        }
    }

    if (chunk.length) chunks.push(chunk.join('. ') + '.');
    return chunks;
}

// ───── Helper: Generate embedding using Gemini API ─────
async function getEmbedding(text) {
    const embeddingModel = genAI.getGenerativeModel({ model: 'embedding-001' });
    const result = await embeddingModel.embedContent({
        content: { parts: [{ text }] },
    });
    return result.embedding.values;
}

// ───── Helper: Find most relevant chunks by cosine similarity ─────
function findTopChunks(queryEmbedding, topN = 3) {
    const scored = memoryStore.map(({ text, embedding, pageNumber }) => ({
        text,
        pageNumber,
        score: cosine(queryEmbedding, embedding),
    }));

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topN);
}


module.exports = { findTopChunks, getEmbedding, chunkText, genAI, memoryStore }