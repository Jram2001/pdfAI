const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const cosine = require('cosine-similarity');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const memoryStore = []; // { text, embedding }

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
    const scored = memoryStore.map(({ text, embedding }) => ({
        text,
        score: cosine(queryEmbedding, embedding),
    }));

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topN)
        .map((x) => x.text);
}

// ───── Endpoint: Upload and embed a PDF ─────
router.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const filePath = path.join(__dirname, '..', req.file.path);
        const dataBuffer = fs.readFileSync(filePath);
        const parsed = await pdf(dataBuffer);
        const chunks = chunkText(parsed.text, 300);

        for (const chunk of chunks) {
            const embedding = await getEmbedding(chunk);
            memoryStore.push({ text: chunk, embedding });
        }

        fs.unlinkSync(filePath); // Clean up uploaded file
        res.json({ message: 'PDF processed and vectorized.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to process PDF.' });
    }
});

// ───── Endpoint: Query embedded PDF using Gemini ─────
router.post('/query', async (req, res) => {
    try {
        const { query } = req.body;
        const queryEmbedding = await getEmbedding(query);
        const topChunks = findTopChunks(queryEmbedding);

        const prompt = `Answer the following question using only the information from the context below:\n\n${topChunks.join(
            '\n\n'
        )}\n\nQuestion: ${query}`;

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt);
        const text = result.response.candidates?.[0]?.content?.parts?.[0]?.text;

        res.json({ answer: text || 'No response from Gemini.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get response from Gemini.' });
    }
});

module.exports = router;
