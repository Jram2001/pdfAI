const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');
const cosine = require('cosine-similarity');
require('dotenv').config();
const { processPDF, userQuerry, simpleQuerry } = require('../public/controller/pdf');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });
const memoryStore = [];

router.post('/upload', upload.single('pdf'), processPDF);
router.post('/query', userQuerry);
router.post('/query-simple', simpleQuerry);

module.exports = router;
